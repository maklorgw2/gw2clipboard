﻿using System;
using System.Collections.Generic;
using System.Windows.Forms;

namespace GW2Clipboard
{

    public class HotKeyEventArgs : EventArgs
    {
        public int id { get; set; }
    }

    public enum KeyModifiers
    {
        None = 0,
        Alt = 1,
        Control = 2,
        Shift = 4,
        Windows = 8
    }

    public class HotKeyDefinition
    {
        public int id { get; set; }
        public Keys key { get; set; }
        public KeyModifiers modifier { get; set; }
    }

    class HotKey : IMessageFilter
    {
        private const int WM_HOTKEY = 0x0312;

        private List<HotKeyDefinition> hotKeyDefinitions;

        public IntPtr Handle
        {
            get;
            set;
        }

        public event EventHandler<HotKeyEventArgs> HotKeyPressed;

        public HotKey(List<HotKeyDefinition> hotKeyDefinitions, EventHandler<HotKeyEventArgs> hotKeyPressed)
        {
            this.hotKeyDefinitions = hotKeyDefinitions;
            HotKeyPressed = hotKeyPressed;

            int id = 0;
            Keys key = 0;
            KeyModifiers modifier = 0;

            try
            {
                hotKeyDefinitions.ForEach(def =>
                {
                    id = def.id;
                    key = def.key;
                    modifier = def.modifier;
                    RegisterHotKey(id, key, modifier);
                });
            }
#pragma warning disable CS0168 // Variable is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // Variable is declared but never used
            {
                throw new Exception($"Error registering hot key for HostAction {id} - [{key},{modifier}] - Hotkey is in use");
            }
            Application.AddMessageFilter(this);
        }

        ~HotKey()
        {
            Application.RemoveMessageFilter(this);
            hotKeyDefinitions.ForEach(def => NativeMethods.UnregisterHotKey(Handle, def.id));
        }

        private void RegisterHotKey(int id, Keys key, KeyModifiers modifier)
        {
            if (key == Keys.None)
                return;

            bool isKeyRegisterd = NativeMethods.RegisterHotKey(Handle, id, modifier, key);
            if (!isKeyRegisterd)
                throw new ApplicationException("Hotkey already in use");
        }

        public bool PreFilterMessage(ref Message m)
        {
            switch (m.Msg)
            {
                case WM_HOTKEY:
                    HotKeyPressed(this, new HotKeyEventArgs { id = m.WParam.ToInt32() });
                    return true;
            }
            return false;
        }

    }

}
