import React from 'react';
import { ISettings, CURRENT_VERSION } from '@models/IConfig';
import { useUpdateCheck } from '@libs/useUpdateCheck';
export const SettingConfig = (props: { tempSettings: ISettings; setTempSettings: (settings: ISettings) => void }) => {
	const { check, busy } = useUpdateCheck(false);

	return (
		<div id="debug-table">
			<table>
				<tr>
					<th>
						Opacity<br />(Open)
					</th>
					<td>
						<input
							type="text"
							maxLength={3}
							style={{ width: '4rem' }}
							value={props.tempSettings.OpenOpacity}
							onChange={(e) => {
								e.stopPropagation();
								if (e.target.value != '') {
									if (!/^\d{1,3}$/.test(e.target.value)) {
										e.preventDefault();
										return;
									}
								}
								props.setTempSettings({
									...props.tempSettings,
									OpenOpacity: e.target.value as any
								});
							}}
						/>{' '}
						% <span style={{color:'#999'}}> (between 50-100%)</span>
					</td>
				</tr>
				<tr>
					<th>
						Opacity<br />(Closed)
					</th>
					<td>
						<input
							type="text"
							maxLength={3}
							style={{ width: '4rem' }}
							value={props.tempSettings.ClosedOpacity}
							onChange={(e) => {
								e.stopPropagation();
								if (e.target.value != '') {
									if (!/^\d{1,3}$/.test(e.target.value)) {
										e.preventDefault();
										return;
									}
								}
								props.setTempSettings({
									...props.tempSettings,
									ClosedOpacity: e.target.value as any
								});
							}}
						/>{' '}
						% <span style={{color:'#999'}}> (between 50-100%)</span>
					</td>
				</tr>
				<tr>
					<th />
					<td>
						<table className="checkbox-table">
							<tr>
								<td>
									<input
										id="chkCheckForUpdateOnStart"
										type="checkbox"
										checked={props.tempSettings.CheckForUpdateOnStart}
										onChange={(e) =>
											props.setTempSettings({
												...props.tempSettings,
												CheckForUpdateOnStart: e.target.checked
											})}
									/>
								</td>
								<td>
									<label htmlFor="chkCheckForUpdateOnStart">Check for updates when started</label>
								</td>
							</tr>
							<tr>
								<td>
									<input
										id="chkMinimizeOnStart"
										type="checkbox"
										checked={props.tempSettings.MinimizeOnStart}
										onChange={(e) =>
											props.setTempSettings({
												...props.tempSettings,
												MinimizeOnStart: e.target.checked
											})}
									/>
								</td>
								<td>
									<label htmlFor="chkMinimizeOnStart">Start minimized in system tray</label>
								</td>
							</tr>
							<tr>
								<td>
									<input
										id="chkShowCategoryIcons"
										type="checkbox"
										checked={props.tempSettings.ShowCategoryIcons}
										onChange={(e) =>
											props.setTempSettings({
												...props.tempSettings,
												ShowCategoryIcons: e.target.checked
											})}
									/>
								</td>
								<td>
									<label htmlFor="chkShowCategoryIcons">Show Category icons</label>
								</td>
							</tr>
							<tr>
								<td>
									<input
										id="chkToggleMode"
										type="checkbox"
										checked={props.tempSettings.ToggleMode}
										onChange={(e) =>
											props.setTempSettings({
												...props.tempSettings,
												ToggleMode: e.target.checked
											})}
									/>
								</td>
								<td>
									<label htmlFor="chkToggleMode">Toggle drawer mode</label>
								</td>
							</tr>
							<tr>
								<td>
									<input
										id="chkCaptureMouseOnEnter"
										type="checkbox"
										checked={props.tempSettings.CaptureMouseOnEnter}
										onChange={(e) =>
											props.setTempSettings({
												...props.tempSettings,
												CaptureMouseOnEnter: e.target.checked
											})}
									/>
								</td>
								<td>
									<label htmlFor="chkCaptureMouseOnEnter">Capture mouse on hover</label>
								</td>
							</tr>
						</table>
						<button style={{ marginTop: 10 }} disabled={busy} onClick={() => check()}>
							Check for updates
						</button>
						<br /><div style={{fontSize:'10px',marginTop:'5px'}}>Current version: {CURRENT_VERSION}</div>
					</td>
				</tr>
			</table>
		</div>
	);
};
