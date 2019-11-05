import React, { Fragment } from 'react';
import { HostManager } from '@libs/HostManager';
import { ProfessionName } from '@models/ITag';
import { useStore } from '@libs/StateContext';

export const MumbleConfig = (props: { selectElement: JSX.Element }) => {
	const { state } = useStore();
	return (
		<Fragment>
			<div className="layout-header">{props.selectElement}</div>
			<div className="layout-detail">
				{state.mumbleData && (
					<div id="debug-table">
						<table>
							<tr>
								<th>Position</th>
								<td>
									{JSON.stringify(state.mumbleData.fAvatarPosition)}
									<br />
									<button
										style={{ marginTop: '5px' }}
										onClick={() =>
											HostManager.setClipBoardData(
												JSON.stringify(state.mumbleData.fAvatarPosition)
											)}
									>
										Copy to clipboard
									</button>
								</td>
							</tr>
							<tr>
								<th>Character</th>
								<td>
									Name: {state.mumbleData.identity.name}
									<br />
									Profession: {ProfessionName[state.mumbleData.identity.profession]} (#{state.mumbleData.identity.profession})
								</td>
							</tr>
							<tr>
								<th>Map</th>
								<td>
									{state.mumbleData.mapIsActive && (
										<Fragment>
											{state.mumbleData.mapName} (#{state.mumbleData.context.mapId})<br />
											Game Mode: {state.mumbleData.gameModeName}
										</Fragment>
									)}
									{!state.mumbleData.mapIsActive && <span>No active map</span>}
								</td>
							</tr>
							<tr>
								<th>System</th>
								<td>
									uiTick:{state.mumbleData.uiTick}
									<br />
									GW2 Has Focus:{state.mumbleData.gw2HasFocus ? 'Yes' : 'No'}
									<br />
									Assume context is stale:{state.mumbleData.assumeContextIsStale ? 'Yes' : 'No'}
									<br />
									Active window:{state.mumbleData.currentWindowTitle}
									<br />
									OnlyPositionChanged:{state.mumbleData.onlyPositionChanged ? 'Yes' : 'No'}
								</td>
							</tr>
						</table>
					</div>
				)}
			</div>
		</Fragment>
	);
};
