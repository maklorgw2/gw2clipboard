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
	e?: boolean; // exclude from selectable maps
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
	UISize: number;
	OpenOpacity:number;
	ClosedOpacity:number;
	MinimizeOnStart:boolean;
	MinimizeOnDrawerClosed:boolean;
	ToggleMode:boolean;
	DrawerOpenTop:number;
	DrawerOpenLeft:number;
	DrawerOpenHeight:number;
	DrawerOpenWidth:number;
	DrawerClosedTop:number;
	DrawerClosedLeft:number;
	DrawerClosedHeight:number;
	DrawerClosedWidth:number;
	HotKeys: { [key: number]: number[] };
}

export enum Actions {
	// HotKeys
	OpenBuild = 100,
	OpenText = 101,
	CloseDrawer = 102,
	Up = 103,
	Down = 104,
	Left = 105,
	Right = 106,
	Select = 107,
	Minimize = 108,
	// Other Actions
	OpenConfig = 150,
	RefreshClient = 200
}

export interface IConfig {
	categoryData: ICategory[];
	settings: ISettings;
}
