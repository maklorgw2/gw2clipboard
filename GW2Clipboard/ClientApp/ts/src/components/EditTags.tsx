import React from 'react';
import { ICategory } from '@models/IConfig';
import {
	TagType,
	GameModeName,
	ProfessionName,
	IGameModeTag,
	IProfessionTag,
	ICommanderTag,
	IMapTag,
	ITag
} from '@models/ITag';
import { HostManager } from '@libs/HostManager';
import { useStore } from '@libs/StateContext';

// get the first of the tag type (there *should* only be one)
export const getTag = <T extends ITag>(category: ICategory, tagType: TagType) =>
	category.tags.filter((t) => t.tagType == tagType)[0] as T;

export const createEnumPairs = (data: string[]) =>
	data
		.map((name, index) => {
			return { name, index };
		})
		.sort((a, b) => ('' + a.name).localeCompare(b.name));

// This is pretty convoluted but ultimately I think a tag array will be more flexible than a fixed shape
export const EditTags = (props: {
	categoryType: number;
	tempCategory: ICategory;
	setTempCategory: (tempCategory: ICategory) => void;
}) => {
	const { state } = useStore();
	const gameModes = createEnumPairs(GameModeName);
	const professions = createEnumPairs(ProfessionName);

	const gameModeTag = getTag<IGameModeTag>(props.tempCategory, TagType.GameMode);
	const professionTag = getTag<IProfessionTag>(props.tempCategory, TagType.Profession);
	const commanderTag = getTag<ICommanderTag>(props.tempCategory, TagType.Commander);
	const mapTag = getTag<IMapTag>(props.tempCategory, TagType.Map);

	const onTagChecked = (tag: ITag, checked: boolean) => {
		if (!checked) props.tempCategory.tags = props.tempCategory.tags.filter((t) => t.tagType != tag.tagType);
		else props.tempCategory.tags.push(tag);
		props.setTempCategory({ ...props.tempCategory });
	};

	//console.log(professionTag, mapTag, commanderTag, gameModeTag);
	return (
		<div className="category-group">
			<div className="tag-container">
				<label>
					<input
						type="checkbox"
						value={TagType.GameMode}
						checked={gameModeTag != null}
						onChange={(event) =>
							onTagChecked(
								{ tagType: TagType.GameMode, gameMode: state.mumbleData.gameMode } as IGameModeTag,
								event.target.checked
							)}
					/>{' '}
					Game-mode
				</label>
				{gameModeTag != null && (
					<div className="tagoption-container">
						<select
							onChange={(event) => {
								gameModeTag.gameMode = Number(event.target.value);
								props.setTempCategory({ ...props.tempCategory });
							}}
						>
							<option>-- select --</option>
							{gameModes.map((o) => (
								<option value={o.index} selected={o.index == gameModeTag.gameMode}>
									{o.name}
								</option>
							))}
						</select>
					</div>
				)}
			</div>
			<div className="tag-container">
				<label>
					<input
						type="checkbox"
						value={TagType.Profession}
						checked={professionTag != null}
						onChange={(event) =>
							onTagChecked(
								{ tagType: TagType.Profession, profession: state.mumbleData.identity.profession } as IProfessionTag,
								event.target.checked
							)}
					/>{' '}
					Profession
				</label>
				{professionTag != null && (
					<div className="tagoption-container">
						<select
							onChange={(event) => {
								professionTag.profession = Number(event.target.value);
								props.setTempCategory({ ...props.tempCategory });
							}}
						>
							<option>-- select --</option>
							{professions.map((o) => (
								<option value={o.index} selected={o.index == professionTag.profession}>
									{o.name}
								</option>
							))}
						</select>
					</div>
				)}
			</div>
			<div className="tag-container">
				<label>
					<input
						type="checkbox"
						value={TagType.Map}
						checked={mapTag != null}
						onChange={(event) =>
							onTagChecked(
								{ tagType: TagType.Map, mapId: state.mumbleData.context.mapId } as IMapTag,
								event.target.checked
							)}
					/>{' '}
					Map
				</label>
				{mapTag != null && (
					<div className="tagoption-container">
						<select
							onChange={(event) => {
								mapTag.mapId = Number(event.target.value);
								props.setTempCategory({ ...props.tempCategory });
							}}
						>
							<option>-- select --</option>
							{HostManager.getMaps(true).map((m) => (
								<option value={m.id} selected={m.id == mapTag.mapId}>
									{m.t}
								</option>
							))}
						</select>
					</div>
				)}
			</div>
			<div className="tag-container">
				<label>
					<input
						type="checkbox"
						value={TagType.Map}
						checked={commanderTag != null}
						onChange={(event) => onTagChecked({ tagType: TagType.Commander }, event.target.checked)}
					/>{' '}
					Commander
				</label>
			</div>
		</div>
	);
};
