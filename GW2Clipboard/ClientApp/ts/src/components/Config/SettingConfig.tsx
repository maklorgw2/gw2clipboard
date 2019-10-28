import React from 'react';
import { ISettings } from '@models/IConfig';
export const SettingConfig = (props: {
	tempSettings: ISettings;
	setTempSettings: (settings: ISettings) => void;
}) => {
	return (<div id="debug-table">
		<table>
			<tr>
				<th>Opacity<br/>(Open)</th>
				<td>
					<input type="text" maxLength={3} style={{ width: '4rem' }} value={props.tempSettings.OpenOpacity} onChange={(e) => {
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
					}} />{' '}
					% (50-100%)
					</td>
			</tr>
			<tr>
				<th>Opacity<br/>(Closed)</th>
				<td>
					<input type="text" maxLength={3} style={{ width: '4rem' }} value={props.tempSettings.ClosedOpacity} onChange={(e) => {
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
					}} />{' '}
					% (50-100%)
					</td>
			</tr>
			<tr>
				<th rowSpan={4} />
				<td>
					<label>
						<input type="checkbox" checked={props.tempSettings.MinimizeOnDrawerClosed} onChange={(e) => props.setTempSettings({
							...props.tempSettings,
							MinimizeOnDrawerClosed: e.target.checked
						})} />Minimize to system tray when drawer is closed
						</label>
				</td>
			</tr>
			<tr>
				<td>
					<label>
						<input type="checkbox" checked={props.tempSettings.MinimizeOnStart} onChange={(e) => props.setTempSettings({ ...props.tempSettings, MinimizeOnStart: e.target.checked })} />Start minimized in system tray
						</label>
				</td>
			</tr>
			<tr>
				<td>
					<label>
						<input type="checkbox" checked={props.tempSettings.ToggleMode} onChange={(e) => props.setTempSettings({ ...props.tempSettings, ToggleMode: e.target.checked })} />Toggle drawer mode
						</label>
				</td>
			</tr>
			<tr>
				<td>
					<label>
						<input type="checkbox" checked={props.tempSettings.CaptureMouseOnEnter} onChange={(e) => props.setTempSettings({ ...props.tempSettings, CaptureMouseOnEnter: e.target.checked })} />Capture mouse
						</label>
				</td>
			</tr>
		</table>
	</div>);
};
