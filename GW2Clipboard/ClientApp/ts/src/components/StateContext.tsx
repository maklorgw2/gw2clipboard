import React, { createContext, useState, ReactNode, useRef, useContext } from 'react';
import { HotKey, CategoryType, ICategory } from '@models/IConfig';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import { HostManager } from '@libs/HostManager';
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
	hotKeyHandler: (hotKey: HotKey) => void;
	selectedCategory: ISelectedCategory;
	filteredCategories: ICategory[];
	cachedGameMode: GameModeType;
	cachedProfession: ProfessionType;
	cachedMapId: number;
}

export interface IStore {
	processHotKey: (hotKeyId: number) => void;
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
	processHotKey: (hotKey: HotKey) => {
		const state = Store.getState();
		const history = Store.getHistory();
		switch (hotKey) {
			case HotKey.OpenBuild:
				if (HostManager.isDrawerOpen()) {
					if (state.area == Area.Build) {
						HostManager.closeDrawer();
						history.replace(`/`);
						break;
					}
				}
				Store.updateState({ area: Area.Build });
				history.replace(`/CategoryType/${CategoryType.Build}`);
				break;
			case HotKey.OpenText:
				if (HostManager.isDrawerOpen()) {
					if (state.area == Area.Text) {
						HostManager.closeDrawer();
						history.replace(`/`);
						break;
					}
				}
				Store.updateState({ area: Area.Text });
				history.replace(`/CategoryType/${CategoryType.Text}`);
				break;
			case HotKey.CloseDrawer:
				if (HostManager.isDrawerOpen()) {
					HostManager.closeDrawer();
					history.replace(`/`);
				} else {
					switch (state.area) {
						case Area.Text:
							history.replace(`/CategoryType/${CategoryType.Text}`);
							break;
						case Area.Config:
							history.replace(`/Config`);
							break;
						default:
							history.replace(`/CategoryType/${CategoryType.Build}`);
							break;
					}
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

// Note: The context does not maintain any state, all state is maintained in Store (see comment at top of file)
const StateContext = createContext<number>(null);

export const StateProvider = (props: { children: ReactNode[] | ReactNode }) => {
	const stateRef = useRef<IState>({ selectedCategory: {} } as IState);
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
