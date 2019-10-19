import React, { Fragment } from 'react';
import { HostManager } from '@libs/HostManager';
import { useMumbleData } from '@libs/useMumbleData';
import { ProfessionName } from '@models/ITag';
export const MumbleConfig = () => {
	const mumbleData = useMumbleData(250);
	return (<Fragment>
		{mumbleData && (<table id="debug-table">
			<tr>
				<th>Position</th>
				<td>
					{JSON.stringify(mumbleData.fAvatarPosition)}
					<br />
					<button style={{ marginTop: '5px' }} onClick={() => HostManager.setClipBoardData(JSON.stringify(mumbleData.fAvatarPosition))}>
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
					{mumbleData.mapIsActive && (<Fragment>
						{mumbleData.mapName} (#{mumbleData.context.mapId})<br />
						Game Mode: {mumbleData.gameModeName}
					</Fragment>)}
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
		</table>)}

	</Fragment>);
};
