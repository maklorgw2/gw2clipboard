import React, { createContext, useState, ReactNode, useContext } from 'react';
import { CategoryType, HostAction } from '@models/IConfig';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import { HostManager, WindowState } from '@libs/HostManager';
import { getDefaultMumbleData } from '@libs/mumble';
import { IState } from '../models/IState';

declare const window: any;

export enum Area {
	Build = CategoryType.Build,
	Text = CategoryType.Text,
	Config = 2
}

// world's worst guid: clashes extremely unlikely
const idPrefix = '0' + (Math.random() * 255).toString(16);
export const createGuid = () => idPrefix.substr(idPrefix.length - 2, 2) + Date.now().toString(16);

const processAction = (
	state: IState,
	setState: React.Dispatch<React.SetStateAction<IState>>,
	updateState: (partialState: Partial<IState>) => void,
	history: History<any>,
	hostAction: HostAction
) => {
	const toggleMode = HostManager.getConfig().settings.ToggleMode;
	const windowState = state.windowState;

	// Apply the new state asap to reduce jank on redirect
	const applyAndSetWindowState = (newState: WindowState) => {
		HostManager.applyWindowState(newState);
		updateState({ windowState: newState });
	};

	switch (hostAction) {
		case HostAction.RefreshClient:
			updateState({ windowState: HostManager.getWindowState() });
			break;

		case HostAction.Minimize:
			updateState({ windowState: WindowState.OpenMinimized });
			break;

		case HostAction.Restore:
			updateState({ windowState: WindowState.OpenVisible });
			break;

		case HostAction.RestoreClosed:
			updateState({ windowState: WindowState.ClosedVisible });
			break;

		case HostAction.ToggleBuild:
			if (!toggleMode && state.area == Area.Build && windowState == WindowState.OpenVisible) break;
			if (windowState == WindowState.OpenVisible && state.area == Area.Build) {
				applyAndSetWindowState(HostManager.getCloseState());
				break;
			}
			applyAndSetWindowState(WindowState.OpenVisible);
			history.replace(`/CategoryType/${CategoryType.Build}`);
			break;

		case HostAction.ToggleText:
			if (!toggleMode && state.area == Area.Text && windowState == WindowState.OpenVisible) break;
			if (windowState == WindowState.OpenVisible && state.area == Area.Text) {
				applyAndSetWindowState(HostManager.getCloseState());
				break;
			}
			applyAndSetWindowState(WindowState.OpenVisible);
			history.replace(`/CategoryType/${CategoryType.Text}`);
			break;

		case HostAction.ToggleConfig:
			if (!toggleMode && state.area == Area.Config && windowState == WindowState.OpenVisible) break;
			if (windowState == WindowState.OpenVisible && state.area == Area.Config) {
				applyAndSetWindowState(HostManager.getCloseState());
				break;
			}
			applyAndSetWindowState(WindowState.OpenVisible);
			history.replace(`/Config`);
			break;

		case HostAction.ToggleDrawer:
			if (windowState == WindowState.OpenVisible) {
				applyAndSetWindowState(HostManager.getCloseState());
				break;
			} else {
				applyAndSetWindowState(WindowState.OpenVisible);
			}
			break;
		default:
			if (state.hotKeyHandler) state.hotKeyHandler(hostAction, state, updateState);
			break;
	}
};

interface IStateContext {
	state: IState;
	setState: React.Dispatch<React.SetStateAction<IState>>;
	updateState: (partialState: Partial<IState>) => void;
}

interface IStore extends IStateContext {
	processAction: (hostAction: HostAction) => void;
	refresh: () => void;
}

const StateContext = createContext<IStateContext>(null);

export const StateProvider = (props: { children: ReactNode[] | ReactNode }) => {
	const settings = HostManager.getConfig().settings;

	const [ state, setState ] = useState<IState>(
		() =>
			({
				selectedCategory: {},
				windowState: settings.MinimizeOnStart
					? WindowState.OpenMinimized
					: settings.MinimizeOnDrawerClosed ? WindowState.OpenVisible : WindowState.ClosedVisible,
				mumbleData: getDefaultMumbleData()
			} as IState)
	);

	const updateState = (partialState: Partial<IState>) =>
		setState((prev) => ({
			...prev,
			...partialState
		}));

	return <StateContext.Provider value={{ state, setState, updateState }}>{props.children}</StateContext.Provider>;
};

export const useStore = (): IStore => {
	const { state, setState, updateState } = useContext<IStateContext>(StateContext);
	const history = useHistory();

	return {
		state,
		setState,
		updateState,
		processAction: (hostAction: HostAction) => processAction(state, setState, updateState, history, hostAction),
		refresh: () =>
			updateState({
				mumbleData: {
					...state.mumbleData,
					uiTick: state.mumbleData.uiTick + 1
				}
			})
	};
};
