import { HostAction } from "@models/IConfig";

export interface IHost {
	iconBarSize: number;
	isEmbedded: () => boolean;
	isDrawerOpen: () => boolean;
	isDebugMode: () => boolean;
	IsInSystemTray: () => boolean;
	openDrawer: () => void;
	closeDrawer: () => void;
	minimizeWindow: () => void;
	restoreWindow: () => void;
	exit: () => void;
	refresh: () => void;
	setClipBoardData: (text: string) => void;
	getHostAction: () => HostAction;
	getMumbleData: () => string;
	loadMaps: () => string;
	loadSettings: () => string;
	saveSettings: (settingJSON: string) => void;
	loadCategories: () => string;
	saveCategories: (categoryJSON: string) => void;
	downloadUpdate: (updateUrl:string) => void;
}
