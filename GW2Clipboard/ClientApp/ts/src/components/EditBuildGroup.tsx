import React from 'react';
import { ICategory } from '@models/IConfig';
export const EditBuildGroup = (props: {
	categoryType: number;
	groupIndex: number;
	tempCategory: ICategory;
	setTempCategory: (newCatState: ICategory) => void;
}) => {
	const group = props.tempCategory.groups[props.groupIndex];
	return (
		<div>
			{group.text.length > 0 && (
				<div className="category-edit-groupitem" style={{ margin: '5px 0 5px 0' }}>
					<div style={{ display: 'flex' }}>
						<input
							type="text"
							value={group.name}
							onChange={(event) => {
								group.name = event.target.value;
								props.setTempCategory({ ...props.tempCategory });
							}}
							style={{ flexGrow: 1, marginBottom: '5px' }}
						/>
						<input
							type="text"
							value={group.text[0]}
							onChange={(event) => {
								group.text[0] = event.target.value;
								props.setTempCategory({ ...props.tempCategory });
							}}
							style={{ flexGrow: 1, marginBottom: '5px' }}
						/>
						<button
							className="delete-button"
							title="Delete text"
							onClick={(event) => {
								props.tempCategory.groups.splice(props.groupIndex, 1);
								props.setTempCategory({ ...props.tempCategory });
							}}
						>
							-
						</button>
					</div>
				</div>
			)}
		</div>
	);
};
