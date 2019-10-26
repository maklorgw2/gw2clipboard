using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Windows.Forms;
using static GW2Clipboard.HotKey;

namespace GW2Clipboard
{
    public partial class Settings
    {
        public const int DrawerOpenHeightDefault = 600;
        public const int DrawerOpenWidthDefault = 425;

        public const int DrawerClosedHeightDefault = 205;
        public const int DrawerClosedWidthDefault = 50;

        public enum UISizeEnum : int
        {
            Small = 0,
            Normal = 1,
            Large = 2,
            Larger = 3
        }

        public UISizeEnum UISize { get; set; }
        public int OpenOpacity { get; set; } = 100;
        public int ClosedOpacity { get; set; } = 100;
        public bool MinimizeOnStart { get; set; } = false;
        public bool MinimizeOnDrawerClosed { get; set; } = false;
        public bool ToggleMode { get; set; } = true;

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

            HotKeys.Add((int)ActionsEnum.OpenBuild, new int[] { (int)Keys.B, (int)KeyModifiers.Alt });
            HotKeys.Add((int)ActionsEnum.OpenText, new int[] { (int)Keys.T, (int)KeyModifiers.Alt });
            HotKeys.Add((int)ActionsEnum.CloseDrawer, new int[] { (int)Keys.Back, (int)KeyModifiers.Alt });
            HotKeys.Add((int)ActionsEnum.Up, new int[] { (int)Keys.Up, (int)KeyModifiers.Alt });
            HotKeys.Add((int)ActionsEnum.Down, new int[] { (int)Keys.Down, (int)KeyModifiers.Alt });
            HotKeys.Add((int)ActionsEnum.Left, new int[] { (int)Keys.Left, (int)KeyModifiers.Alt });
            HotKeys.Add((int)ActionsEnum.Right, new int[] { (int)Keys.Right, (int)KeyModifiers.Alt });
            HotKeys.Add((int)ActionsEnum.Select, new int[] { (int)Keys.Enter, (int)KeyModifiers.Alt });
            HotKeys.Add((int)ActionsEnum.Minimize, new int[] { (int)Keys.M, (int)KeyModifiers.Alt });
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
