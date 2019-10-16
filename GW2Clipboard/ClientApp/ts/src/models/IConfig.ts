import { ITag, GameModeType } from './ITag';

export enum CategoryType {
	Build = 0,
	Text = 1,
	Other = 99
}

export interface IGroup {
	name?: string;
	text: string[];
	sortOrder?: number;
}

export interface IMap {
	id: number; // mapId
	t: string; // map name / title
	m: GameModeType; // game mode
}

export interface ICategory {
	id: string;
	categoryType: CategoryType;
	name: string;
	tags: ITag[];
	groups: IGroup[];
	sortOrder?: number;
}

export interface ISettings {
	uISize: number;
	hostFormTop: number;
	hostFormLeft: number;
	hostFormHeight: number;
	hostFormWidth: number;
	hotKeys: { [key: number]: number[] };
}

export enum HotKey {
	OpenBuild = 100,
	OpenText = 101,
	CloseDrawer = 102,
	Up = 103,
	Down = 104,
	Left = 105,
	Right = 106,
	Select = 107
}

export interface IConfig {
	categoryData: ICategory[];
	settings: ISettings;
}
