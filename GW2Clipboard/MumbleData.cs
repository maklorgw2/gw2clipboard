namespace GW2Clipboard
{
    using System;
    using System.Runtime.InteropServices;

    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    public struct MumbleData
    {
        public uint uiVersion;

        public uint uiTick;

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 3)]
        public float[] fAvatarPosition;

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 3)]
        public float[] fAvatarFront;

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 3)]
        public float[] fAvatarTop;

        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 256)]
        public string name;

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 3)]
        public float[] fCameraPosition;

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 3)]
        public float[] fCameraFront;

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 3)]
        public float[] fCameraTop;

        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 256)]
        public string identity;

        public uint context_len;

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 256)]
        public byte[] context;

        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 2048)]
        public string description;
    }

    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    public struct MumbleContext
    {
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 28)]
        public byte[] serverAddress; // contains sockaddr_in or sockaddr_in6
        public UInt32 mapId;
        public UInt32 mapType;
        public UInt32 shardId;
        public UInt32 instance;
        public UInt32 buildId;
        //// Additional data beyond the 48 bytes Mumble uses for identification
        public UInt32 uiState; // Bitmask: Bit 1 = IsMapOpen, Bit 2 = IsCompassTopRight, Bit 3 = DoesCompassHaveRotationEnabled
        public UInt16 compassWidth; // pixels
        public UInt16 compassHeight; // pixels
        public float compassRotation; // radians
        public float playerX; // continentCoords
        public float playerY; // continentCoords
        public float mapCenterX; // continentCoords
        public float mapCenterY; // continentCoords
        public float mapScale;
    };
}