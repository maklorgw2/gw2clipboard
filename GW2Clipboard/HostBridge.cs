using Newtonsoft.Json;
using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Runtime.InteropServices;
using System.Threading;
using System.Windows.Forms;

namespace GW2Clipboard
{
    /// <summary>
    /// The HostBridge provides the interface between the HostForm and ScriptInterface
    /// </summary>
    public class HostBridge
    {
        const string SettingsFileName = "settings.json";
        const string CategoryFileName = "categories.json";

        HostForm hostForm;
        string categoriesJson;
        IntPtr Gw2WindowHandle = IntPtr.Zero;
        bool categoriesDirty = false;
        bool settingsDirty = false;

        public Settings Settings { get; set; }
        public MapManager MapManager { get; set; }
        public bool IsDrawerOpen { get; set; }
        public bool IsInSystemTray { get; set; }
        public bool IsClientReady { get; set; } = false;
        public MumbleLinkFile MumbleLinkFile { get; private set; }

        #region Interop
        [DllImport("user32.dll")]
        [return: MarshalAs(UnmanagedType.Bool)]
        static extern bool SetForegroundWindow(IntPtr hWnd);
        #endregion

        public HostBridge(HostForm hostForm)
        {
            MumbleLinkFile = MumbleLinkFile.CreateOrOpen();

            this.hostForm = hostForm;

            MapManager = new MapManager();
            LoadSettings();
            LoadCategories();
        }

        ~HostBridge()
        {
            MumbleLinkFile.Dispose();
        }


        #region Settings and Categories
        public Settings LoadSettings()
        {
            if (File.Exists(SettingsFileName))
            {
                Settings = Settings.Load();
            }
            else
            {
                Settings = new Settings();
                Settings.Save(SettingsFileName);
            }
            // Set default location of HostForm and Drawer if not set
            Rectangle workingArea = Screen.GetWorkingArea(hostForm);
            Settings.SetLocation(workingArea.Height, workingArea.Width);

            return Settings;
        }


        public void SaveSettings(string newSettings = null)
        {
            if (!string.IsNullOrEmpty(newSettings))
            {
                Settings = JsonConvert.DeserializeObject<Settings>(newSettings);
                hostForm.ApplySettings();
            }
            Settings.Save(SettingsFileName);
        }

        public string LoadCategories()
        {
            if (File.Exists(CategoryFileName))
            {
                categoriesJson = File.ReadAllText(CategoryFileName);
            }
            else
            {
                categoriesJson = JsonConvert.SerializeObject(new object[] { }, Formatting.Indented);
                File.WriteAllText(CategoryFileName, categoriesJson);
            }
            return categoriesJson;
        }

        public void SaveCategories(string json = null)
        {
            if (!String.IsNullOrEmpty(json)) categoriesJson = json;
            File.WriteAllText(CategoryFileName, categoriesJson);
        }
        #endregion

        public int IconBarSize => Settings.DrawerClosedWidth;

        public bool IsDebugMode => Debugger.IsAttached;

        public void RefreshClient()
        {
            hostForm.ClientAction((int)Settings.ActionsEnum.RefreshClient);
        }

        public void FocusToPreviousWindow()
        {
            // Restore focus
            if (Gw2WindowHandle != IntPtr.Zero)
            {
                if (SetForegroundWindow(Gw2WindowHandle)) return;
            }

            // Missing or Invalid handle, look for it
            var processes = Process.GetProcesses();
            foreach (var process in processes)
            {
                if (process.MainWindowTitle.IndexOf("Guild Wars 2", StringComparison.InvariantCulture) > -1)
                {
                    Gw2WindowHandle = process.MainWindowHandle;
                    SetForegroundWindow(Gw2WindowHandle);
                    break;
                }
            }
        }

        private void FadeOut(int opacity)
        {
            var sourceOpacity = opacity / 100.0;
            for (var i = sourceOpacity; i > 0; i -= 0.1)
            {
                hostForm.Opacity = i;
                Application.DoEvents();
                Thread.Sleep(10);
            }
            hostForm.Opacity = 0;
            hostForm.Hide();
        }

        private void FadeIn(int opacity)
        {
            hostForm.Opacity = 0.0;
            hostForm.Show();

            var targetOpacity = opacity / 100.0;
            for (var i = 0.0; i < targetOpacity; i += 0.1)
            {
                hostForm.Opacity = i;
                Application.DoEvents();
                Thread.Sleep(10);
            }
            hostForm.Opacity = targetOpacity;
        }

        public void SetWindowPos(int left, int top, int width, int height)
        {
            //https://stackoverflow.com/questions/22548225/setwindowpos-fails-to-set-window-always-on-top
            const int GWL_EXSTYLE = -20;
            const int WS_EX_TOPMOST = 8;

            var extStyle = NativeMethods.GetWindowLongPtr(hostForm.Handle, GWL_EXSTYLE).ToInt64();
            extStyle |= WS_EX_TOPMOST;
            NativeMethods.SetWindowLongPtr(hostForm.Handle, GWL_EXSTYLE, new IntPtr(extStyle));

            //https://stackoverflow.com/questions/683330/how-to-make-a-window-always-stay-on-top-in-net
            if (!NativeMethods.SetWindowPos(hostForm.Handle, new IntPtr(-1), left, top, width, height, 0))
            {
                var error = Marshal.GetLastWin32Error();
            }
        }

        public void OpenDrawConfig()
        {
            hostForm.Text = " GW2 Clipboard";
            //hostForm.FormBorderStyle = FormBorderStyle.Sizable;
            hostForm.SetResizingMode(true);

            SetWindowPos(Settings.DrawerOpenLeft, Settings.DrawerOpenTop, Settings.DrawerOpenWidth, Settings.DrawerOpenHeight);
            
            IsDrawerOpen = true;
        }

        public void OpenDrawer(bool fromClient)
        {
            hostForm.autoSaveTimer.Enabled = false;

            hostForm.Hide();
            Application.DoEvents();
            OpenDrawConfig();
            FadeIn(Settings.OpenOpacity);

            hostForm.autoSaveTimer.Enabled = true;
        }

        public void CloseDrawerConfig()
        {
            hostForm.Text = "";
            //hostForm.FormBorderStyle = FormBorderStyle.FixedToolWindow;
            hostForm.SetResizingMode(false);

            SetWindowPos(Settings.DrawerClosedLeft, Settings.DrawerClosedTop, Settings.DrawerClosedWidth, Settings.DrawerClosedHeight);
            
            IsDrawerOpen = false;
        }

        public void CloseDrawer(bool fromClient)
        {
            hostForm.autoSaveTimer.Enabled = false;

            FadeOut(Settings.OpenOpacity);
            CloseDrawerConfig();
            FadeIn(Settings.ClosedOpacity);
            
            hostForm.autoSaveTimer.Enabled = true;

            FocusToPreviousWindow();
        }

        public void MinimizeWindow()
        {
            hostForm.MinimizeToSystemTray();
        }

        public void RestoreWindow()
        {
            hostForm.OpenFromSystemTray();
        }

        public void Exit()
        {
            Application.Exit();
        }

        public void Refresh()
        {
            hostForm.RefreshBrowser();
        }
    }
}
