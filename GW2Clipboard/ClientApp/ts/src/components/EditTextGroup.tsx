import React, { useState } from 'react';
import { ICategory } from '@models/IConfig';

export const EditTextGroup = (props: {
	categoryType: number;
	groupIndex: number;
	tempCategory: ICategory;
	setTempCategory: (newCatState: ICategory) => void;
}) => {
	const [ newText, setNewText ] = useState('');
	const group = props.tempCategory.groups[props.groupIndex];
	return (
		<div>
			<div style={{ display: 'flex' }} className="category-group">
				<div style={{ flexGrow: 1 }}>
					{group.text.length > 0 && (
						<div className="category-edit-groupitem">
							{group.text.map((text, index) => (
								<div style={{ display: 'flex' }}>
									<input
										type="text"
										value={group.text[index]}
										onChange={(event) => {
											group.text[index] = event.target.value;
											props.setTempCategory({...props.tempCategory});
										}}
										style={{ flexGrow: 1, marginBottom: '5px' }}
									/>
									<button
										className="delete-button"
										title="Delete text"
										onClick={(event) => {
											// if this is the only text, delete the group
											if (group.text.length > 1) group.text.splice(index, 1);
											else props.tempCategory.groups.splice(props.groupIndex, 1);
											props.setTempCategory({...props.tempCategory});
										}}
									>
										-
									</button>
								</div>
							))}
						</div>
					)}
					<div className="category-edit-groupitem" style={{ display: 'flex', marginLeft: '5px' }}>
						<input
							type="text"
							value={newText}
							onChange={(event) => setNewText(event.target.value)}
							style={{ flexGrow: 1 }}
						/>
						<button
							className="add-button"
							title="Add new text"
							disabled={newText.trim().length == 0}
							onClick={(event) => {
								group.text.push(newText.trim());
								props.setTempCategory({...props.tempCategory});
								setNewText('');
							}}
						>
							+
						</button>
					</div>
				</div>
				<button
					className="delete-button"
					title="Delete group"
					style={{ margin: '6px 5px 5px 5px ' }}
					onClick={(event) => {
						props.tempCategory.groups.splice(props.groupIndex, 1);
						props.setTempCategory({...props.tempCategory});
					}}
				>
					-
				</button>
			</div>
		</div>
	);
};
