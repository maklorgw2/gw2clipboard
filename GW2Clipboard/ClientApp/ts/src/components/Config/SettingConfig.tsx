import React, { Fragment, useState } from 'react';
import { CURRENT_VERSION } from '@models/IConfig';
import { useUpdateCheck } from '@libs/useUpdateCheck';
import { HostManager } from '@libs/HostManager';
export const SettingConfig = (props: { selectElement: JSX.Element }) => {
	const { check, busy } = useUpdateCheck(false);
	const [ tempSettings, setTempSettings ] = useState({ ...HostManager.getConfig().settings });
	return (
		<Fragment>
			<div className="layout-header">
				{props.selectElement}
				<button
					style={{ float: 'right' }}
					onClick={() => {
						const newSettings = { ...tempSettings };
						if (newSettings.OpenOpacity < 50) newSettings.OpenOpacity = 50;
						if (newSettings.OpenOpacity > 100) newSettings.OpenOpacity = 100;
						if (newSettings.ClosedOpacity < 50) newSettings.ClosedOpacity = 50;
						if (newSettings.ClosedOpacity > 100) newSettings.ClosedOpacity = 100;
						setTempSettings(newSettings);
						HostManager.saveSettings(newSettings);
					}}
				>
					Apply
				</button>
			</div>
			<div className="layout-detail">
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
									value={tempSettings.OpenOpacity}
									onChange={(e) => {
										e.stopPropagation();
										if (e.target.value != '') {
											if (!/^\d{1,3}$/.test(e.target.value)) {
												e.preventDefault();
												return;
											}
										}
										setTempSettings({
											...tempSettings,
											OpenOpacity: e.target.value as any
										});
									}}
								/>{' '}
								% <span style={{ color: '#999' }}> (between 50-100%)</span>
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
									value={tempSettings.ClosedOpacity}
									onChange={(e) => {
										e.stopPropagation();
										if (e.target.value != '') {
											if (!/^\d{1,3}$/.test(e.target.value)) {
												e.preventDefault();
												return;
											}
										}
										setTempSettings({
											...tempSettings,
											ClosedOpacity: e.target.value as any
										});
									}}
								/>{' '}
								% <span style={{ color: '#999' }}> (between 50-100%)</span>
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
												checked={tempSettings.CheckForUpdateOnStart}
												onChange={(e) =>
													setTempSettings({
														...tempSettings,
														CheckForUpdateOnStart: e.target.checked
													})}
											/>
										</td>
										<td>
											<label htmlFor="chkCheckForUpdateOnStart">
												Check for updates when started
											</label>
										</td>
									</tr>
									<tr>
										<td>
											<input
												id="chkMinimizeOnStart"
												type="checkbox"
												checked={tempSettings.MinimizeOnStart}
												onChange={(e) =>
													setTempSettings({
														...tempSettings,
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
												checked={tempSettings.ShowCategoryIcons}
												onChange={(e) =>
													setTempSettings({
														...tempSettings,
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
												checked={tempSettings.ToggleMode}
												onChange={(e) =>
													setTempSettings({
														...tempSettings,
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
												checked={tempSettings.CaptureMouseOnEnter}
												onChange={(e) =>
													setTempSettings({
														...tempSettings,
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
								<br />
								<div style={{ fontSize: '10px', marginTop: '5px' }}>
									Current version: {CURRENT_VERSION}
								</div>
							</td>
						</tr>
					</table>
				</div>
			</div>
		</Fragment>
	);
};
