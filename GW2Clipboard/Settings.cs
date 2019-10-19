using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Windows.Forms;
using static GW2Clipboard.HotKey;

namespace GW2Clipboard
{
    public class Settings
    {
        public const int DrawerOpenHeightDefault = 600;
        public const int DrawerOpenWidthDefault = 400;

        public const int DrawerClosedHeightDefault = 205;
        public const int DrawerClosedWidthDefault = 50;

        public enum HotKeyEnum : int
        {
            OpenBuild = 100,
            OpenText = 101,
            CloseDrawer = 102,
            Up = 103,
            Down = 104,
            Left  = 105,
            Right = 106,
            Select = 107,
            Minimize = 108
        }

        public enum UISizeEnum : int
        {
            Small = 0,
            Normal = 1,
            Large = 2,
            Larger = 3
        }

        public UISizeEnum UISize { get; set; }
        public int Opacity { get; set; } = 100;
        public bool MinimizeOnStart { get; set; } = false;
        public bool MinimizeOnDrawerClosed { get; set; } = false;

        public int DrawerOpenTop { get; set; }
        public int DrawerOpenLeft { get; set; }
        public int DrawerOpenHeight { get; set; } = DrawerOpenHeightDefault;
        public int DrawerOpenWidth { get; set; } = DrawerOpenWidthDefault;
        
        public int DrawerClosedTop { get; set; }
        public int DrawerClosedLeft { get; set; }
        public int DrawerClosedHeight { get; set; } = DrawerClosedHeightDefault;
        public int DrawerClosedWidth { get; set; } = DrawerClosedWidthDefault;

        public Dictionary<int, int[]> HotKeys { get; set; } = new Dictionary<int, int[]>();

        public Settings()
        {
            UISize = UISizeEnum.Normal;

            HotKeys.Add((int)HotKeyEnum.OpenBuild, new int[] { (int)Keys.B, (int)KeyModifiers.Alt });
            HotKeys.Add((int)HotKeyEnum.OpenText, new int[] { (int)Keys.T, (int)KeyModifiers.Alt });
            HotKeys.Add((int)HotKeyEnum.CloseDrawer, new int[] { (int)Keys.Back, (int)KeyModifiers.Alt });
            HotKeys.Add((int)HotKeyEnum.Up, new int[] { (int)Keys.Up, (int)KeyModifiers.Alt });
            HotKeys.Add((int)HotKeyEnum.Down, new int[] { (int)Keys.Down, (int)KeyModifiers.Alt });
            HotKeys.Add((int)HotKeyEnum.Left, new int[] { (int)Keys.Left, (int)KeyModifiers.Alt });
            HotKeys.Add((int)HotKeyEnum.Right, new int[] { (int)Keys.Right, (int)KeyModifiers.Alt });
            HotKeys.Add((int)HotKeyEnum.Select, new int[] { (int)Keys.Enter, (int)KeyModifiers.Alt });
            HotKeys.Add((int)HotKeyEnum.Minimize, new int[] { (int)Keys.M, (int)KeyModifiers.Alt });
        }

        public void SetLocation(int screenHeight, int screenWidth)
        {
            if (screenHeight > 0 && screenWidth > 0)
            {
                if (DrawerClosedTop == 0 || DrawerClosedLeft == 0)
                {
                    DrawerClosedTop = screenHeight - (DrawerClosedHeight + 200); // 200 for mini-map
                    DrawerClosedLeft = screenWidth - DrawerClosedWidth;
                }
                if (DrawerOpenTop == 0 || DrawerOpenLeft == 0)
                {
                    DrawerOpenTop = screenHeight - (DrawerOpenHeight + 200); // 200 for mini-map
                    DrawerOpenLeft = screenWidth - DrawerOpenWidth;
                }
            }
        }

        public void Save(string fileName)
        {
            File.WriteAllText(fileName, JsonConvert.SerializeObject(this, new JsonSerializerSettings { Formatting = Formatting.Indented }));
        }

        public string ToJson()
        {
            return JsonConvert.SerializeObject(this);
        }

        public static Settings Load()
        {
            var jsonFile = File.ReadAllText("settings.json");
            return JsonConvert.DeserializeObject<Settings>(jsonFile);
        }
    }
}
