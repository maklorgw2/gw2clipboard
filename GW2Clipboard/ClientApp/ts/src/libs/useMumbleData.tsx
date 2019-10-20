import { useState, useRef, useEffect } from 'react';
import { useInterval } from '@libs/useInterval';
import { HostManager } from '@libs/HostManager';
import { IRenderData, UNIT_MULTIPLIER, UNIT_THRESHOLD } from '@components/CategoryTree';
import { GameModeType, GameModeName } from '@models/ITag';


const getMapDetails = (mapId:number) => {
	const maps = HostManager.getMaps(false).filter((m) => m.id == mapId);
	if (maps[0]) return {
		mapName: maps[0].t,
		gameMode: maps[0].m,
		gameModeName:  GameModeName[maps[0].m]
	}
	return {
		mapName: `Unknown #${mapId}`,
		gameMode: GameModeType.PvE,
		gameModeName:  GameModeName[GameModeType.PvE]
	}
}

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
			onlyPositionChanged: false,
			assumeContextIsStale: false,
			...getMapDetails(data.context.mapId)
		};
	}, []);

	// Poll mumble data every <POLL_MS> ms
	useInterval(() => {
		const lastTick = currentMumbleData.current != null ? currentMumbleData.current.uiTick : 0;
		const data = JSON.parse(HostManager.getMumbleData()) as IRenderData;

		currentMumbleData.current = {
			...data,
			gw2HasFocus: data.currentWindowTitle == 'Guild Wars 2',
			mapIsActive: data.uiTick != lastTick,
			...getMapDetails(data.context.mapId)
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
			lastUpdateMumbleData.current = { ...currentMumbleData.current };
			setPollUpdate(Date.now());
		}
	}, pollingInterval);

	return currentMumbleData.current;
};
