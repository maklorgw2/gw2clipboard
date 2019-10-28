import React, { Fragment } from 'react';
import { CategoryGroup } from '@components/CategoryGroup';
import { useStore } from '@libs/StateContext';
import { SelectionMethod } from '@models/ISelectedCategory';
import { HostManager } from '@libs/HostManager';

export const Category = () => {
	const { refresh, state, updateState } = useStore();

	return (
		<Fragment>
			{state.filteredCategories.map((categoryData, index) => {
				const isSelectedCategory = state.selectedCategory.index == index;
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
						{categoryData.name}
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
									padding: '2px',
								}}
							>
								{!categoryData.closed ? '-' : '+'}
							</span>
						</div>
						{/* {!categoryData.closed && <CategoryGroup category={categoryData} categoryIndex={index} selectedGroupIndex={isSelectedCategory ? state.selectedCategory.groupIndex : null} selectedChildIndex={isSelectedCategory ? state.selectedCategory.childIndex : null} />} */}
						{!categoryData.closed && <CategoryGroup category={categoryData} categoryIndex={index} />}
					</div>
				);
			})}
		</Fragment>
	);
};
