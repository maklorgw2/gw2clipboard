import React from 'react';
import { ICategory, CategoryType } from '@models/IConfig';
import { useStore } from '@libs/StateContext';
import { HostManager } from '@libs/HostManager';
import { SelectionMethod } from '@models/ISelectedCategory';

export const CategoryGroup = (props: {
	category: ICategory;
	categoryIndex: number;
}) => {
	const { state, updateState } = useStore();
	const isBuild = props.category.categoryType == CategoryType.Build;
	return (
		<div className="category-container">
			{props.category.groups.map((group, groupIndex) => {
				const isGroupSelected = state.selectedCategory.index == props.categoryIndex && state.selectedCategory.groupIndex == groupIndex;
				return (
					<div
						className={
							group.text.length > 1 ? `category-group${isGroupSelected ? ' selected-group' : ''}` : null
						}
					>
						{group.text.map((child, childIndex) => (
							<div
								className={`category-groupitem${isGroupSelected &&
									state.selectedCategory.childIndex == childIndex
									? ' selected'
									: ''}`}
								onClick={(event) => {
									HostManager.setClipBoardData(group.text[0]);
									updateState({
										selectedCategory: {
											index: props.categoryIndex,
											groupIndex: groupIndex,
											childIndex: childIndex,
											data: props.category,
											method: SelectionMethod.Clicked
										}
									});
									event.stopPropagation();
								}}
							>
								{isBuild ? <span title={child}>{group.name}</span> : child}
							</div>
						))}
					</div>
				);
			})}
		</div>
	);
};
