import React, { Fragment, useState } from 'react';
import { ICategory, CategoryType } from '@models/IConfig';
import { createGuid } from '@libs/StateContext';
import { EditTags } from '@components/EditTags';
import { EditTextGroup } from '@components/EditTextGroup';
import { EditBuildGroup } from '@components/EditBuildGroup';
import { HostManager } from '@libs/HostManager';

export const EditCategory = (props: {
	categoryType: number;
	category?: ICategory;
	onComplete: (saved: boolean) => void;
}) => {
	const [ tempCategory, setTempCategory ] = useState<ICategory>(() => {
		return props.category
			? JSON.parse(JSON.stringify(props.category)) // deep clone
			: {
					id: createGuid(),
					categoryType: props.categoryType,
					name: '',
					groups: [],
					tags: []
				};
	});
	const isAddMode = props.category || null == null;
	const isBuild = props.categoryType == CategoryType.Build;

	const validate = () => {
		if ((tempCategory.name || '').length == 0) {
			alert(`Please enter the category name - the category describes what ${isBuild ? 'builds' : 'groups'} the filters are for.\n\nFor example:Necro Raids `);
			return false;
		}

		if (tempCategory.groups.length == 0) {
			alert(`No ${isBuild ? 'builds' : 'groups'} have been added`);
			return false;
		}
		if (isBuild) {
			if (tempCategory.groups.filter((g) => (g.name || '') == '').length > 0) {
				alert('Please assign each build a name');
				return false;
			}
			if (tempCategory.groups.filter((g) => (g.text[0] || '') == '').length > 0) {
				alert("Please assign each build it's build-text");
				return false;
			}
		} else {
			if (tempCategory.groups.filter((g) => (g.text[0] || '') == '').length > 0) {
				alert('Please assign text to each group item (or remove it)');
				return false;
			}
		}
		return true;
	};

	return (
		<Fragment>
			<div className="layout-header">
				<button
					className="success-button"
					onClick={() => {
						if (!validate()) return;

						if (!isAddMode) {
							HostManager.addCategory(tempCategory);
						} else {
							HostManager.updateCategory(tempCategory);
						}
						props.onComplete(true);
					}}
				>
					Save
				</button>
				<button onClick={() => props.onComplete(false)}>Cancel</button>
				{isAddMode && (
					<button
						className="danger-button"
						style={{ float: 'right' }}
						onClick={() => {
							HostManager.deleteCategory(tempCategory);
							props.onComplete(true);
						}}
					>
						Delete
					</button>
				)}
			</div>
			<div className="layout-detail">
				<fieldset>
					<legend>General</legend>
					<div style={{ display: 'flex', padding: '5px' }} className="category-group">
						<div style={{ display: 'inline-block', width: '105px', verticalAlign: 'middle', paddingTop:'5px' }}>
							Category Name:
						</div>
						<input
							type="text"
							value={tempCategory.name}
							style={{ flexGrow: 1 }}
							onChange={(event) => {
								setTempCategory({
									...tempCategory,
									name: event.target.value
								});
							}}
						/>
					</div>
				</fieldset>
				<fieldset>
					<legend>Filter on the following tags</legend>
					<EditTags
						categoryType={props.categoryType}
						tempCategory={tempCategory}
						setTempCategory={setTempCategory}
					/>
				</fieldset>
				<fieldset>
					<legend>{isBuild ? 'Builds' : 'Groups and text'}</legend>
					{tempCategory.groups.map((group, index) => (
						<Fragment>
							{props.categoryType == CategoryType.Text && (
								<EditTextGroup
									categoryType={props.categoryType}
									groupIndex={index}
									tempCategory={tempCategory}
									setTempCategory={setTempCategory}
								/>
							)}
							{props.categoryType == CategoryType.Build && (
								<EditBuildGroup
									categoryType={props.categoryType}
									groupIndex={index}
									tempCategory={tempCategory}
									setTempCategory={setTempCategory}
								/>
							)}
						</Fragment>
					))}
					<div style={{ marginTop: '10px', marginBottom: '5px' }}>
						<button
							onClick={(event) => {
								if (isAddMode) tempCategory.groups.push({ name: '', text: [ '' ] });
								else tempCategory.groups.push({ text: [] });

								setTempCategory({ ...tempCategory });
							}}
						>
							{isBuild ? 'Add build' : 'Add group'}
						</button>
					</div>
				</fieldset>
			</div>
		</Fragment>
	);
};
