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
            File.WriteAllText(CategoryFileName, String.IsNullOrEmpty(json) ? categoriesJson : json);
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

        public void OpenDrawer(bool fromClient)
        {
            hostForm.autoSaveTimer.Enabled = false;
            hostForm.Hide();
            Application.DoEvents();

            hostForm.Text = " GW2 Clipboard";
            hostForm.FormBorderStyle = FormBorderStyle.Sizable;

            hostForm.Top = Settings.DrawerOpenTop;
            hostForm.Left = Settings.DrawerOpenLeft;
            hostForm.Height = Settings.DrawerOpenHeight;
            hostForm.Width = Settings.DrawerOpenWidth;

            // Must be set before timer is enabled
            IsDrawerOpen = true;

            hostForm.Show();
            Application.DoEvents();

            hostForm.autoSaveTimer.Enabled = true;
        }

        public void CloseDrawer(bool fromClient)
        {
            hostForm.autoSaveTimer.Enabled = false;

            hostForm.Hide();
            Application.DoEvents();

            hostForm.Text = "";
            hostForm.FormBorderStyle = FormBorderStyle.FixedToolWindow;

            hostForm.Top = Settings.DrawerClosedTop;
            hostForm.Left = Settings.DrawerClosedLeft;
            hostForm.Height = Settings.DrawerClosedHeight;
            hostForm.Width = Settings.DrawerClosedWidth;

            // Must be set before timer is enabled
            IsDrawerOpen = false;

            hostForm.Show();
            Application.DoEvents();

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
