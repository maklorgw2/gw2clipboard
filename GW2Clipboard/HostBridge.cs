using Newtonsoft.Json;
using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
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

        public Settings Settings { get; set; }
        public MapManager MapManager { get; set; }
        public bool IsDrawerOpen { get; set; }
        public bool IsInSystemTray { get; set; }
        public MumbleLinkFile MumbleLinkFile { get; private set; }

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

        public void OpenDrawer()
        {
            hostForm.Hide();
            hostForm.autoSaveTimer.Enabled = false;

            hostForm.Text = "GW2 Clipboard";
            hostForm.FormBorderStyle = FormBorderStyle.SizableToolWindow;

            hostForm.Top = Settings.DrawerOpenTop;
            hostForm.Left = Settings.DrawerOpenLeft;
            hostForm.Height = Settings.DrawerOpenHeight;
            hostForm.Width = Settings.DrawerOpenWidth;

            // Must be set before timer is enabled
            IsDrawerOpen = true; 

            hostForm.Show();
            hostForm.autoSaveTimer.Enabled = true;
        }

        public void CloseDrawer()
        {
            hostForm.Hide();
            hostForm.autoSaveTimer.Enabled = false;

            hostForm.Text = " ";
            hostForm.FormBorderStyle = FormBorderStyle.SizableToolWindow;

            hostForm.Top = Settings.DrawerClosedTop;
            hostForm.Left = Settings.DrawerClosedLeft;
            hostForm.Height = Settings.DrawerClosedHeight;
            hostForm.Width = Settings.DrawerClosedWidth;

            // Must be set before timer is enabled
            IsDrawerOpen = false;

            hostForm.Show();
            hostForm.autoSaveTimer.Enabled = true;
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
