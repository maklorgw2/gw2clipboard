export enum TagType {
	Profession = 0,
	Map = 1,
	MapLocation = 2,
	Character = 3,
	GameMode = 4,
	Commander = 5
}

export const TagTypeName: string[] = [
	'Profession',
	'Map',
	'Map Location',
	'Character',
	'Game-mode',
	'Commander tag'
];

export enum ProfessionType {
	None = 0,
	Guardian = 1,
	Warrior = 2,
	Engineer = 3,
	Ranger = 4,
	Thief = 5,
	Elementalist = 6,
	Mesmer = 7,
	Necromancer = 8,
	Revenant = 9
}

export const ProfessionName: string[] = [
	'None',
	'Guardian',
	'Warrior',
	'Engineer',
	'Ranger',
	'Thief',
	'Elementalist',
	'Mesmer',
	'Necromancer',
	'Revenant'
];

export enum GameModeType {
	WvW = 0,
	PvP = 1,
	PvE = 2,
	Dungeons = 3,
	Fractals = 4,
	Raids = 5
}

export const GameModeName: string[] = [
	'WvW',
	'PvP',
	'PvE: Other',
	'PVE: Dungeons',
	'PVE: Fractals',
	'PVE: Raids',
];

export interface ITag {
	tagType: TagType;
	sortOrder?: number;
}

export interface ICharacterTag extends ITag {
	characterName: string;
}

export interface IProfessionTag extends ITag {
	profession: number;
}

export interface IMapTag extends ITag {
	mapId: number;
}

export interface IGameModeTag extends ITag {
	gameMode: GameModeType;
}

export interface ICommanderTag extends ITag {}

export const CreateTag = <T extends {}>(tag: T): T => tag;

export interface IMapLocationTag extends ITag {
	mapId: number;
	x: number;
	y: number;
	z: number;
	xSize: number;
	ySize: number;
	zSize: number;
}

export const YOrdinal = 0;
export const ZOrdinal = 1;
export const XOrdinal = 2;
