import React from 'react';
import { ISettings } from '@models/IConfig';
export const SettingConfig = (props: {
	tempSettings: ISettings;
	setTempSettings: (settings: ISettings) => void;
}) => {
	return (<div id="debug-table">
		<table>
			<tr>
				<th>Opacity</th>
				<td>
					<input type="text" maxLength={3} style={{ width: '4rem' }} value={props.tempSettings.Opacity == 0 ? 20 : props.tempSettings.Opacity} onChange={(e) => {
						e.stopPropagation();
						if (e.target.value != '') {
							if (!/^\d{1,3}$/.test(e.target.value)) {
								e.preventDefault();
								return;
							}
						}
						props.setTempSettings({
							...props.tempSettings,
							Opacity: Number(e.target.value)
						});
					}} />{' '}
					% (20-100%)
					</td>
			</tr>
			<tr>
				<th rowSpan={2} />
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
		</table>
	</div>);
};
