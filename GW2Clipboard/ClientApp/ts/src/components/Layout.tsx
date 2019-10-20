import React, { ReactNode, Fragment, useEffect, useLayoutEffect } from 'react';
import { IconBar } from './IconBar';
import { useStore } from './StateContext';
import { Actions } from '@models/IConfig';
import { HostManager, WindowState } from '@libs/HostManager';

export const Layout = (props: { children?: ReactNode | ReactNode[] }) => {
	const { store, state } = useStore();

	useEffect(() => {
		const handleKey = (event: any) => {
			// console.log('Local key: ', event.key);
			switch (event.key) {
				case 'Esc':
				case 'Escape':
					store.processAction(Actions.CloseDrawer);
					break;
				case 'Up':
				case 'ArrowUp':
					store.processAction(Actions.Up);
					break;
				case 'Down':
				case 'ArrowDown':
					store.processAction(Actions.Down);
					break;
				case 'Left':
				case 'ArrowLeft':
					store.processAction(Actions.Left);
					break;
				case 'Right':
				case 'ArrowRight':
					store.processAction(Actions.Right);
					break;
				case 'Enter':
					store.processAction(Actions.Select);
					break;
			}
		};
		document.body.addEventListener('keydown', handleKey);
		return () => {
			document.body.removeEventListener('keydown', handleKey);
		};
	}, []);

	useLayoutEffect(() => {
		HostManager.setClientReady(true);
	}, []);

	useEffect(() => {
		HostManager.setWindowState(state.windowState);
	}, [ state.windowState ]);

	return (
		<Fragment>
			<div className="layout-container">
				<div className="icon-bar" style={{ width: `${HostManager.iconBarSize()}px !important` }}>
					<IconBar />
				</div>
				{(state.windowState==WindowState.OpenVisible || state.windowState==WindowState.OpenMinimized) && <div className="layout-content">{props.children}</div>}
			</div>
		</Fragment>
	);
};
