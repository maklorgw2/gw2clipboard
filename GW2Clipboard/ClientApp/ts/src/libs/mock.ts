import { IConfig, CategoryType, IMap, HostAction } from '@models/IConfig';
import { CreateTag, IProfessionTag, TagType, IMapTag, ICommanderTag, GameModeType } from '@models/ITag';
import { IHost } from '@models/IHost';
import { IMumbleData } from '@models/IMumbleData';
import { any } from 'prop-types';

export function getMockConfig(): IConfig {
	return {
		settings: {
			UISize: 1,
			// these settings are not used in mock-mode
			OpenOpacity: 90,
			ClosedOpacity: 75,
			MinimizeOnStart: false,
			MinimizeOnDrawerClosed: false,
			CaptureMouseOnEnter: false,
			ToggleMode: true,
			DrawerOpenTop: 100,
			DrawerOpenLeft: 100,
			DrawerOpenHeight: 100,
			DrawerOpenWidth: 100,
			DrawerClosedTop: 100,
			DrawerClosedLeft: 100,
			DrawerClosedHeight: 100,
			DrawerClosedWidth: 100,
			HotKeys: []
		},
		categoryData: [
			{
				id: '1',
				categoryType: CategoryType.Text,
				name: 'Necro',
				groups: [
					{
						text: [ 'Hello Necro' ]
					},
					{
						text: [ 'Moar Necro' ]
					}
				],
				tags: [
					CreateTag<IProfessionTag>({
						tagType: TagType.Profession,
						profession: 8
					})
				]
			},
			{
				id: '2',
				categoryType: CategoryType.Text,
				name: 'Mistlock Necro',
				groups: [
					{
						text: [ 'Hello Mistlock Necro' ]
					}
				],
				tags: [
					CreateTag<IProfessionTag>({
						tagType: TagType.Profession,
						profession: 8
					}),
					CreateTag<IMapTag>({
						tagType: TagType.Map,
						mapId: 1206
					})
				]
			},
			{
				id: '3',
				categoryType: CategoryType.Text,
				name: 'Commander',
				groups: [
					{
						text: [ 'Hello Commander' ]
					}
				],
				tags: [ CreateTag<ICommanderTag>({ tagType: TagType.Commander }) ]
			},
			{
				id: '4',
				categoryType: CategoryType.Build,
				name: 'Necro',
				groups: [
					{
						name: 'Heal scourge',
						text: [ 'Build Chatlink' ]
					},
					{
						name: 'Condi scourge',
						text: [ 'Build Chatlink' ]
					},
					{
						name: 'Power reaper',
						text: [ 'Build Chatlink' ]
					}
				],
				tags: [
					CreateTag<IProfessionTag>({
						tagType: TagType.Profession,
						profession: 8
					})
				]
			},
			{
				id: '5',
				categoryType: CategoryType.Build,
				name: 'Ranger',
				groups: [
					{
						name: 'Druid',
						text: [ 'Build Chatlink' ]
					},
					{
						name: 'Power Soulbeast',
						text: [ 'Build Chatlink' ]
					},
					{
						name: 'Condi Soulbeast',
						text: [ 'Build Chatlink' ]
					}
				],
				tags: [
					CreateTag<IProfessionTag>({
						tagType: TagType.Profession,
						profession: 8
					})
				]
			},
			{
				id: '15',
				categoryType: CategoryType.Text,
				name: 'TD Lane Spam',
				groups: [
					{
						text: [ 'Welcome to Rata Lane', 'Here you Charge a Golem' ]
					},
					{
						text: [ 'Welcome to Ogre Lane', 'Here you break eggs' ]
					},
					{
						text: [ 'Welcome to Scar Lane', 'Here you kill mobs' ]
					},
					{
						text: [ 'Welcome to Nuhoch Lane', 'Here you smash mushrooms' ]
					}
				],
				tags: [
					CreateTag<IMapTag>({
						tagType: TagType.Map,
						mapId: 1045
					})
				]
			}
		]
	};
}

let mockConfig: IConfig = getMockConfig();
let mockMaps: IMap[] = [
	{
		id: 1,
		t: 'PvE Map',
		m: GameModeType.PvE
	},
	{
		id: 2,
		t: 'PvP Map',
		m: GameModeType.PvP
	},
	{
		id: 3,
		t: 'Raid Map',
		m: GameModeType.Raids
	},
	{
		id: 4,
		t: 'Fractal Map',
		m: GameModeType.Fractals
	},
	{
		id: 5,
		t: 'WvW Map',
		m: GameModeType.WvW
	},
	{
		id: 6,
		t: 'Dungeon Map',
		m: GameModeType.Dungeons
	}
];

interface IMockHost extends IHost {
	_mumbleData: IMumbleData;
}

export const MockHost: IMockHost = {
	_mumbleData: {
		uiTick: Date.now(),
		fAvatarPosition: [ 1, 2, 3 ],
		currentWindowTitle: 'Guild Wars 2',
		identity: {
			profession: 8
		},
		context: {
			mapId: 1045 // 1209
		}
	} as IMumbleData,

	iconBarSize: 10,
	isEmbedded: () => false,
	isDebugMode: () => false,
	isDrawerOpen: () => true,
	IsInSystemTray: () => false,
	openDrawer: () => void 0,
	closeDrawer: () => void 0,
	minimizeWindow: () => void 0,
	restoreWindow: () => void 0,
	exit: () => void 0,
	refresh: () => void 0,
	setClipBoardData: (text: string) => void 0,
	getHostAction: () => HostAction.None,
	getMumbleData: () => {
		MockHost._mumbleData.uiTick = Date.now();
		return JSON.stringify(MockHost._mumbleData);
	},
	loadSettings: () => JSON.stringify(mockConfig.settings, null, 2),
	saveSettings: (settingJSON: string) => void 0,
	loadCategories: () => JSON.stringify(mockConfig.categoryData, null, 2),
	saveCategories: (categoryJSON: string) => {
		console.log(categoryJSON);
		mockConfig.categoryData = JSON.parse(categoryJSON);
	},
	loadMaps: () => JSON.stringify(mockMaps)
};

declare const window: any;
window.MockHost = MockHost;
