import React, { createContext, useState, ReactNode, useRef, useContext } from 'react';
import { CategoryType, ICategory, Actions } from '@models/IConfig';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import { HostManager, WindowState } from '@libs/HostManager';
import { GameModeType, ProfessionType } from '@models/ITag';

/*=========================================================
A note about the current implementation of state management

Currently, state is wrapped by Context provider, however
actual state is stored in a global named Store. 

Store is global (and maintains state externally) as it is accessed
via the Windows Host application outside of React. 

It processes Hot Keys and needs to know state and update it.
============================================================*/

declare const window: any;

export enum Area {
	Build = CategoryType.Build,
	Text = CategoryType.Text,
	Config = 2
}

export enum SelectionMethod {
	Clicked,
	Key
}

export interface ISelectedCategory {
	data: ICategory;
	index: number | null;
	groupIndex: number | null;
	childIndex: number | null;
	method: SelectionMethod;
}

export interface IState {
	area: Area;
	windowState: WindowState;
	hotKeyHandler: (action: Actions) => void;
	selectedCategory: ISelectedCategory;
	filteredCategories: ICategory[];
	cachedGameMode: GameModeType;
	cachedProfession: ProfessionType;
	cachedMapId: number;
}

export interface IStore {
	processAction: (hotKeyId: number) => void;
	updateState: (partialState: Partial<IState>) => void;
	getInitialState: () => IState;
	setState: (state: Partial<IState>) => void;
	getState: () => IState;
	getHistory: () => History<any>;
	_update: () => void;
	_stateRef: React.MutableRefObject<IState>;
	_history: History<any>;
}

// world's worst guid: clashes extremely unlikely
const idPrefix = '0' + (Math.random() * 255).toString(16);
export const createGuid = () => idPrefix.substr(idPrefix.length - 2, 2) + Date.now().toString(16);

const Store: IStore = {
	getHistory: () => Store._history,
	processAction: (hotKey: Actions) => {
		const state = Store.getState();
		const history = Store.getHistory();
		const toggleMode = HostManager.getConfig().settings.ToggleMode;
		const windowState = Store.getState().windowState;

		switch (hotKey) {
			case Actions.RefreshClient:
				//alert("Refresh client")
				Store.updateState({ windowState: HostManager.getWindowState() });
				break;

			case Actions.OpenBuild:
				if (!toggleMode && state.area == Area.Build && windowState == WindowState.OpenVisible) break;
				if (windowState == WindowState.OpenVisible && state.area == Area.Build) {
					Store.updateState({ windowState: HostManager.getCloseState() });
					break;
				}
				Store.updateState({ windowState: WindowState.OpenVisible });
				history.replace(`/CategoryType/${CategoryType.Build}`);
				break;

			case Actions.OpenText:
				if (!toggleMode && state.area == Area.Text && windowState == WindowState.OpenVisible) break;
				if (windowState == WindowState.OpenVisible && state.area == Area.Text) {
					Store.updateState({ windowState: HostManager.getCloseState() });
					break;
				}
				Store.updateState({ windowState: WindowState.OpenVisible });
				history.replace(`/CategoryType/${CategoryType.Text}`);
				break;

			case Actions.OpenConfig:
				if (!toggleMode && state.area == Area.Config && windowState == WindowState.OpenVisible) break;
				if (windowState == WindowState.OpenVisible && state.area == Area.Config) {
					Store.updateState({ windowState: HostManager.getCloseState() });
					break;
				}
				Store.updateState({ windowState: WindowState.OpenVisible });
				history.replace(`/Config`);
				break;

			case Actions.CloseDrawer:
				if (windowState == WindowState.OpenVisible) {
					Store.updateState({ windowState: HostManager.getCloseState() });
					break;
				} else {
					Store.updateState({ windowState: WindowState.OpenVisible });
				}
				break;
			default:
				if (state.hotKeyHandler) state.hotKeyHandler(hotKey);
				break;
		}
	},
	updateState: (partialState: Partial<IState>) => {
		Store._stateRef.current = { ...Store._stateRef.current, ...partialState };
		Store._update();
		return Store.getState();
	},
	setState: (state: Partial<IState>) => {
		Store._stateRef.current = { ...state } as IState;
		Store._update();
		return Store.getState();
	},
	getState: () => {
		return { ...Store._stateRef.current };
	},
	getInitialState: () => {
		return {} as IState;
	},
	_update: null,
	_stateRef: null,
	_history: null
};

// Note: The context does not maintain any state (and currently redundant), all state is maintained in Store (see comment at top of file)
const StateContext = createContext<number>(null);

export const StateProvider = (props: { children: ReactNode[] | ReactNode }) => {
	const settings = HostManager.getConfig().settings;

	//alert(`MinimizeOnStart:${settings.MinimizeOnStart} MinimizeOnDrawerClosed:${settings.MinimizeOnDrawerClosed}`)
	const stateRef = useRef<IState>({
		selectedCategory: {},
		windowState: settings.MinimizeOnStart
			? WindowState.OpenMinimized
			: settings.MinimizeOnDrawerClosed ? WindowState.OpenVisible : WindowState.ClosedVisible
	} as IState);
	const [ update, updater ] = useState(0);

	if (window.store == null) {
		// Export store (for direct Host access/debugging)
		window.store = Store;
		Store._stateRef = stateRef;
	}

	// _update() is used to emulate a context state update
	Store._update = () => {
		updater(Date.now());
	};

	return <StateContext.Provider value={update}>{props.children}</StateContext.Provider>;
};

export const useStore = (): { store: IStore; state: IState } => {
	const update = useContext<number>(StateContext);
	if (Store._history == null) {
		Store._history = useHistory();
	}
	return {
		store: Store,
		state: Store._stateRef.current
	};
};
