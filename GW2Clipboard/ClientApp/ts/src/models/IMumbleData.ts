export interface IMumbleData {
	fAvatarFront: number[];
	fAvatarPosition: number[];
	fCameraFront: number[];
	fCameraPosition: number[];
	name: string;
	description: string;
	uiTick: number;
	currentWindowTitle: string;
	identity: {
		name: string;
		profession: number;
		spec: number;
		race: number;
		map_id: number;
		world_id: number;
		team_color_id: number;
		commander: boolean;
		fov: number;
		uisz: number;
	};
	context: {
		serverAddress: string;
		mapId: number;
		mapType: number;
		shardId: number;
		instance: number;
		buildId: number;
		uiState: number; // Bitmask: Bit 1 = IsMapOpen, Bit 2 = IsCompassTopRight, Bit 3 = DoesCompassHaveRotationEnabled
		compassWidth: number; // pixels
		compassHeight: number; // pixels
		compassRotation: number; // radians
		playerX: number; // continentCoords
		playerY: number; // continentCoords
		mapCenterX: number; // continentCoords
		mapCenterY: number; // continentCoords
		mapScale: number;
	};
}
