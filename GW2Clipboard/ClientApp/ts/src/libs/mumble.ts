import { HostManager } from '@libs/HostManager';
import { UNIT_MULTIPLIER, UNIT_THRESHOLD } from '@components/CategoryTree';
import { GameModeType, GameModeName } from '@models/ITag';
import { IMumbleDataRaw } from '@models/IMumbleData';
import { IState } from "@models/IState";

export const getMapDetails = (mapId: number) => {
	const maps = HostManager.getMaps(false).filter((m) => m.id == mapId);
	if (maps[0])
		return {
			mapName: maps[0].t,
			gameMode: maps[0].m,
			gameModeName: GameModeName[maps[0].m]
		};
	return {
		mapName: `Unknown #${mapId}`,
		gameMode: GameModeType.PvE,
		gameModeName: GameModeName[GameModeType.PvE]
	};
};

export const getDefaultMumbleData = (lastTick: number = 0) => {
	const mumbleData = JSON.parse(HostManager.getMumbleData()) as IMumbleDataRaw;
	const gw2HasFocus = mumbleData.currentWindowTitle == 'Guild Wars 2';
	const mapIsActive = mumbleData.uiTick != lastTick;

	const newData = {
		...mumbleData,
		gw2HasFocus: gw2HasFocus,
		mapIsActive: mumbleData.uiTick != lastTick,
		assumeContextIsStale: gw2HasFocus && !mapIsActive,
		onlyPositionChanged: false, // default/placeholder value
		...getMapDetails(mumbleData.context.mapId)
	};

	//console.log('getDefaultMumbleData:', newData);

	return newData;
};

export const processMumbleData = (state: IState, updateState: (partialState: Partial<IState>) => void) => {
	const newData = getDefaultMumbleData(state.mumbleData.uiTick);

	
	let update: boolean = false;

	// check to see if update is necessary
	// Update if gw2HasFocus changes
	if (newData.gw2HasFocus != state.mumbleData.gw2HasFocus) update = true;

	// Update if character changed, commander tag changed or map changed
	if (newData.context.mapId != state.mumbleData.context.mapId) update = true;
	if (newData.identity.name != state.mumbleData.identity.name) update = true;
	if (newData.identity.commander != state.mumbleData.identity.commander) update = true;

	// Update if we transition to Map loading or character select
	if (newData.assumeContextIsStale != state.mumbleData.assumeContextIsStale) update = true;

	// Ensure position check is last
	const currentLocation = newData.fAvatarPosition;
	const previousLocation = state.mumbleData.fAvatarPosition;
	const yDiffUnits = Math.abs(previousLocation[0] - currentLocation[0]) * UNIT_MULTIPLIER;
	const zDiffUnits = Math.abs(previousLocation[1] - currentLocation[1]) * UNIT_MULTIPLIER;
	const xDiffUnits = Math.abs(previousLocation[2] - currentLocation[2]) * UNIT_MULTIPLIER;

	// Update if character has moved >10 units in any dimension
	const characterHasMovedPastThreshold =
		yDiffUnits > UNIT_THRESHOLD || zDiffUnits > UNIT_THRESHOLD || xDiffUnits > UNIT_THRESHOLD;

	if (characterHasMovedPastThreshold) {
		// if nothing else has triggered an update, the only change is the character's position
		newData.onlyPositionChanged = update == false;
		update = true;
	}

	if (update) {
		console.log('processMumbleData old:', state.mumbleData);
		console.log('processMumbleData new:', newData);

		updateState({ mumbleData: newData });
	}
};
