import { IConfig, CategoryType, IMap } from '@models/IConfig';
import { CreateTag, IProfessionTag, TagType, IMapTag, ICommanderTag, GameModeType } from '@models/ITag';
import { IHost } from '@models/IHost';

export function getMockConfig(): IConfig {
	return {
		settings: {
			UISize: 1,
			// these settings are not used in mock-mode
			Opacity: 90,
			MinimizeOnStart: false,
			MinimizeOnDrawerClosed: false,
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
				name: 'Necro DPS',
				groups: [
					{
						text: [ 'Build Chatlink' ]
					},
					{
						text: [ 'Build Chatlink' ]
					},
					{
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
				name: 'Necro DPS',
				groups: [
					{
						text: [ 'Build Chatlink' ]
					},
					{
						text: [ 'Build Chatlink' ]
					},
					{
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
				id: '6',
				categoryType: CategoryType.Build,
				name: 'Necro DPS',
				groups: [
					{
						text: [ 'Build Chatlink' ]
					},
					{
						text: [ 'Build Chatlink' ]
					},
					{
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
				id: '7',
				categoryType: CategoryType.Build,
				name: 'Necro DPS',
				groups: [
					{
						text: [ 'Build Chatlink' ]
					},
					{
						text: [ 'Build Chatlink' ]
					},
					{
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
				id: '8',
				categoryType: CategoryType.Build,
				name: 'Necro DPS',
				groups: [
					{
						text: [ 'Build Chatlink' ]
					},
					{
						text: [ 'Build Chatlink' ]
					},
					{
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
				id: '9',
				categoryType: CategoryType.Build,
				name: 'Necro DPS',
				groups: [
					{
						text: [ 'Build Chatlink' ]
					},
					{
						text: [ 'Build Chatlink' ]
					},
					{
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
				id: '10',
				categoryType: CategoryType.Build,
				name: 'Necro DPS',
				groups: [
					{
						text: [ 'Build Chatlink' ]
					},
					{
						text: [ 'Build Chatlink' ]
					},
					{
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
				id: '11',
				categoryType: CategoryType.Build,
				name: 'Necro DPS',
				groups: [
					{
						text: [ 'Build Chatlink' ]
					},
					{
						text: [ 'Build Chatlink' ]
					},
					{
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
				id: '12',
				categoryType: CategoryType.Build,
				name: 'Necro DPS',
				groups: [
					{
						text: [ 'Build Chatlink' ]
					},
					{
						text: [ 'Build Chatlink' ]
					},
					{
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
				id: '13',
				categoryType: CategoryType.Build,
				name: 'Necro DPS',
				groups: [
					{
						text: [ 'Build Chatlink' ]
					},
					{
						text: [ 'Build Chatlink' ]
					},
					{
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
				id: '14',
				categoryType: CategoryType.Build,
				name: 'Necro DPS',
				groups: [
					{
						text: [ 'Build Chatlink' ]
					},
					{
						text: [ 'Build Chatlink' ]
					},
					{
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

export const MockHost: IHost = {
	iconBarSize: 10,
	isEmbedded: () => false,
	isDebugMode: () => false,
	isDrawerOpen: () => true,
	IsInSystemTray: () => false,
	setClientReady: (ready:boolean)=> void 0,
	openDrawer: () => void 0,
	closeDrawer: () => void 0,
	minimizeWindow: () => void 0,
	restoreWindow: () => void 0,
	exit: () => void 0,
	refresh: () => void 0,
	setClipBoardData: (text: string) => void 0,
	getMumbleData: () => {
		return JSON.stringify({
			uiTick: Date.now(),
			fAvatarPosition: [ 1, 2, 3 ],
			currentWindowTitle: 'Guild Wars 2',
			identity: {
				profession: 8
			},
			context: {
				mapId: 1045 // 1209
			}
		});
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
