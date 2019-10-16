import React, { useEffect, Fragment, useState } from 'react';
import { HostManager } from '@libs/HostManager';
import { useStore, Area } from './StateContext';
import { useMumbleData } from '@libs/useMumbleData';
import { ProfessionName } from '@models/ITag';

export const Config = () => {
	const { store, state } = useStore();
	const [ mode, setMode ] = useState('mumble');
	const mumbleData = useMumbleData(250);

	useEffect(() => {
		store.updateState({ area: Area.Config });
		if (!HostManager.isDrawerOpen()) HostManager.openDrawer();
	}, []);

	return (
		<Fragment>
			<div className="layout-header">
				<input
					type="radio"
					value="mumble"
					checked={mode == 'mumble'}
					name="mode"
					onChange={(event) => setMode(event.target.value)}
				/>{' '}
				Mumble
				<input
					type="radio"
					value="catJson"
					checked={mode == 'catJson'}
					name="mode"
					onChange={(event) => setMode(event.target.value)}
				/>{' '}
				CategoryJSON
				{/* <input
					type="radio"
					value="cfg"
					checked={mode == 'cfg'}
					name="mode"
					onChange={(event) => setMode(event.target.value)}
				/>{' '}
				Cfg */}
			</div>
			<div className="layout-detail">
				{mode == 'mumble' && (
					<Fragment>
						{mumbleData && (
							<table id="debug-table">
								<tr>
									<th>Position</th>
									<td>
										{JSON.stringify(mumbleData.fAvatarPosition)}
										<br />
										<button
											style={{ marginTop: '5px' }}
											onClick={() =>
												HostManager.setClipBoardData(
													JSON.stringify(mumbleData.fAvatarPosition)
												)}
										>
											Copy to clipboard
										</button>
									</td>
								</tr>
								<tr>
									<th>Character</th>
									<td>
										Name: {mumbleData.identity.name}
										<br />
										Profession: {ProfessionName[mumbleData.identity.profession]} (#{mumbleData.identity.profession})
									</td>
								</tr>
								<tr>
									<th>Map</th>
									<td>
										{mumbleData.mapIsActive && (
											<Fragment>
												{mumbleData.mapName} (#{mumbleData.context.mapId})<br />
												Game Mode: {mumbleData.gameModeName}
											</Fragment>
										)}
										{!mumbleData.mapIsActive && <span>No active map</span>}
									</td>
								</tr>
								<tr>
									<th>System</th>
									<td>
										uiTick:{mumbleData.uiTick}
										<br />
										GW2 Has Focus:{mumbleData.gw2HasFocus ? 'Yes' : 'No'}
										<br />
										Assume context is stale:{mumbleData.assumeContextIsStale ? 'Yes' : 'No'}
										<br />
										Active window:{mumbleData.currentWindowTitle}
										<br />
										OnlyPositionChanged:{mumbleData.onlyPositionChanged ? 'Yes' : 'No'}
									</td>
								</tr>
							</table>
						)}
						{/* {<pre>{JSON.stringify(mumbleData, null, 2)}</pre>} */}
					</Fragment>
				)}
				{mode == 'catJson' && (
					<Fragment>
						<pre contentEditable={true}>
							{JSON.stringify(HostManager.getConfig().categoryData, null, 2)}
						</pre>
					</Fragment>
				)}
				{mode == 'cfg' && <Fragment>Cfg</Fragment>}
			</div>
		</Fragment>
	);
};
