import React, { ReactNode, useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { HostManager } from '@libs/HostManager';
import { useStore } from '@libs/StateContext';
import { ISelectedCategory, SelectionMethod } from "@models/ISelectedCategory";
import { IState } from "@models/IState";
import { Category } from '@components/Category';
import {
	TagType,
	ITag,
	ICharacterTag,
	IMapTag,
	IMapLocationTag,
	IProfessionTag,
	GameModeType,
	IGameModeTag
} from '@models/ITag';
import { HostAction, ICategory, CategoryType } from '@models/IConfig';
import { EditCategory } from '@components/EditCategory';
import { IMumbleData } from '@models/IMumbleData';

export const POLL_MS = 200;
export const UNIT_MULTIPLIER = 20;
export const UNIT_THRESHOLD = 100;

// express as nodes for easier navigation reasoning
const generateNodes = (selected: ISelectedCategory, categoryLength: number) => {
	const childSelected = selected.childIndex != null;
	const groupSelected = selected.groupIndex != null;
	const categorySelected = selected.index != null;

	return {
		categorySelected,
		groupSelected,
		childSelected,
		previousChild: childSelected && selected.childIndex > 0 ? selected.childIndex - 1 : null,
		nextChild:
			childSelected && selected.childIndex < selected.data.groups[selected.groupIndex].text.length - 1
				? selected.childIndex + 1
				: null,
		firstChild: groupSelected ? 0 : null,
		lastChild: groupSelected ? selected.data.groups[selected.groupIndex].text.length - 1 : null,
		previousGroup: groupSelected && selected.groupIndex > 0 ? selected.groupIndex - 1 : null,
		nextGroup:
			groupSelected && selected.groupIndex < selected.data.groups.length - 1 ? selected.groupIndex + 1 : null,
		firstGroup: categorySelected ? 0 : null,
		lastGroup: categorySelected ? selected.data.groups.length - 1 : null,
		previousCategory: categorySelected && selected.index > 0 ? selected.index - 1 : null,
		nextCategory: categorySelected && selected.index < categoryLength - 1 ? selected.index + 1 : null
	};
};

export const moveSelected = (
	hotKey: HostAction,
	state: IState,
	updateState: (partialState: Partial<IState>) => void
) => {
	const selected = { ...state.selectedCategory };
	const nodes = generateNodes(selected, state.filteredCategories.length);

	switch (hotKey) {
		case HostAction.Up:
			if (nodes.childSelected && nodes.previousChild != null) {
				selected.childIndex = nodes.previousChild;
				break;
			}
			if (nodes.groupSelected && nodes.previousGroup != null) {
				selected.groupIndex = nodes.previousGroup;
				selected.childIndex =
					selected.childIndex != null
						? state.filteredCategories[selected.index].groups[selected.groupIndex].text.length - 1
						: null;
				break;
			}
			if (nodes.categorySelected && nodes.previousCategory != null) {
				selected.index = nodes.previousCategory;

				selected.groupIndex =
					selected.groupIndex != null ? state.filteredCategories[selected.index].groups.length - 1 : null;

				selected.childIndex =
					selected.childIndex != null
						? state.filteredCategories[selected.index].groups[selected.groupIndex].text.length - 1
						: null;
				break;
			}
			break;

		case HostAction.Down:
			if (nodes.childSelected && nodes.nextChild != null) {
				selected.childIndex = nodes.nextChild;
				break;
			}
			if (nodes.groupSelected && nodes.nextGroup != null) {
				selected.groupIndex = nodes.nextGroup;
				selected.childIndex = selected.childIndex != null ? 0 : null;
				break;
			}
			if (nodes.categorySelected && nodes.nextCategory != null) {
				selected.index = nodes.nextCategory;
				selected.groupIndex = selected.groupIndex != null ? 0 : null;
				selected.childIndex = selected.childIndex != null ? 0 : null;
				break;
			}
			break;

		case HostAction.Left:
			if (nodes.childSelected) {
				selected.childIndex = null;
				if (state.filteredCategories[selected.index].groups[selected.groupIndex].text.length == 1)
					selected.groupIndex = null;
				break;
			}
			if (nodes.groupSelected) {
				selected.groupIndex = null;
				break;
			}
			break;

		case HostAction.Right:
			if (nodes.childSelected) break;
			if (nodes.groupSelected) {
				selected.childIndex = 0;
				break;
			}
			if (nodes.categorySelected) {
				selected.groupIndex = 0;
				if (state.filteredCategories[selected.index].groups[selected.groupIndex].text.length == 1)
					selected.childIndex = 0;
				break;
			}
			break;
	}
	const update =
		selected.index != state.selectedCategory.index ||
		selected.groupIndex != state.selectedCategory.groupIndex ||
		selected.childIndex != state.selectedCategory.childIndex;

	if (update) {
		const data = state.filteredCategories[selected.index];

		if (selected.groupIndex != null && selected.childIndex != null) {
			HostManager.setClipBoardData(data.groups[selected.groupIndex].text[selected.childIndex]);
		}
		updateState({
			selectedCategory: {
				index: selected.index,
				groupIndex: selected.groupIndex,
				childIndex: selected.childIndex,
				data: data,
				method: SelectionMethod.Key
			}
		});
	}
};

export const filterOnTag = (tags: ITag[], renderData: IMumbleData) => {
	return (
		tags.filter((tag) => {
			let valid = true;
			switch (tag.tagType) {
				case TagType.Character:
					valid = (tag as ICharacterTag).characterName == renderData.identity.name;
					break;
				case TagType.Commander:
					valid = renderData.identity.commander;
					break;
				case TagType.GameMode:
					valid = (tag as IGameModeTag).gameMode == renderData.gameMode;
					break;
				case TagType.Map:
					valid = (tag as IMapTag).mapId == renderData.context.mapId;
					break;
				case TagType.MapLocation:
					const locationTag = tag as IMapLocationTag;
					break;
				case TagType.Profession:
					valid = (tag as IProfessionTag).profession == renderData.identity.profession;
					break;
			}
			return !valid;
		}).length == 0
	);
};

enum ViewMode {
	View,
	Edit,
	Add
}

enum FilterMode {
	All,
	Profession,
	None
}

interface IFilterOptions {
	filterMode: FilterMode;
}

export const CategoryTree = () => {
	const { refresh, state, updateState } = useStore();
	const { categoryType } = useParams();
	const [ filterOptions, setFilterOptions ] = useState<IFilterOptions>({ filterMode: FilterMode.All });
	const [ viewMode, setViewMode ] = useState<ViewMode>(ViewMode.View);

	useEffect(
		() => {
			console.log(`Mount for category ${categoryType}`);
			document.body.focus();
			setViewMode(ViewMode.View);
			// Profession filter mode not valid for Text category
			if (filterOptions.filterMode == FilterMode.Profession && Number(categoryType) == CategoryType.Text) {
				setFilterOptions({ filterMode: FilterMode.All });
			}
			updateState({
				area: Number(categoryType),
				selectedCategory: {} as any,
				filteredCategories: [],
				hotKeyHandler: (hotKey, state, updateState) => moveSelected(hotKey, state, updateState)
			});
			return () => {
				updateState({ hotKeyHandler: null });
			};
		},
		[ categoryType ]
	);

	useEffect(
		() => {
			console.log(`Create filters for category ${categoryType}`);
			const typeCategories = HostManager.getConfig().categoryData.filter((cd) => cd.categoryType == Number(categoryType));

			let selectedCategoryIndex = null;

			// Filter
			let filteredCategories: ICategory[] = typeCategories;

			if (filterOptions.filterMode == FilterMode.All)
				filteredCategories = typeCategories.filter((category) => filterOnTag(category.tags, state.mumbleData));

			if (filterOptions.filterMode == FilterMode.Profession) {
				const currentProfession = state.mumbleData.identity.profession || 99;
				filteredCategories = typeCategories.filter((category) => {
					return (
						category.tags.filter(
							(t: IProfessionTag) => t.tagType == TagType.Profession && t.profession == currentProfession
						).length > 0
					);
				});
			}
			// Sort
			filteredCategories = filteredCategories.sort((a, b) => ('' + a.name).localeCompare(b.name));

			if (state.selectedCategory.data != null) {
				for (var i = 0; i < filteredCategories.length; i++) {
					if (filteredCategories[i].id == state.selectedCategory.data.id) {
						selectedCategoryIndex = i;
						break;
					}
				}
			}
			// console.log(`1:selectedCategoryIndex ${selectedCategoryIndex}`);
			if (selectedCategoryIndex == null) {
				if (filteredCategories.length > 0) {
					selectedCategoryIndex = 0;
					const data = filteredCategories[0];
					updateState({
						filteredCategories: filteredCategories,
						selectedCategory: {
							data: data,
							index: selectedCategoryIndex,
							groupIndex: null,
							childIndex: null,
							method: SelectionMethod.Key
						}
					});
				} else {
					updateState({
						filteredCategories: filteredCategories,
						selectedCategory: {} as any
					});
				}
			} else {
				const data = filteredCategories[selectedCategoryIndex];
				if (state.selectedCategory.groupIndex != null && state.selectedCategory.childIndex != null) {
					HostManager.setClipBoardData(
						data.groups[state.selectedCategory.groupIndex].text[state.selectedCategory.childIndex]
					,true);
				}
				updateState({
					filteredCategories: filteredCategories,
					selectedCategory: {
						data: data,
						index: selectedCategoryIndex,
						groupIndex: state.selectedCategory.groupIndex,
						childIndex: state.selectedCategory.childIndex,
						method: SelectionMethod.Key
					}
				});
			}
			// console.log(`2:selectedCategoryIndex ${selectedCategoryIndex}`);
		},
		[ categoryType, state.mumbleData.uiTick, filterOptions.filterMode ]
	);

	// Handle selection by hotkey scrolling
	useEffect(
		() => {
			if (state.selectedCategory.method == SelectionMethod.Key) {
				const selectedGroup = document.getElementsByClassName('category-groupitem selected-group')[0];
				const selectedItem = document.getElementsByClassName('category-groupitem selected')[0];
				if (selectedItem) selectedItem.scrollIntoView(false);
				else if (selectedGroup) selectedGroup.scrollIntoView(false);
			}
		},
		[ state.selectedCategory.index, state.selectedCategory.groupIndex, state.selectedCategory.childIndex ]
	);


	console.log(`Pre-render state:${state.area} prop:${categoryType}`);

	let output: ReactNode;
	if (state.area == Number(categoryType)) {
		if (!state.mumbleData.assumeContextIsStale) {
			if (state.filteredCategories.length > 0) {
				output = (
					<Category />
				);
			} else output = <div className="info">No matching items</div>;
		} else output = <div className="info">No active map</div>;
	} else output = <div />;

	return (
		<Fragment>
			{/* <div>
				{mumbleData.uiTick} {mumbleData.gameModeName} [{mumbleData.gameMode}]
			</div> */}
			{viewMode == ViewMode.View && (
				<Fragment>
					<div className="layout-header">
						<button
							className={`leftgroup ${filterOptions.filterMode == FilterMode.All ? ' selected' : ''}`}
							onClick={() => setFilterOptions({ filterMode: FilterMode.All })}
						>
							All Filters
						</button>
						{categoryType == String(CategoryType.Build) && (
							<button
								className={`middlegroup ${filterOptions.filterMode == FilterMode.Profession
									? ' selected'
									: ''}`}
								onClick={() => setFilterOptions({ filterMode: FilterMode.Profession })}
							>
								Profession
							</button>
						)}
						<button
							className={`rightgroup ${filterOptions.filterMode == FilterMode.None ? ' selected' : ''}`}
							onClick={() => setFilterOptions({ filterMode: FilterMode.None })}
						>
							No Filters
						</button>
						<div style={{ float: 'right' }}>
							{state.selectedCategory.data && (
								<button onClick={() => setViewMode(ViewMode.Edit)}>Edit</button>
							)}
							<button onClick={() => setViewMode(ViewMode.Add)}>Add</button>
						</div>
					</div>
					<div className="layout-detail">{viewMode == ViewMode.View && output}</div>
				</Fragment>
			)}
			{viewMode == ViewMode.Edit && (
				<EditCategory
					categoryType={Number(categoryType)}
					category={state.selectedCategory.data}
					onComplete={(saved) => {
						if (saved) refresh();
						setViewMode(ViewMode.View);
						document.body.focus(); // refocus body for hotkeys
					}}
				/>
			)}
			{viewMode == ViewMode.Add && (
				<EditCategory
					categoryType={Number(categoryType)}
					onComplete={(saved) => {
						if (saved) refresh();
						setViewMode(ViewMode.View);
						document.body.focus(); // refocus body for hotkeys
					}}
				/>
			)}
		</Fragment>
	);
};
