using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace GW2Clipboard
{
    public class MapManager
    {
        private List<Map> Maps;
        private class Map
        {
            public int id { get; set; }
            public string title { get; set; }
            public int gameMode { get; set; }
            public bool exclude { get; set; }
        }

        public MapManager()
        {
            Maps = JsonConvert.DeserializeObject<List<Map>>(File.ReadAllText("maps.json"));
        }

        public string ToJson() => JsonConvert.SerializeObject(Maps.Where(m => !m.exclude).Select(m => new { m.id, t = m.title, m = m.gameMode }));
    }
}
