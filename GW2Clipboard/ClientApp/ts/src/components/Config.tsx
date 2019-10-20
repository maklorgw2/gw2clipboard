import React, { useEffect, Fragment, useState } from 'react';
import { HostManager } from '@libs/HostManager';
import { useStore, Area } from '@components/StateContext';
import { SettingConfig } from '@components/Config/SettingConfig';
import { MumbleConfig } from '@components/Config/MumbleConfig';
import { JSONConfig } from '@components/Config/JSONConfig';

export const Config = () => {
	const { store } = useStore();
	const [ mode, setMode ] = useState('settings');
	const [ tempSettings, setTempSettings ] = useState({ ...HostManager.getConfig().settings });

	useEffect(() => {
		store.updateState({ area: Area.Config });
	}, []);

	return (
		<Fragment>
			<div className="layout-header">
				<select onChange={(event) => setMode(event.target.value)}>
					<option selected={mode == 'settings'} value="settings">
						Settings
					</option>
					<option selected={mode == 'mumble'} value="mumble">
						Mumble data
					</option>
					<option selected={mode == 'catJson'} value="catJson">
						Category JSON
					</option>
				</select>
				{mode == 'settings' && (
					<button style={{ float: 'right' }} onClick={() => HostManager.saveSettings(tempSettings)}>
						Save
					</button>
				)}
			</div>
			<div className="layout-detail">
				{mode == 'mumble' && <MumbleConfig />}
				{mode == 'catJson' && <JSONConfig />}
				{mode == 'settings' && <SettingConfig tempSettings={tempSettings} setTempSettings={setTempSettings} />}
			</div>
		</Fragment>
	);
};
