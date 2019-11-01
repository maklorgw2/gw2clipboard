import React, { Fragment } from 'react';
import { CategoryGroup } from '@components/CategoryGroup';
import { useStore } from '@libs/StateContext';
import { SelectionMethod } from '@models/ISelectedCategory';
import { HostManager } from '@libs/HostManager';
import { ICategory } from '@models/IConfig';
import { TagType, CreateTag, IProfessionTag, IGameModeTag } from '@models/ITag';

const RenderTagImages = (category: ICategory) => {
	const commanderImage =
		category.tags.filter((t) => t.tagType == TagType.Commander).length > 0 ? (
			<img className="category-icon" src={`resources/commander.png`} />
		) : (
			undefined
		);
	const gameModeImages = category.tags
		.filter((t) => t.tagType == TagType.GameMode)
		.map((t) => (
			<img
				className="category-icon"
				src={`resources/gamemode${CreateTag<IGameModeTag>(t as any).gameMode}.png`}
			/>
		));
	const professionImages = category.tags
		.filter((t) => t.tagType == TagType.Profession)
		.map((t) => (
			<img
				className="category-icon"
				src={`resources/prof${CreateTag<IProfessionTag>(t as any).profession}.png`}
			/>
		));
	return {
		commanderImage,
		gameModeImages,
		professionImages
	};
};

export const Category = () => {
	const { refresh, state, updateState } = useStore();
	const showCategoryIcons = HostManager.getConfig().settings.ShowCategoryIcons;
	return (
		<Fragment>
			{state.filteredCategories.map((categoryData, index) => {
				const isSelectedCategory = state.selectedCategory.index == index;
				const images = showCategoryIcons ? RenderTagImages(categoryData) : {} as any;
				let imageOutput = null;
				if (images.commander || images.gameModeImages || images.professionImages) {
					imageOutput = (
						<Fragment>
							{images.commanderImage}
							{images.gameModeImages}
							{images.professionImages}
							<div style={{ display: 'inline-block' }}>{categoryData.name}</div>
						</Fragment>
					);
				}

				return (
					<div
						onClick={() => {
							updateState({
								selectedCategory: {
									index: index,
									groupIndex: null,
									childIndex: null,
									data: categoryData,
									method: SelectionMethod.Clicked
								}
							});
						}}
						className={`category-item${state.selectedCategory.index == index ? ' selected-group' : ''}`}
					>
						<div>
							{imageOutput}
							{!imageOutput && <span>{categoryData.name}</span>}
							<div
								style={{ float: 'right' }}
								onClick={(e) => {
									const clone = { ...categoryData };
									if (clone.closed) delete clone['closed'];
									else clone.closed = true;

									// Update the category and trigger and refresh
									HostManager.updateCategory(clone, false);
									refresh();
								}}
							>
								<span
									style={{
										fontWeight: 'bold',
										fontSize: '13px',
										padding: '2px'
									}}
								>
									{!categoryData.closed ? '-' : '+'}
								</span>
							</div>
						</div>
						{!categoryData.closed && <CategoryGroup category={categoryData} categoryIndex={index} />}
					</div>
				);
			})}
		</Fragment>
	);
};
