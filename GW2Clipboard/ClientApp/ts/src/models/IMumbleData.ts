import { GameModeType } from "@models/ITag";

export interface IMumbleDataRaw {
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

export interface IMumbleData extends IMumbleDataRaw {
	mapName: string;
	gameMode: GameModeType;
	gameModeName: string;
	gw2HasFocus: boolean; // GW2 is the active window
	mapIsActive: boolean; // The UI Ticks are updating
	assumeContextIsStale: boolean; // If GW2 is active and the UI Ticks are not updating, assume loading or character select
	onlyPositionChanged: boolean; // Flag to short-circuit filtering
}
