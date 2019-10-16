using System;
using System.Runtime.InteropServices;
using System.Windows.Forms;

namespace GW2Clipboard
{

    public class HotKeyEventArgs : EventArgs
    {
        public int id { get; set; }
    }

    class HotKey : IMessageFilter
    {
        #region Interop
        [DllImport("user32.dll", SetLastError = true)]
        private static extern bool RegisterHotKey(IntPtr hWnd, int id, KeyModifiers fsModifiers, Keys vk);
        [DllImport("user32.dll", SetLastError = true)]
        private static extern bool UnregisterHotKey(IntPtr hWnd, int id);
        #endregion

        public enum KeyModifiers
        {
            None = 0,
            Alt = 1,
            Control = 2,
            Shift = 4,
            Windows = 8
        }

        private const int WM_HOTKEY = 0x0312;
        
        public int id
        {
            get;
            private set;
        }

        public IntPtr Handle
        {
            get;
            set;
        }


        public event EventHandler<HotKeyEventArgs> HotKeyPressed;

        public HotKey(int id, Keys key, KeyModifiers modifier, EventHandler<HotKeyEventArgs> hotKeyPressed)
        {
            this.id = id;
            HotKeyPressed = hotKeyPressed;
            RegisterHotKey(key, modifier);
            Application.AddMessageFilter(this);
        }

        ~HotKey()
        {
            Application.RemoveMessageFilter(this);
            UnregisterHotKey(Handle, id);
        }

        private void RegisterHotKey(Keys key, KeyModifiers modifier)
        {
            if (key == Keys.None)
                return;

            bool isKeyRegisterd = RegisterHotKey(Handle, id, modifier, key);
            if (!isKeyRegisterd)
                throw new ApplicationException("Hotkey already in use");
        }

        public bool PreFilterMessage(ref Message m)
        {
            switch (m.Msg)
            {
                case WM_HOTKEY:
                    HotKeyPressed(this, new HotKeyEventArgs { id=m.WParam.ToInt32() });
                    return true;
            }
            return false;
        }

    }

}
