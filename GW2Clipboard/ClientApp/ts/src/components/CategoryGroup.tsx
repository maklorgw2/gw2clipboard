import React from 'react';
import { ICategory } from '@models/IConfig';
import { useStore, SelectionMethod } from './StateContext';
import { HostManager } from '@libs/HostManager';

export const CategoryGroup = (props: {
	category: ICategory;
	categoryIndex: number;
	selectedGroupIndex: number | null;
	selectedChildIndex: number | null;
}) => {
	const { store } = useStore();

	return (
		<div className="category-container">
			{props.category.groups.map((group, groupIndex) => {
				const isGroupSelected = props.selectedGroupIndex == groupIndex;
				return (
					<div
						className={
							group.text.length > 1 ? `category-group${isGroupSelected ? ' selected-group' : ''}` : null
						}
					>
						{group.text.map((child, childIndex) => (
							<div
								className={`category-groupitem${isGroupSelected &&
								props.selectedChildIndex == childIndex
									? ' selected'
									: ''}`}
								onClick={(event) => {
									HostManager.setClipBoardData(group.text[0]);
									store.updateState({
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
								{child}
							</div>
						))}
					</div>
				);
			})}
		</div>
	);
};
