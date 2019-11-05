import React, { useEffect, Fragment, useState } from 'react';
import { useStore, Area } from '@libs/StateContext';
import { SettingConfig } from '@components/Config/SettingConfig';
import { MumbleConfig } from './Config/MumbleConfig';
import { JSONConfig } from './Config/JSONConfig';
import { ImportConfig } from './Config/ImportConfig';
import { ExportConfig } from './Config/ExportConfig';

export const useConfigSelect = () => {
	const [ mode, setMode ] = useState('settings');
	return {
		selectElement: (
			<select onChange={(event) => setMode(event.target.value)}>
				<option selected={mode == 'settings'} value="settings">
					Settings
				</option>
				<option selected={mode == 'mumble'} value="mumble">
					Mumble data
				</option>
				<option selected={mode == 'import'} value="import">
					Import categories
				</option>
				<option selected={mode == 'export'} value="export">
					Export categories
				</option>
				<option selected={mode == 'catJson'} value="catJson">
					View category JSON
				</option>

			</select>
			
		),
		mode: mode
	};
};

export const Config = () => {
	const { updateState } = useStore();
	const { selectElement, mode } = useConfigSelect();

	useEffect(() => {
		updateState({ area: Area.Config });
	}, []);

	return (
		<Fragment>
			{mode == 'mumble' && <MumbleConfig selectElement={selectElement} />}
			{mode == 'catJson' && <JSONConfig selectElement={selectElement} />}
			{mode == 'import' && <ImportConfig selectElement={selectElement} />}
			{mode == 'export' && <ExportConfig selectElement={selectElement} />}
			{mode == 'settings' && <SettingConfig selectElement={selectElement} />}
		</Fragment>
	);
};
