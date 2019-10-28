import React, { ReactNode, Fragment, useEffect, useLayoutEffect } from 'react';
import { IconBar } from '@components/IconBar';
import { useStore } from '@libs/StateContext';
import { HostAction } from '@models/IConfig';
import { HostManager, WindowState } from '@libs/HostManager';
import { useInterval } from '@libs/useInterval';
import { processMumbleData } from '@libs/mumble';

export const Layout = (props: { children?: ReactNode | ReactNode[] }) => {
	const { state, updateState, processAction } = useStore();

	useInterval(() => {
		processMumbleData(state, updateState);
		
		while (true) {
			const hostAction = HostManager.getHostAction();
			if (hostAction == HostAction.None) break;
			//hostActions.push(hostAction);
			processAction(hostAction);
		}

		// Auto-save if needed
		HostManager.autoSaveCategories();
	}, 100);

	useEffect(() => {
		const handleKey = (event: any) => {
			console.log('Local key: ', event.key);
			switch (event.key) {
				case 'Esc':
				case 'Escape':
					if (HostManager.isDrawerOpen()) processAction(HostAction.ToggleDrawer);
					break;
				case 'Up':
				case 'ArrowUp':
					processAction(HostAction.Up);
					break;
				case 'Down':
				case 'ArrowDown':
					processAction(HostAction.Down);
					break;
				case 'Left':
				case 'ArrowLeft':
					processAction(HostAction.Left);
					break;
				case 'Right':
				case 'ArrowRight':
					processAction(HostAction.Right);
					break;
				case 'Enter':
					processAction(HostAction.Select);
					break;
			}
		};
		document.body.addEventListener('keydown', handleKey);
		return () => {
			document.body.removeEventListener('keydown', handleKey);
		};
	});

	// useLayoutEffect(() => {
	// 	HostManager.setClientReady(true);
	// }, []);

	// Apply any new window state to host
	useEffect(() => HostManager.applyWindowState(state.windowState), [ state.windowState ]);

	return (
		<Fragment>
			<div className="layout-container">
				<div className="icon-bar" style={{ width: `${HostManager.iconBarSize()}px !important` }}>
					<IconBar />
				</div>
				{(state.windowState == WindowState.OpenVisible || state.windowState == WindowState.OpenMinimized) && (
					<div className="layout-content">{props.children}</div>
				)}
			</div>
		</Fragment>
	);
};
