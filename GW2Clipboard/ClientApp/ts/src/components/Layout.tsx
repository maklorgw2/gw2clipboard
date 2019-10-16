import React, { ReactNode, Fragment, useEffect } from 'react';
import { IconBar } from './IconBar';
import { useStore } from './StateContext';
import { HotKey } from '@models/IConfig';
import { HostManager } from '@libs/HostManager';

export const Layout = (props: { drawerOpen: boolean; children?: ReactNode | ReactNode[] }) => {
	const { store } = useStore();

	useEffect(() => {
		const handleKey = (event: any) => {
			// console.log('Local key: ', event.key);
			switch (event.key) {
				case 'Esc':
				case 'Escape':
					store.getHistory().replace(`/`);
					HostManager.closeDrawer();
					break;
				case 'Up':
				case 'ArrowUp':
					store.processHotKey(HotKey.Up);
					break;
				case 'Down':
				case 'ArrowDown':
					store.processHotKey(HotKey.Down);
					break;
				case 'Left':
				case 'ArrowLeft':
					store.processHotKey(HotKey.Left);
					break;
				case 'Right':
				case 'ArrowRight':
					store.processHotKey(HotKey.Right);
					break;
				case 'Enter':
					store.processHotKey(HotKey.Select);
					break;
			}
		};
		document.body.addEventListener('keydown', handleKey);
		return () => {
			document.body.removeEventListener('keydown', handleKey);
		};
	}, []);

	return (
		<Fragment>
			<div className="layout-container">
				<div className="icon-bar" style={{ width: `${HostManager.iconBarSize()}px !important` }}>
					<IconBar />
				</div>
				{props.drawerOpen && <div className="layout-content">{props.children}</div>}
			</div>
		</Fragment>
	);
};
