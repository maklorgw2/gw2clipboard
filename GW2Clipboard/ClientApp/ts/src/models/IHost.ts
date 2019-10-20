export interface IHost {
	iconBarSize: number;
	isEmbedded: () => boolean;
	isDrawerOpen: () => boolean;
	isDebugMode: () => boolean;
	IsInSystemTray: () => boolean;
	setClientReady: (ready:boolean) => void;
	openDrawer: () => void;
	closeDrawer: () => void;
	minimizeWindow: () => void;
	restoreWindow: () => void;
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
