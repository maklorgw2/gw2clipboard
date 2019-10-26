using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Windows.Forms;

namespace GW2Clipboard
{
    public partial class HostForm : FormBase
    {
        HotKey hotKeys;
        public HostBridge hostBridge;
        string appFileName;
        bool firstRun = true;

        #region HostForm
        public HostForm()
        {
            InitializeComponent();

            this.Load += HostForm_Load;
            this.FormClosing += HostForm_FormClosing;

            // Custom chrome start
            this.Activated += HostForm_Activated;
            this.Deactivate += HostForm_Deactivate;
            this.ResizeEnd += HostForm_ResizeEnd;

            foreach (var control in new[] { MinimizeLabel, CloseLabel })
            {
                control.MouseEnter += (s, e) => SetLabelColors((Control)s, MouseState.Hover);
                control.MouseLeave += (s, e) => SetLabelColors((Control)s, MouseState.Normal);
                control.MouseDown += (s, e) => SetLabelColors((Control)s, MouseState.Down);
            }

            TopLeftCornerPanel.MouseDown += (s, e) => DecorationMouseDown(e, HitTestValues.HTTOPLEFT);
            TopRightCornerPanel.MouseDown += (s, e) => DecorationMouseDown(e, HitTestValues.HTTOPRIGHT);
            BottomLeftCornerPanel.MouseDown += (s, e) => DecorationMouseDown(e, HitTestValues.HTBOTTOMLEFT);
            BottomRightCornerPanel.MouseDown += (s, e) => DecorationMouseDown(e, HitTestValues.HTBOTTOMRIGHT);

            TopBorderPanel.MouseDown += (s, e) => DecorationMouseDown(e, HitTestValues.HTTOP);
            LeftBorderPanel.MouseDown += (s, e) => DecorationMouseDown(e, HitTestValues.HTLEFT);
            RightBorderPanel.MouseDown += (s, e) => DecorationMouseDown(e, HitTestValues.HTRIGHT);
            BottomBorderPanel.MouseDown += (s, e) => DecorationMouseDown(e, HitTestValues.HTBOTTOM);

            // Allow this window to be 
            MinimumSize = new Size(30, 30);
            UpdateBounds();

            TitleLabel.MouseDown += TitleLabel_MouseDown;
            TitleLabel.MouseUp += (s, e) => { if (e.Button == MouseButtons.Right && TitleLabel.ClientRectangle.Contains(e.Location)) ShowSystemMenu(MouseButtons); };
            TitleLabel.Text = Text;
            TextChanged += (s, e) => TitleLabel.Text = Text;

            var marlett = new Font("Marlett", 8.5f);

            MinimizeLabel.Font = marlett;
            CloseLabel.Font = marlett;

            MinimizeLabel.MouseClick += (s, e) => { 
                if (e.Button == MouseButtons.Left) { 
                    MinimizeToSystemTray(); 
                    hostBridge.RefreshClient(); 
                }
            };

            previousWindowState = MinMaxState;
            SizeChanged += HostForm_SizeChanged;
            CloseLabel.MouseClick += (s, e) => Close(e);
            // Custom chrome end

            // Use IE11 WebBrowser control renderer
            using (var key = Microsoft.Win32.Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Internet Explorer\Main\FeatureControl\FEATURE_BROWSER_EMULATION", true))
            {
                key.SetValue(Path.GetFileName(Application.ExecutablePath), 11001, Microsoft.Win32.RegistryValueKind.DWord);
                key.Close();
            }
        }

        private void HostForm_ResizeEnd(object sender, EventArgs e)
        {
            if (hostBridge.IsDrawerOpen)
            {
                hostBridge.Settings.DrawerOpenTop = this.Top;
                hostBridge.Settings.DrawerOpenLeft = this.Left;
                hostBridge.Settings.DrawerOpenHeight = this.Height < 240 ? 240 : this.Height;
                hostBridge.Settings.DrawerOpenWidth = this.Width < 240 ? 240 : this.Width;
            }
            else
            {
                hostBridge.Settings.DrawerClosedTop = this.Top;
                hostBridge.Settings.DrawerClosedLeft = this.Left;
            }
        }

        public void ApplySettings()
        {
            var openOpacity = hostBridge.Settings.OpenOpacity / 100.0;
            if (openOpacity < 0) openOpacity = 0.5;
            if (openOpacity > 1) openOpacity = 1;

            var closedOpacity = hostBridge.Settings.ClosedOpacity / 100.0;
            if (closedOpacity < 0) closedOpacity = 0.5;
            if (closedOpacity > 1) closedOpacity = 1;

            Opacity = hostBridge.IsDrawerOpen ? openOpacity : closedOpacity;

            hostBridge.Settings.OpenOpacity = Convert.ToInt32(openOpacity * 100);
            hostBridge.Settings.ClosedOpacity = Convert.ToInt32(closedOpacity * 100);
        }

        private void HostForm_Load(object sender, EventArgs e)
        {
            this.Text = "GW2Clipboard";
            this.notifyIcon.Icon = this.Icon;
            this.notifyIcon.Visible = true;

            hostBridge = new HostBridge(this);

            // Configure launch page (app.html for a release and app-debug.html when debugger is attached)
            string currentDirectory = Directory.GetCurrentDirectory();
            if (hostBridge.IsDebugMode)
            {
                //#/CategoryType/0
                currentDirectory = Directory.GetParent(currentDirectory).Parent.FullName;
                appFileName = String.Format("file:///{0}/ClientApp/app-debug.html#/CategoryType/0", currentDirectory.Replace("\\", "/"));
            }
            else appFileName = String.Format("file:///{0}/ClientApp/app.html#/CategoryType/0", currentDirectory.Replace("\\", "/"));

            // If MinimizeOnDrawerClosed is true, we never go to close drawer so default to open
            if (hostBridge.Settings.MinimizeOnStart || hostBridge.Settings.MinimizeOnDrawerClosed) hostBridge.OpenDrawConfig();
            else hostBridge.CloseDrawerConfig();

            ApplySettings();

            // Registry HotKeys
            var hotKeySettings = hostBridge.Settings.HotKeys;
            var hotKeyDefs = new List<HotKeyDefinition>();
            foreach (var key in hotKeySettings.Keys)
            {
                var hotkey = hotKeySettings[key];
                hotKeyDefs.Add(new HotKeyDefinition
                {
                    id = key,
                    key = (Keys)hotkey[0],
                    modifier = (KeyModifiers)hotkey[1]
                });
            }
            hotKeys = new HotKey(hotKeyDefs, HotKeyDetected);

            this.browser.ObjectForScripting = new ScriptInterface(hostBridge);
            this.browser.DocumentCompleted += DocumentCompleted;
            this.browser.Navigate(appFileName);

            autoSaveTimer.Enabled = true;
        }

        private void HostForm_FormClosing(object sender, FormClosingEventArgs e)
        {
            hostBridge.SaveSettings();

            autoSaveTimer.Enabled = false;
        }
        #endregion

        #region Custom window chrome
        private FormWindowState previousWindowState;
        private DateTime systemClickTime = DateTime.MinValue;
        private DateTime systemMenuCloseTime = DateTime.MinValue;
        private DateTime titleClickTime = DateTime.MinValue;
        private Point titleClickPosition = Point.Empty;

        public Color ActiveTextColor { get; set; } = Color.FromArgb(238, 230, 204);
        public Color InactiveTextColor { get; set; } = Color.FromArgb(238, 230, 204);
        public Color ActiveBorderColor { get; set; } = Color.FromArgb(50, 50, 50);
        public Color InactiveBorderColor { get; set; } = Color.FromArgb(20, 20, 20);
        public Color HoverTextColor { get; set; } = Color.FromArgb(120, 120, 120);
        public Color DownTextColor { get; set; } = Color.FromArgb(255, 248, 208);
        public Color HoverBackColor { get; set; } = Color.FromArgb(0, 0, 0);
        public Color DownBackColor { get; set; } = Color.Black;
        public Color NormalBackColor { get; set; } = Color.Black;

        public enum MouseState
        {
            Normal,
            Hover,
            Down
        }
        protected void SetLabelColors(Control control, MouseState state)
        {
            if (!ContainsFocus) return;

            var textColor = ActiveTextColor;
            var backColor = NormalBackColor;

            switch (state)
            {
                case MouseState.Hover:
                    textColor = HoverTextColor;
                    backColor = HoverBackColor;
                    break;
                case MouseState.Down:
                    textColor = DownTextColor;
                    backColor = DownBackColor;
                    break;
            }

            control.ForeColor = textColor;
            control.BackColor = backColor;
        }

        protected void SetBorderColor(Color color)
        {
            TopLeftCornerPanel.BackColor = color;
            TopBorderPanel.BackColor = color;
            TopRightCornerPanel.BackColor = color;
            LeftBorderPanel.BackColor = color;
            RightBorderPanel.BackColor = color;
            BottomLeftCornerPanel.BackColor = color;
            BottomBorderPanel.BackColor = color;
            BottomRightCornerPanel.BackColor = color;
        }

        protected void SetTextColor(Color color)
        {
            TitleLabel.ForeColor = color;
            MinimizeLabel.ForeColor = color;
            CloseLabel.ForeColor = color;
        }

        private FormWindowState ToggleMaximize()
        {
            return WindowState = WindowState == FormWindowState.Maximized ? FormWindowState.Normal : FormWindowState.Maximized;
        }

        void SystemLabel_MouseUp(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Right) ShowSystemMenu(MouseButtons);
        }

        void SystemLabel_MouseDown(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                var clickTime = (DateTime.Now - systemClickTime).TotalMilliseconds;
                if (clickTime < SystemInformation.DoubleClickTime)
                    Close();
                else
                {
                    systemClickTime = DateTime.Now;
                    if ((systemClickTime - systemMenuCloseTime).TotalMilliseconds > 200)
                    {
                        ShowSystemMenu(MouseButtons, PointToScreen(new Point(8, 32)));
                        systemMenuCloseTime = DateTime.Now;
                    }
                }
            }
        }

        void Close(MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left) Close();
        }

        void DecorationMouseDown(MouseEventArgs e, HitTestValues h)
        {
            if (e.Button == MouseButtons.Left) DecorationMouseDown(h);
        }

        void TitleLabel_MouseDown(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                var clickTime = (DateTime.Now - titleClickTime).TotalMilliseconds;
                if (clickTime < SystemInformation.DoubleClickTime && e.Location == titleClickPosition)
                {
                    if (MaximizeBox == true) ToggleMaximize();
                }
                else
                {
                    titleClickTime = DateTime.Now;
                    titleClickPosition = e.Location;
                    DecorationMouseDown(HitTestValues.HTCAPTION);
                }
            }
        }

        private void HostForm_Deactivate(object sender, EventArgs e)
        {
            SetBorderColor(InactiveBorderColor);
            SetTextColor(InactiveTextColor);
        }

        private void HostForm_Activated(object sender, EventArgs e)
        {
            SetBorderColor(ActiveBorderColor);
            SetTextColor(ActiveTextColor);
        }

        public void SetResizingMode(bool canResize)
        {
            var panels = new[] { TopLeftCornerPanel, TopRightCornerPanel, BottomLeftCornerPanel, BottomRightCornerPanel,
                TopBorderPanel, LeftBorderPanel, RightBorderPanel, BottomBorderPanel };

            foreach (var panel in panels)
            {
                panel.Enabled = canResize;
            }

            this.FormBorderStyle = canResize ? FormBorderStyle.Sizable : FormBorderStyle.FixedSingle;
        }

        private void HostForm_SizeChanged(object sender, EventArgs e)
        {
            var maximized = MinMaxState == FormWindowState.Maximized;

            var panels = new[] { TopLeftCornerPanel, TopRightCornerPanel, BottomLeftCornerPanel, BottomRightCornerPanel,
                TopBorderPanel, LeftBorderPanel, RightBorderPanel, BottomBorderPanel };

            foreach (var panel in panels)
            {
                panel.Visible = !maximized;
            }

            if (previousWindowState != MinMaxState)
            {
                if (maximized)
                {
                    CloseLabel.Left += RightBorderPanel.Width;
                    CloseLabel.Top = 0;
                    MinimizeLabel.Left += RightBorderPanel.Width;
                    MinimizeLabel.Top = 0;
                    TitleLabel.Left -= LeftBorderPanel.Width;
                    TitleLabel.Width += LeftBorderPanel.Width + RightBorderPanel.Width;
                    TitleLabel.Top = 0;
                }
                else if (previousWindowState == FormWindowState.Maximized)
                {
                    CloseLabel.Left -= RightBorderPanel.Width;
                    CloseLabel.Top = TopBorderPanel.Height;
                    MinimizeLabel.Left -= RightBorderPanel.Width;
                    MinimizeLabel.Top = TopBorderPanel.Height;
                    TitleLabel.Left += LeftBorderPanel.Width;
                    TitleLabel.Width -= LeftBorderPanel.Width + RightBorderPanel.Width;
                    TitleLabel.Top = TopBorderPanel.Height;
                }

                previousWindowState = MinMaxState;
            }
        }
        #endregion

        #region WebBrowserControl methods
        public void RefreshBrowser()
        {
            this.browser.Navigate(appFileName);
            this.browser.Refresh(WebBrowserRefreshOption.Completely);
        }

        private void HotKeyDetected(object sender, HotKeyEventArgs e)
        {
            this.browser.Document.InvokeScript("eval", new object[] { $"window.store.processAction({e.id})" });
        }

        public void ClientAction(int action)
        {
            if (this.browser.Document != null) this.browser.Document.InvokeScript("eval", new object[] { $"window.store.processAction({action})" });
        }

        void DocumentCompleted(object sender, WebBrowserDocumentCompletedEventArgs e)
        {
        }
        #endregion

        private void autoSaveTimer_Tick(object sender, EventArgs e)
        {
            //// Capture any form moves
            //if (MinMaxState == FormWindowState.Normal)
            //{
            //    if (hostBridge.IsDrawerOpen)
            //    {
            //        hostBridge.Settings.DrawerOpenTop = this.Top;
            //        hostBridge.Settings.DrawerOpenLeft = this.Left;
            //        hostBridge.Settings.DrawerOpenHeight = this.Height;
            //        hostBridge.Settings.DrawerOpenWidth = this.Width;
            //    }
            //    else
            //    {
            //        hostBridge.Settings.DrawerClosedTop = this.Top;
            //        hostBridge.Settings.DrawerClosedLeft = this.Left;
            //    }
            //}
        }

        public void OpenFromSystemTray()
        {
            autoSaveTimer.Enabled = false;
            hostBridge.IsInSystemTray = false;

            Hide();
            hostBridge.OpenDrawer(false);
            hostBridge.RefreshClient();

            //this.WindowState = FormWindowState.Normal;

            autoSaveTimer.Enabled = true;
        }

        public void MinimizeToSystemTray()
        {
            Hide();
            hostBridge.IsInSystemTray = true;
        }

        private void ToggleFromSystemTray()
        {
            if (hostBridge.IsInSystemTray) OpenFromSystemTray();
            else MinimizeToSystemTray();
        }

        private void notifyIcon_MouseDoubleClick(object sender, MouseEventArgs e)
        {
            ToggleFromSystemTray();
        }

        private void notifyIcon_MouseClick(object sender, MouseEventArgs e)
        {
            ToggleFromSystemTray();
        }

        private void HostForm_Resize(object sender, EventArgs e)
        {
            if (this.MinMaxState == FormWindowState.Minimized)
            {
                MinimizeToSystemTray();
            }
        }

        private void HostForm_Shown(object sender, EventArgs e)
        {
            if (hostBridge.Settings.MinimizeOnStart && firstRun)
            {
                MinimizeToSystemTray();
            }
            firstRun = false;
        }

        private void HostForm_MouseEnter(object sender, EventArgs e)
        {
        }

        private void HostForm_Move(object sender, EventArgs e)
        {
        }
    }
}
