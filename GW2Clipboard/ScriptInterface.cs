using Newtonsoft.Json;
using System;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Windows.Forms;

namespace GW2Clipboard
{
    /// <summary>
    /// ScriptInterface provides the interface between the HostBridge control and the javascript application (via window.external.*)
    /// </summary>
    [ComVisible(true)]
    public class ScriptInterface
    {
        public bool isEmbedded => true;
        HostBridge hostBridge;

        #region Win32 Interop
        [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        static extern IntPtr GetForegroundWindow();

        [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        static extern bool SetForegroundWindow(IntPtr hWnd);

        [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);

        [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        static extern int GetWindowTextLength(IntPtr hWnd);
        #endregion

        public ScriptInterface(HostBridge hostBridge)
        {
            this.hostBridge = hostBridge;
        }

        public void OpenDrawer() => hostBridge.OpenDrawer();

        public bool IsDrawerOpen() => hostBridge.IsDrawerOpen;

        public bool IsInSystemTray() => hostBridge.IsInSystemTray;

        public bool IsDebugMode => hostBridge.IsDebugMode;

        public void CloseDrawer() => hostBridge.CloseDrawer();

        public void Exit() => hostBridge.Exit();

        public void Minimize() => hostBridge.Minimize();

        public void Refresh() => hostBridge.Refresh();

        public string LoadMaps() => hostBridge.MapManager.ToJson();

        public string LoadSettings() => hostBridge.LoadSettings().ToJson();

        public void SaveSettings(string settings) => hostBridge.SaveSettings(settings);

        public string LoadCategories() => hostBridge.LoadCategories();

        public void SaveCategories(string json) => hostBridge.SaveCategories(json);

        public string SetClipBoardData(string data)
        {
            try
            {
                string clipboardData = null;
                Exception threadEx = null;
                Thread staThread = new Thread(
                    delegate ()
                    {
                        try
                        {
                            Clipboard.SetText(data,TextDataFormat.Text);
                        }

                        catch (Exception ex)
                        {
                            threadEx = ex;
                        }
                    });
                staThread.SetApartmentState(ApartmentState.STA);
                staThread.Start();
                staThread.Join();
                return clipboardData;
            }
            #pragma warning disable CS0168 // Variable is declared but never used
            catch (Exception exception)
            #pragma warning restore CS0168 // Variable is declared but never used
            {
                return string.Empty;
            }
        }

        MumbleContext ByteArrayToContext(byte[] bytes)
        {
            GCHandle handle = GCHandle.Alloc(bytes, GCHandleType.Pinned);
            MumbleContext stuff;
            try
            {
                stuff = (MumbleContext)Marshal.PtrToStructure(handle.AddrOfPinnedObject(), typeof(MumbleContext));
            }
            finally
            {
                handle.Free();
            }
            return stuff;
        }

        private string GetCaptionOfActiveWindow()
        {
            var strTitle = string.Empty;
            var handle = GetForegroundWindow();
            // Obtain the length of the text   
            var intLength = GetWindowTextLength(handle) + 1;
            var stringBuilder = new StringBuilder(intLength);
            if (GetWindowText(handle, stringBuilder, intLength) > 0)
            {
                strTitle = stringBuilder.ToString();
            }
            return strTitle;
        }

        public string GetMumbleData()
        {
            var mumbleData = hostBridge.MumbleLinkFile.Read();

            var context = ByteArrayToContext(mumbleData.context);

            var identity = string.IsNullOrEmpty(mumbleData.identity) ? "{}" : mumbleData.identity;
            var output = JsonConvert.SerializeObject(new {
                mumbleData.fAvatarFront,
                mumbleData.fAvatarPosition,
                mumbleData.fCameraFront,
                mumbleData.fCameraPosition,
                mumbleData.name,
                mumbleData.description,
                mumbleData.uiTick,
                currentWindowTitle = GetCaptionOfActiveWindow(),
                context,
            });

            var outputEx= $"{output.Substring(0, output.Length - 1)},\"identity\":{identity}}}";
            return outputEx;
        }
    }
}
