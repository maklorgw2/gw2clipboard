import { IConfig, ISettings, ICategory, IMap } from '../models/IConfig';
import { MockHost } from '@libs/mock';
import { IHost } from '../models/IHost';

// This is the interface to the Windows Host
let Host: IHost = window.external as any;

// If the webpage is not running in the Host switch to debug mode and mock the data
if (!Host.isEmbedded) {
	Host = MockHost;
	document.title = 'GW2Clipboard: Mock';
}

export enum WindowState {
	OpenVisible,
	OpenMinimized,
	ClosedVisible,
	ClosedMinimized
}

// Global HostManager provides any conversions between Host and Client and stores configuration
// HostManager's storing of setting state is questionable and it could (should?) be migrated to Store
export const HostManager = {
	_maps: null as IMap[],
	_selectableMaps: null as IMap[],
	_config: null as IConfig,
	initialize: () => {
		HostManager._loadConfig();
		HostManager._loadMaps();
	},
	getConfig: () => HostManager._config,
	_loadConfig: () => {
		HostManager._config = {
			categoryData: JSON.parse(Host.loadCategories()) as ICategory[],
			settings: JSON.parse(Host.loadSettings()) as ISettings
		};
	},
	_loadMaps: () => {
		HostManager._maps = JSON.parse(Host.loadMaps()).sort((a: IMap, b: IMap) => ('' + a.t).localeCompare(b.t));
	},
	getCloseState: () => {
		const minimizeOnDrawerClosed = HostManager.getConfig().settings.MinimizeOnDrawerClosed;
		if (minimizeOnDrawerClosed) return WindowState.OpenMinimized;
		else return WindowState.ClosedVisible;
	},
	getWindowState: (): WindowState => {
		if (Host.IsInSystemTray()) {
			if (Host.isDrawerOpen) return WindowState.OpenMinimized;
			else return WindowState.ClosedMinimized;
		} else {
			if (Host.isDrawerOpen) return WindowState.OpenVisible;
			else return WindowState.ClosedVisible;
		}
	},
	setWindowState: (newState: WindowState) => {
		switch (newState) {
			case WindowState.OpenMinimized:
				if (!Host.isDrawerOpen()) Host.openDrawer();
				if (!Host.IsInSystemTray()) Host.minimizeWindow();
				break;
			case WindowState.OpenVisible:
				if (!Host.isDrawerOpen()) Host.openDrawer();
				if (Host.IsInSystemTray()) Host.restoreWindow();
				break;
			case WindowState.ClosedMinimized:
				if (Host.isDrawerOpen()) Host.closeDrawer();
				if (!Host.IsInSystemTray()) Host.minimizeWindow();
				break;
			case WindowState.ClosedVisible:
				if (Host.isDrawerOpen()) Host.closeDrawer();
				if (Host.IsInSystemTray()) Host.restoreWindow();
				break;
		}
	},
	getMaps: (selectableOnly: boolean) => (selectableOnly ? HostManager._selectableMaps : HostManager._maps),
	addCategory: (category: ICategory, autoSave = true) => {
		HostManager._config.categoryData = [ ...HostManager._config.categoryData, category ];
		if (autoSave) HostManager.saveCategories();
	},
	updateCategory: (category: ICategory, autoSave = true) => {
		HostManager._config.categoryData = [
			...HostManager._config.categoryData.filter((c) => c.id != category.id),
			category
		];
		if (autoSave) HostManager.saveCategories();
	},
	deleteCategory: (category: ICategory, autoSave = true) => {
		HostManager._config.categoryData = [ ...HostManager._config.categoryData.filter((c) => c.id != category.id) ];
		if (autoSave) HostManager.saveCategories();
	},
	saveCategories: () => {
		Host.saveCategories(JSON.stringify(HostManager._config.categoryData, null, 2));
	},
	saveSettings: (settings: ISettings) => {
		HostManager._config.settings = settings;
		Host.saveSettings(JSON.stringify(HostManager._config.settings, null, 2));
	},
	getMumbleData: () => Host.getMumbleData(),
	setClientReady: (ready: boolean) => Host.setClientReady(ready),
	setClipBoardData: (text: string) => Host.setClipBoardData(text),
	iconBarSize: () => Host.iconBarSize,
	isEmbedded: () => Host.isEmbedded(),
	isDebugMode: () => Host.isDebugMode(),
	isDrawerOpen: () => Host.isDrawerOpen(),
	IsInSystemTray: () => Host.IsInSystemTray(),
	refresh: () => {
		Host.refresh();
	},
	exit: () => Host.exit()
};

HostManager.initialize();
