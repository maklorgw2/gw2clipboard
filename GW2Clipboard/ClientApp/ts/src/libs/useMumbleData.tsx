import { useState, useRef, useEffect } from 'react';
import { useInterval } from '@libs/useInterval';
import { HostManager } from '@libs/HostManager';
import { IRenderData, UNIT_MULTIPLIER, UNIT_THRESHOLD } from '@components/CategoryTree';
import { GameModeType, GameModeName } from '@models/ITag';

export const useMumbleData = (pollingInterval: number) => {
	const [ pollUpdate, setPollUpdate ] = useState<number>();
	const currentMumbleData = useRef<IRenderData>(null);
	const lastUpdateMumbleData = useRef<IRenderData>(null);

	useEffect(() => {
		const data = JSON.parse(HostManager.getMumbleData()) as IRenderData;

		currentMumbleData.current = {
			...data,
			gw2HasFocus: data.currentWindowTitle == 'Guild Wars 2',
			mapIsActive: true,
			onlyPositionChanged: false
		};
		const maps = HostManager.loadMaps().filter((m) => m.id == currentMumbleData.current.context.mapId);
		if (maps.length == 1) {
			currentMumbleData.current.mapName = maps[0].t;
			currentMumbleData.current.gameMode = maps[0].m;
		} else {
			currentMumbleData.current.mapName = `Unknown #${currentMumbleData.current.context.mapId}`;
			currentMumbleData.current.gameMode = GameModeType.PvE; // Make all unknown maps PvE
		}
		currentMumbleData.current.gameModeName = GameModeName[currentMumbleData.current.gameMode];
		currentMumbleData.current.assumeContextIsStale = false;
	}, []);

	// Poll mumble data every <POLL_MS> ms
	useInterval(() => {
		const lastTick = currentMumbleData.current != null ? currentMumbleData.current.uiTick : 0;
		const data = JSON.parse(HostManager.getMumbleData()) as IRenderData;

		currentMumbleData.current = {
			...data,
			gw2HasFocus: data.currentWindowTitle == 'Guild Wars 2',
			mapIsActive: data.uiTick != lastTick
		};

		currentMumbleData.current.assumeContextIsStale =
			currentMumbleData.current.gw2HasFocus && !currentMumbleData.current.mapIsActive;

		let update = false;
		if (lastUpdateMumbleData.current != null) {
			// Update if gw2HasFocus changes
			if (currentMumbleData.current.gw2HasFocus != lastUpdateMumbleData.current.gw2HasFocus) update = true;

			// Update if character changed, commander tag changed or map changed
			if (currentMumbleData.current.context.mapId != lastUpdateMumbleData.current.context.mapId) update = true;
			if (currentMumbleData.current.identity.name != lastUpdateMumbleData.current.identity.name) update = true;
			if (currentMumbleData.current.identity.commander != lastUpdateMumbleData.current.identity.commander)
				update = true;

			// Update if we transition to Map loading or character select
			if (currentMumbleData.current.assumeContextIsStale != lastUpdateMumbleData.current.assumeContextIsStale)
				update = true;

			// Ensure position check is last
			const currentLocation = currentMumbleData.current.fAvatarPosition;
			const previousLocation = lastUpdateMumbleData.current.fAvatarPosition;
			const yDiffUnits = Math.abs(previousLocation[0] - currentLocation[0]) * UNIT_MULTIPLIER;
			const zDiffUnits = Math.abs(previousLocation[1] - currentLocation[1]) * UNIT_MULTIPLIER;
			const xDiffUnits = Math.abs(previousLocation[2] - currentLocation[2]) * UNIT_MULTIPLIER;

			// Update if character has moved >10 units in any dimension
			const characterHasMovedPastThreshold =
				yDiffUnits > UNIT_THRESHOLD || zDiffUnits > UNIT_THRESHOLD || xDiffUnits > UNIT_THRESHOLD;
			if (characterHasMovedPastThreshold) {
				// if nothing else has triggered an update, the only change is the character's position
				currentMumbleData.current.onlyPositionChanged = update == false;
				update = true;
			}
		} else {
			update = true;
		}

		// if data has materially changed, refresh component with the new data
		if (update) {
			// Lookup mapdata if needed
			if (
				lastUpdateMumbleData.current == null ||
				lastUpdateMumbleData.current.context.mapId != currentMumbleData.current.context.mapId
			) {
				const maps = HostManager.loadMaps().filter((m) => m.id == currentMumbleData.current.context.mapId);
				if (maps.length == 1) {
					currentMumbleData.current.mapName = maps[0].t;
					currentMumbleData.current.gameMode = maps[0].m;
				} else {
					currentMumbleData.current.mapName = `Unknown #${currentMumbleData.current.context.mapId}`;
					currentMumbleData.current.gameMode = GameModeType.PvE; // Make all unknown maps PvE
				}
				currentMumbleData.current.gameModeName = GameModeName[currentMumbleData.current.gameMode];
			} else {
				currentMumbleData.current.gameMode = lastUpdateMumbleData.current.gameMode;
				currentMumbleData.current.gameModeName = lastUpdateMumbleData.current.gameModeName;
				currentMumbleData.current.mapName = lastUpdateMumbleData.current.mapName;
			}

			lastUpdateMumbleData.current = { ...currentMumbleData.current };
			setPollUpdate(Date.now());
		}
	}, pollingInterval);

	return currentMumbleData.current;
};
