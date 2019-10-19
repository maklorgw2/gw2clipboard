export interface IHost {
	iconBarSize: number;
	isEmbedded: () => boolean;
	isDrawerOpen: () => boolean;
	isDebugMode: () => boolean;
	IsInSystemTray: () => boolean;
	openDrawer: () => void;
	closeDrawer: () => void;
	minimize: () => void;
	exit: () => void;
	refresh: () => void;
	setClipBoardData: (text: string) => void;
	getMumbleData: () => string;
	loadMaps: () => string;
	loadSettings: () => string;
	saveSettings: (settingJSON: string) => void;
	loadCategories: () => string;
	saveCategories: (categoryJSON: string) => void;
}
