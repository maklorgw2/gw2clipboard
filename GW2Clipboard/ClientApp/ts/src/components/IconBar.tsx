import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { CategoryType, HotKey } from '@models/IConfig';
import { useStore, Area } from './StateContext';
import { HostManager } from '@libs/HostManager';
import { checkPropTypes } from 'prop-types';

export const IconBar = () => {
	const { store, state } = useStore();
	const history = useHistory();

	const getIconStyle = (area: Area, currentArea: Area) => {
		const postfix = currentArea == area ? '-sel.png' : '.png';
		const icons = [ 'icon-build', 'icon-text', 'icon-cfg' ];
		return {
			outline: 'none',
			display: 'block',
			height: '42px',
			width: '42px',
			border: 'none',
			margin: 0,
			background: `url(resources/${icons[area]}${postfix})`
		};
	};

	return (
		<Fragment>
			<button
				title="Builds (Alt-B)"
				style={getIconStyle(Area.Build, state.area)}
				onClick={() => history.replace(`/CategoryType/${CategoryType.Build}`)}
			/>
			<button
				title="Text (Alt-T)"
				style={getIconStyle(Area.Text, state.area)}
				onClick={() => history.replace(`/CategoryType/${CategoryType.Text}`)}
			/>
			<button
				title="Configure"
				style={getIconStyle(Area.Config, state.area)}
				onClick={() => history.replace(`/Config/`)}
			/>
			<button title="Toggle drawer (Alt-Backspace)" onClick={()=>{
				// history.replace(`/`);
				// HostManager.closeDrawer();
				store.processHotKey(HotKey.CloseDrawer)
			}} style={{
						marginTop: '-2px',
						marginLeft:'2px',
						height: '37px',
						width: '40px',
						display: 'block',
						border: 'none',
						color: '#fff8d0',
						fontSize: '25px',
						backgroundColor: '#000',
						transform: HostManager.isDrawerOpen() ? null : 'rotateY(180deg)'
					}}>
				&#x27a4;
			</button>
			{HostManager.isDrawerOpen() &&
			HostManager.isDebugMode() && (
				<button
					title="Refresh Host"
					onClick={() => HostManager.refresh()}
					style={{
						height: '42px',
						width: '42px',
						display: 'block',
						border: 'none',
						color: '#fff8d0',
						fontSize: '30px',
						backgroundColor: '#000'
					}}
				>
					&#x21bb;
				</button>
			)}
		</Fragment>
	);
};
