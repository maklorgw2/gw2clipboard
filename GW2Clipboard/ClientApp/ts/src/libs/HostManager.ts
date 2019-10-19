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

// Global HostManager provides any conversions between Host and Client and stores configuration
// HostManager's storing of setting state is questionable and it could (should?) be migrated to Store
export const HostManager = {
	maps: null as IMap[],
	config: null as IConfig,
	getConfig: () => HostManager.config,
	loadConfig: () => {
		HostManager.config = {
			categoryData: JSON.parse(Host.loadCategories()) as ICategory[],
			settings: JSON.parse(Host.loadSettings()) as ISettings
		};
	},
	loadMaps: () => {
		if (HostManager.maps == null) {
			HostManager.maps = JSON.parse(Host.loadMaps()).sort((a: IMap, b: IMap) => ('' + a.t).localeCompare(b.t));
			console.log('load maps');
		}
		return HostManager.maps;
	},
	addCategory: (category:ICategory, autoSave = true)  => {
		HostManager.config.categoryData = [ ...HostManager.config.categoryData, category ]
		if (autoSave) HostManager.saveCategories();
	},
	updateCategory: (category:ICategory, autoSave = true) => {
		HostManager.config.categoryData = [ ...HostManager.config.categoryData.filter((c) => c.id != category.id), category ];
		if (autoSave) HostManager.saveCategories();
	},
	deleteCategory: (category:ICategory, autoSave = true) => {
		HostManager.config.categoryData = [ ...HostManager.config.categoryData.filter((c) => c.id != category.id) ];
		if (autoSave) HostManager.saveCategories();
	},
	saveCategories: () => {
		Host.saveCategories(JSON.stringify(HostManager.config.categoryData, null, 2));
	},
	saveSettings: (settings:ISettings) => {
		HostManager.config.settings = settings;
		Host.saveSettings(JSON.stringify(HostManager.config.settings, null, 2))
	},
	getMumbleData: () => Host.getMumbleData(),
	setClipBoardData: (text: string) => Host.setClipBoardData(text),
	iconBarSize: () => Host.iconBarSize,
	isEmbedded: () => Host.isEmbedded(),
	isDebugMode: () => Host.isDebugMode(),
	isDrawerOpen: () => Host.isDrawerOpen(),
	IsInSystemTray: () => Host.IsInSystemTray(),
	openDrawer: () => Host.openDrawer(),
	closeDrawer: () => Host.closeDrawer(),
	refresh: () => {
		//location.reload(true);
		Host.refresh()
	},
	exit: () => Host.exit()
};

HostManager.loadConfig();
HostManager.loadMaps();
