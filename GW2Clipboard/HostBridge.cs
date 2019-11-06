using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.IO.Pipes;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;
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

        public Queue<HostAction> HostActionQueue = new Queue<HostAction>();
        public Settings Settings { get; set; }
        public MapManager MapManager { get; set; }
        public bool IsDrawerOpen { get; set; }
        public bool IsInSystemTray { get; set; }
        public bool IsClientReady { get; set; } = false;
        public MumbleLinkFile MumbleLinkFile { get; private set; }

        public HostBridge(HostForm hostForm)
        {
            MumbleLinkFile = MumbleLinkFile.CreateOrOpen();

            this.hostForm = hostForm;

            MapManager = new MapManager();
            LoadSettings();
            LoadCategories();

            StartIPCTask();
        }

        ~HostBridge()
        {
            MumbleLinkFile.Dispose();
        }

        #region ArcDPS Plug-in IPC

        /// <summary>
        /// IsOnlyInstance - act a sa mutex to ensure a single instance 
        /// </summary>
        public static bool IsOnlyInstance()
        {
            using (var pipeClient = new NamedPipeClientStream(".", "pipe_gw2cp", PipeDirection.Out))
            {
                try
                {
                    pipeClient.Connect(250);
                    if (pipeClient.IsConnected)
                    {
                        using (var writer = new StreamWriter(pipeClient))
                        {
                            writer.WriteLine("mod_init");
                            writer.Flush();
                            writer.Close();
                            Application.Exit();
                            return false;
                        }
                    }
                }
                catch { }
                pipeClient.Close();
                return true;
            }
        }

        public void StartIPCTask()
        {
            Task.Run(() =>
            {
                RecursivePipe();
            });
        }

        public void RecursivePipe()
        {
            using (var server = new NamedPipeServerStream("pipe_gw2cp", PipeDirection.In, 1, PipeTransmissionMode.Message))
            {
                server.WaitForConnection();
                using (var reader = new StreamReader(server))
                {
                    while (!reader.EndOfStream)
                    {
                        var command = reader.ReadLine();
                        switch (command)
                        {
                            case "mod_init":
                                if (IsInSystemTray)
                                {
                                     if (!Settings.MinimizeOnStart) HostActionQueue.Enqueue(HostAction.RestoreClosed);
                                }
                                break;
                            case "mod_release":
                                if (!IsInSystemTray) HostActionQueue.Enqueue(HostAction.Minimize);
                                break;
                            case "mod_release:exit":
                                Application.Exit();
                                break;
                        }
                        Debug.WriteLine(command);
                    }
                }
                server.Close();
            }
            RecursivePipe();
        }
        #endregion

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

        public string ImportCategories()
        {
            var openDialog = new OpenFileDialog();
            openDialog.Filter = "JSON file|*.json";
            openDialog.InitialDirectory = Application.ExecutablePath;
            if (openDialog.ShowDialog() != DialogResult.Cancel)
            {
                if (!string.IsNullOrEmpty(openDialog.FileName))
                {
                    return File.ReadAllText(openDialog.FileName);
                }
            }
            return null;
        }

        public bool ExportCategories(string json)
        {
            var saveDialog = new SaveFileDialog();
            saveDialog.Filter = "JSON file|*.json";
            saveDialog.InitialDirectory = Application.ExecutablePath;

            saveDialog.FileName = $"export-{DateTime.Now.ToString("yyyyMMddHHmmss")}.json";
            if (saveDialog.ShowDialog() != DialogResult.Cancel)
            {
                if (!string.IsNullOrEmpty(saveDialog.FileName))
                {
                    File.WriteAllText(saveDialog.FileName, json);
                    return true;
                }
            }
            return false;
        }
        #endregion

        public int IconBarSize => Settings.DrawerClosedWidth;

        public bool IsDebugMode => Debugger.IsAttached;

        public IntPtr GetGw2WindowHandle()
        {
            // Restore focus
            if (Gw2WindowHandle == IntPtr.Zero)
            {
                // Missing or Invalid handle, look for it
                var processes = Process.GetProcesses();
                foreach (var process in processes)
                {
                    if (process.MainWindowTitle.IndexOf("Guild Wars 2", StringComparison.InvariantCulture) > -1)
                    {
                        Gw2WindowHandle = process.MainWindowHandle;
                        break;
                    }
                }
            }
            return Gw2WindowHandle;
        }

        private void FadeOut(int opacity)
        {
            //var sourceOpacity = opacity / 100.0;
            //for (var i = sourceOpacity; i > 0; i -= 0.1)
            //{
            //    hostForm.Opacity = i;
            //    Application.DoEvents();
            //    Thread.Sleep(10);
            //}
            //hostForm.Opacity = 0;
            hostForm.Hide();
        }

        private void FadeIn(int opacity)
        {
            //hostForm.Opacity = 0.0;
            //hostForm.Show();

            var targetOpacity = opacity / 100.0;
            //for (var i = 0.0; i < targetOpacity; i += 0.1)
            //{
            //    hostForm.Opacity = i;
            //    Application.DoEvents();
            //    Thread.Sleep(10);
            //}
            hostForm.Opacity = targetOpacity;
            hostForm.Show();
        }

        public void SetWindowPos(int left, int top, int width, int height)
        {
            ////https://stackoverflow.com/questions/22548225/setwindowpos-fails-to-set-window-always-on-top
            //const int GWL_EXSTYLE = -20;
            //const int WS_EX_TOPMOST = 8;

            //var extStyle = NativeMethods.GetWindowLongPtr(hostForm.Handle, GWL_EXSTYLE).ToInt64();
            //extStyle |= WS_EX_TOPMOST;
            //NativeMethods.SetWindowLongPtr(hostForm.Handle, GWL_EXSTYLE, new IntPtr(extStyle));

            //https://stackoverflow.com/questions/683330/how-to-make-a-window-always-stay-on-top-in-net
            if (!NativeMethods.SetWindowPos(hostForm.Handle, new IntPtr(-1), left, top, width, height, 0))
            {
                var error = Marshal.GetLastWin32Error();
            }
        }

        public void OpenDrawConfig()
        {
            hostForm.Text = " GW2 Clipboard";
            hostForm.SetResizingMode(true);

            SetWindowPos(Settings.DrawerOpenLeft, Settings.DrawerOpenTop, Settings.DrawerOpenWidth, Settings.DrawerOpenHeight);

            IsDrawerOpen = true;
        }

        public void OpenDrawer()
        {
            hostForm.Opacity = 0.1;
            if (!hostForm.Visible) hostForm.Show();
            Application.DoEvents();

            OpenDrawConfig();
            hostForm.Opacity = Settings.OpenOpacity / 100.0;
            Application.DoEvents();
            //FadeIn(Settings.OpenOpacity);
        }

        public void CloseDrawerConfig()
        {
            hostForm.Text = " ";
            hostForm.SetResizingMode(false);

            SetWindowPos(Settings.DrawerClosedLeft, Settings.DrawerClosedTop, Settings.DrawerClosedWidth, Settings.DrawerClosedHeight);

            IsDrawerOpen = false;
        }

        public void CloseDrawer()
        {
            //FadeOut(Settings.OpenOpacity);
            hostForm.Opacity = 0.1;
            if (!hostForm.Visible) hostForm.Show();
            Application.DoEvents();

            CloseDrawerConfig();
            hostForm.Opacity = Settings.ClosedOpacity / 100.0;
            Application.DoEvents();
            //FadeIn(Settings.ClosedOpacity);

            hostForm.FocusToPreviousWindow();
        }

        public void MinimizeWindow()
        {
            hostForm.MinimizeToSystemTray();
        }

        public void RestoreWindow(bool closed)
        {
            hostForm.OpenFromSystemTray(closed);
        }

        public void Exit()
        {
            Application.Exit();
        }

        public void Refresh()
        {
            hostForm.RefreshBrowser();
        }

        public void AutoPaste(bool chatWindowMode)
        {
            INPUT KeyEvent(Keys key, bool isKeyUp = false)
            {
                var vk = (ushort)NativeMethods.MapVirtualKey((uint)key, (uint)0x0);
                return new INPUT()
                {
                    type = INPUTType.INPUT_KEYBOARD,
                    Event = new INPUTUnion
                    {
                        ki = new KEYBDINPUT { wScan = vk, dwFlags = isKeyUp ? KEYEVENTF.SCANCODE | KEYEVENTF.KEYUP : KEYEVENTF.SCANCODE }
                    }
                };
            }

            var enterPress = new[]
            {
                KeyEvent(Keys.Enter),
                KeyEvent(Keys.Enter, true)
            };

            var pasteKeyDown = new[]
            {
                KeyEvent(Keys.ControlKey),
                KeyEvent(Keys.V)
            };

            var pasteKeyUp = new[]
            {
                KeyEvent(Keys.V, true),
                KeyEvent(Keys.ControlKey, true)
            };

            if (chatWindowMode) NativeMethods.SendInput((uint)enterPress.Length, enterPress, Marshal.SizeOf(typeof(INPUT)));
            Thread.Sleep(10);
            NativeMethods.SendInput((uint)pasteKeyDown.Length, pasteKeyDown, Marshal.SizeOf(typeof(INPUT)));
            Thread.Sleep(60);
            NativeMethods.SendInput((uint)pasteKeyUp.Length, pasteKeyUp, Marshal.SizeOf(typeof(INPUT)));
            Thread.Sleep(10);
            if (chatWindowMode) NativeMethods.SendInput((uint)enterPress.Length, enterPress, Marshal.SizeOf(typeof(INPUT)));
        }
    }
}
