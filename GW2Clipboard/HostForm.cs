using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Runtime.InteropServices;
using System.Windows.Forms;

namespace GW2Clipboard
{
    public partial class HostForm : Form
    {
        Dictionary<int, HotKey> hotKeys = new Dictionary<int, HotKey>();
        public HostBridge hostBridge;

        string appFileName;
        bool isRefreshing = false;

        #region HostForm
        public HostForm()
        {
            InitializeComponent();

            this.Load += HostForm_Load;
            this.FormClosing += HostForm_FormClosing;

            // Use IE11 WebBrowser control renderer
            using (var key = Microsoft.Win32.Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Internet Explorer\Main\FeatureControl\FEATURE_BROWSER_EMULATION", true))
            {
                key.SetValue(Path.GetFileName(Application.ExecutablePath), 11001, Microsoft.Win32.RegistryValueKind.DWord);
                key.Close();
            }
        }

        private void HostForm_Load(object sender, EventArgs e)
        {
            this.Hide();

            this.FormBorderStyle = FormBorderStyle.SizableToolWindow;
            this.Text = "GW2Pasta";

            this.notifyIcon.Icon = SystemIcons.Application;

            hostBridge = new HostBridge(this);

            // Configure launch page (app.html for a release and app-debug.html when debugger is attached)
            string currentDirectory = Directory.GetCurrentDirectory();
            if (hostBridge.IsDebugMode)
            {
                currentDirectory = Directory.GetParent(currentDirectory).Parent.FullName;
                appFileName = String.Format("file:///{0}/ClientApp/app-debug.html", currentDirectory.Replace("\\", "/"));
            } else appFileName = String.Format("file:///{0}/ClientApp/app.html", currentDirectory.Replace("\\", "/"));

            hostBridge = new HostBridge(this);
            hostBridge.CloseDrawer();

            // Registry HotKeys
            var hotKeySettings = hostBridge.Settings.HotKeys;
            foreach (var key in hotKeySettings.Keys)
            {
                var hotkey = hotKeySettings[key];
                hotKeys.Add(key, new HotKey(key, (Keys)hotkey[0], (HotKey.KeyModifiers)hotkey[1], HotKeyDetected));
            }

            this.browser.ObjectForScripting = new ScriptInterface(hostBridge);
            this.browser.DocumentCompleted += DocumentCompleted;
            this.browser.Navigate(appFileName);

            this.Show();

            autoSaveTimer.Enabled = true;
        }

        private void HostForm_FormClosing(object sender, FormClosingEventArgs e)
        {
            hostBridge.SaveSettings();

            autoSaveTimer.Enabled = false;
        }
        #endregion


        #region WebBrowserControl methods
        [DllImport("wininet.dll", SetLastError = true)]
        private static extern bool InternetSetOption(IntPtr hInternet, int dwOption, IntPtr lpBuffer, int lpdwBufferLength);

        private const int INTERNET_OPTION_END_BROWSER_SESSION = 42;

        public void RefreshBrowser()
        {
            //InternetSetOption(IntPtr.Zero, INTERNET_OPTION_END_BROWSER_SESSION, IntPtr.Zero, 0);
            //WebBrowserHelper.ClearCache();
            this.browser.Navigate(appFileName);
            this.browser.Refresh(WebBrowserRefreshOption.Completely);
            //this.browser.Navigate($"{appFileName}/?cacheBust=${DateTime.Now.Ticks}");this.browser.Navigate($"{appFileName}/?cacheBust=${DateTime.Now.Ticks}");
            //this.browser.Refresh(WebBrowserRefreshOption.Completely);
            //isRefreshing = true;
            //this.browser.Navigate("about:blank");
        }

        private void HotKeyDetected(object sender, HotKeyEventArgs e)
        {
            this.browser.Document.InvokeScript("eval", new object[] { $"window.store.processHotKey({e.id})" });
        }

        void DocumentCompleted(object sender, WebBrowserDocumentCompletedEventArgs e)
        {
            if (isRefreshing)
            {
                isRefreshing = false;
                this.browser.Navigate(appFileName);
            }
        }
        #endregion

        private void notifyIcon_MouseDoubleClick(object sender, MouseEventArgs e)
        {
            Show();
            this.WindowState = FormWindowState.Normal;
            notifyIcon.Visible = false;
        }

        private void notifyIcon_MouseClick(object sender, MouseEventArgs e)
        {
            notifyIcon_MouseDoubleClick(sender, e);
        }

        private void autoSaveTimer_Tick(object sender, EventArgs e)
        {
            if (hostBridge.IsDrawerOpen)
            {
                hostBridge.Settings.DrawerOpenTop = this.Top;
                hostBridge.Settings.DrawerOpenLeft = this.Left;
                hostBridge.Settings.DrawerOpenHeight = this.Height;
                hostBridge.Settings.DrawerOpenWidth = this.Width;
            }
            else
            {
                hostBridge.Settings.DrawerClosedTop = this.Top;
                hostBridge.Settings.DrawerClosedLeft = this.Left;
                hostBridge.Settings.DrawerClosedHeight = this.Height;
                hostBridge.Settings.DrawerClosedWidth = this.Width;
            }
        }
    }
}
