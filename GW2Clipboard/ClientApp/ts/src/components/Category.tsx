import React, { Fragment, useState } from 'react';
import { ICategory } from '@models/IConfig';
import { CategoryGroup } from './CategoryGroup';
import { useStore, SelectionMethod } from './StateContext';

export const Category = (props: {
	categories: ICategory[];
	selectedCategoryIndex: number | null;
	selectedGroupIndex: number | null;
	selectedChildIndex: number | null;
}) => {
	const { store } = useStore();

	return (<Fragment>
		{props.categories.map((categoryData, index) => {
			const isSelectedCategory = props.selectedCategoryIndex == index;
			return (<div onClick={()=>{
				store.updateState({
					selectedCategory: {
						index: index,
						groupIndex: null,
						childIndex: null,
						data: categoryData,
						method: SelectionMethod.Clicked
					}
				});
			}} className={`category-item${props.selectedCategoryIndex == index ? ' selected-group' : ''}`}>
				{categoryData.name}
				<CategoryGroup category={categoryData} categoryIndex={index} selectedGroupIndex={isSelectedCategory ? props.selectedGroupIndex : null} selectedChildIndex={isSelectedCategory ? props.selectedChildIndex : null} />
			</div>);
		})}
	</Fragment>);
};
