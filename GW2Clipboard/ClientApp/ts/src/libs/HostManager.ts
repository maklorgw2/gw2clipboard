import { IConfig, ISettings, ICategory, IMap, CURRENT_VERSION } from '@models/IConfig';
import { MockHost } from '@libs/mock';
import { IHost } from '@models/IHost';

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
	initialize: () => {
		HostManager._loadConfig();
		HostManager._loadMaps();
	},
	getConfig: () => HostManager._config,
	getHostAction: () => Host.getHostAction(),
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
	applyWindowState: (newState: WindowState) => {
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
				if (Host.IsInSystemTray()) Host.restoreWindow(true);
				break;
		}
	},
	getMaps: (selectableOnly: boolean) => (selectableOnly ? HostManager._selectableMaps : HostManager._maps),
	autoSaveCategories: () => {
		if (HostManager._autoSaveCategoriesDue != 0) {
			if (Date.now() > HostManager._autoSaveCategoriesDue) {
				HostManager.saveCategories();
			}
		}
	},
	addCategory: (category: ICategory, save = true) => {
		HostManager._config.categoryData = [ ...HostManager._config.categoryData, category ];
		if (save) HostManager.saveCategories();
		else HostManager._scheduleAutoSave();
	},
	updateCategory: (category: ICategory, save = true) => {
		HostManager._config.categoryData = [
			...HostManager._config.categoryData.filter((c) => c.id != category.id),
			category
		];
		if (save) HostManager.saveCategories();
		else HostManager._scheduleAutoSave();
	},
	deleteCategory: (category: ICategory, save = true) => {
		HostManager._config.categoryData = [ ...HostManager._config.categoryData.filter((c) => c.id != category.id) ];
		if (save) HostManager.saveCategories();
		else HostManager._scheduleAutoSave();
	},
	saveCategories: () => {
		Host.saveCategories(JSON.stringify(HostManager._config.categoryData, null, 2));
		HostManager._autoSaveCategoriesDue = 0;
	},
	importCategories: () => {
		const importData = Host.importCategories();
		if ((importData || '') > '' && importData[0] == '[') return JSON.parse(importData);
		return null;
	},
	exportCategories: (categories: ICategory[]) => Host.exportCategories(JSON.stringify(categories)),
	saveSettings: (settings: ISettings) => {
		HostManager._config.settings = settings;
		Host.saveSettings(JSON.stringify(HostManager._config.settings, null, 2));
	},
	getMumbleData: () => Host.getMumbleData(),
	setClipBoardData: (text: string, onlySetIfChanged: boolean = false) => {
		// alert(`onlySetIfChanged:${onlySetIfChanged} _lastClipboardData=${HostManager._lastClipboardData} changed=${HostManager._lastClipboardData != text}`)
		if (onlySetIfChanged) {
			if (HostManager._lastClipboardData != text) Host.setClipBoardData(text);
		} else Host.setClipBoardData(text);
		HostManager._lastClipboardData = text;
	},
	iconBarSize: () => Host.iconBarSize,
	isEmbedded: () => Host.isEmbedded(),
	isDebugMode: () => Host.isDebugMode(),
	isDrawerOpen: () => Host.isDrawerOpen(),
	IsInSystemTray: () => Host.IsInSystemTray(),
	refresh: () => {
		Host.refresh();
	},
	exit: () => Host.exit(),

	// internals
	_maps: null as IMap[],
	_selectableMaps: null as IMap[],
	_config: null as IConfig,
	_lastClipboardData: null as string,
	_autoSaveCategoriesDue: 0,

	_scheduleAutoSave: () => (HostManager._autoSaveCategoriesDue = Date.now() + 10000), // set to auto-save in 10 seconds from last update
	_loadConfig: () => {
		HostManager._config = {
			categoryData: JSON.parse(Host.loadCategories()) as ICategory[],
			settings: JSON.parse(Host.loadSettings()) as ISettings
		};
	},
	_loadMaps: () => {
		HostManager._maps = JSON.parse(Host.loadMaps()).sort((a: IMap, b: IMap) => ('' + a.t).localeCompare(b.t));
		HostManager._selectableMaps = HostManager._maps
			.filter((m) => !m.e)
			.sort((a: IMap, b: IMap) => ('' + a.t).localeCompare(b.t));
	},
	downloadUpdate: (updateUrl: string) => Host.downloadUpdate(updateUrl)
};

HostManager.initialize();
