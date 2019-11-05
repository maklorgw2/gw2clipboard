import React, { Fragment, useState, useEffect } from 'react';
import {
	IExtendedTag,
	TagTypeName,
	TagType,
	GameModeName,
	IGameModeTag,
	ProfessionName,
	IProfessionTag,
	IMapTag
} from '@models/ITag';
import { useApi } from '@libs/useApi';
import { ICategory, CategoryType, IImportCategory, CategoryTypeName } from '@models/IConfig';
import { HostManager } from '@libs/HostManager';

const parseImport = (rawObject: object) => {
	const rawCategories = rawObject as ICategory[];

	// Only import data we know about
	const processedCategories = rawCategories
		.map((cat) => ({
			id: typeof cat.id == 'string' ? cat.id : undefined,
			categoryType: typeof cat.categoryType == 'number' ? cat.categoryType : undefined,
			name: typeof cat.name == 'string' ? cat.name : undefined,
			closed: typeof cat.closed == 'boolean' ? cat.closed : undefined,
			sortOrder: typeof cat.sortOrder == 'number' ? cat.sortOrder : undefined,
			tags: ((cat.tags || []) as IExtendedTag[]).map((tag) => ({
				tagType: typeof tag.tagType == 'number' ? tag.tagType : undefined,
				sortOrder: typeof tag.sortOrder == 'number' ? tag.sortOrder : undefined,
				mapId: typeof tag.mapId == 'number' ? tag.mapId : undefined,
				characterName: typeof tag.characterName == 'string' ? tag.characterName : undefined,
				profession: typeof tag.profession == 'number' ? tag.profession : undefined,
				gameMode: typeof tag.gameMode == 'number' ? tag.gameMode : undefined
			})),
			groups: (cat.groups || []).map((group) => ({
				name: typeof group.name == 'string' ? group.name : undefined,
				sortOrder: typeof group.sortOrder == 'number' ? group.sortOrder : undefined,
				text: group.text.map((t) => (typeof t == 'string' ? t : undefined)).filter((t) => t)
			}))
		}))
		.filter((cat) => {
			let isValid = true;
			if (cat.categoryType != CategoryType.Build && cat.categoryType != CategoryType.Text) isValid = false;

			if ((cat.name || '').length == 0) isValid = false;
			if (cat.tags.filter((t) => !TagTypeName[t.tagType]).length > 0) isValid = false;

			return isValid;
		});

	processedCategories.sort((a, b) => {
		if (a.categoryType + a.name < b.categoryType + b.name) return -1;
		if (a.categoryType + a.name > b.categoryType + b.name) return 1;
		return 0;
	});

	return processedCategories;
};

export const useImporter = () => {
	const api = useApi();
	const [ tempCategories, setTempCategories ] = useState<ICategory[]>(undefined);

	useEffect(
		() => {
			if (api.called && !api.busy) {
				const errors = [];

				if (api.responseJSON && api.status == 200) {
					if (api.responseJSON.length > 0) {
						setTempCategories(parseImport(api.responseJSON));
					} else errors.push('Import format requires an array of JSON categories');
				} else {
					if (api.status == 200) errors.push('The link return an invalid format it expected JSON');
					else errors.push(`The was an error retrieving the data (Error code:${api.status})`);
				}

				if (errors.length > 0) {
					alert('The import failed.\n\n' + errors.join('\n'));
					setTempCategories([]);
				}
			}
		},
		[ api.called, api.busy ]
	);

	return {
		import: (url: string) => {
			setTempCategories(undefined);
			api.get(url);
		},
		data: api.called && !api.busy ? tempCategories : null,
		busy: api.busy
	};
};

export const ImportConfig = (props: { selectElement: JSX.Element }) => {
	const importer = useImporter();
	const [ url, setUrl ] = useState('https://pastebin.com/raw/zNnTNckK');
	const [ importCategories, setImportCategories ] = useState<IImportCategory[]>([]);

	useEffect(
		() => {
			if (importer.data) {
				const existingCategories = HostManager.getConfig().categoryData;
				setImportCategories(
					importer.data.map((cat) => ({
						category: cat,
						existing: existingCategories.filter((ex) => ex.id == cat.id).length > 0,
						selected: false
					}))
				);
			}
		},
		[ importer.data ]
	);

	const selectedCategories = importCategories.filter((imp) => imp.selected);
	return (
		<Fragment>
			<div className="layout-header">
				{props.selectElement}
				<button
					style={{ float: 'right' }}
					disabled={selectedCategories.length == 0 || importer.busy}
					onClick={() => {
						if (
							confirm(
								'You are about to import these categories, this will overwrite any existing categories that have the same ID'
							)
						) {
							for (var i = 0; i < selectedCategories.length; i++) {
								if (selectedCategories[i].existing)
									HostManager.updateCategory(selectedCategories[i].category, false);
								else HostManager.addCategory(selectedCategories[i].category, false);
							}
							HostManager.saveCategories();
							setImportCategories([]);
							setUrl('');
						}
					}}
				>
					Import
				</button>
			</div>
			<div className="layout-subheader">
				<div style={{ display: 'flex' }}>
					<span style={{ width: '40px', paddingTop: '5px' }}>URL</span>
					<input
						type="text"
						maxLength={250}
						value={url}
						onChange={(e) => {
							setUrl(e.target.value);
							e.preventDefault();
						}}
						style={{ flexGrow: 1 }}
					/>
					<button
						style={{ marginLeft: '5px' }}
						onClick={(event) => {
							importer.import(url);
						}}
						disabled={url.length == 0 || importer.busy}
					>
						Load
					</button>
				</div>
				<div style={{ paddingTop: '5px', marginLeft: '40px' }}>
					<button
						onClick={(event) => {
							setImportCategories((prevState) => {
								for (var i = 0; i < prevState.length; i++) prevState[i].selected = true;
								return [ ...prevState ];
							});
						}}
						disabled={importCategories.length == 0 || importer.busy}
					>
						Select all
					</button>
					<button
						style={{ marginLeft: '5px' }}
						onClick={(event) => {
							setImportCategories((prevState) => {
								for (var i = 0; i < prevState.length; i++) prevState[i].selected = false;
								return [ ...prevState ];
							});
						}}
						disabled={importCategories.length == 0 || importer.busy}
					>
						Deselect all
					</button>
					<button
						style={{ float: 'right' }}
						onClick={() => {
							const importData = HostManager.importCategories();
							if (importData) {
								const parsed = parseImport(importData);
								setImportCategories(
									parsed.map((cat) => ({
										category: cat,
										existing: parsed.filter((ex) => ex.id == cat.id).length > 0,
										selected: false
									}))
								);
							}
						}}
					>
						Load from file
					</button>
				</div>
			</div>
			<div className="layout-detail">
				{importCategories.map((importCategory, index) => (
					<div className="category-item import-category-container">
						<div>
							<label>
								<input
									type="checkbox"
									checked={importCategory.selected}
									style={{ verticalAlign: 'middle' }}
									onChange={(e) => {
										const isChecked = e.target.checked;
										setImportCategories((prevState) => {
											prevState[index].selected = isChecked;
											return [ ...prevState ];
										});
									}}
								/>
								[<span style={{ color: '#fff8d0' }}>
									{CategoryTypeName[importCategory.category.categoryType]}
								</span>] {importCategory.category.name}{' '}
								{importCategory.existing && <span style={{ color: 'yellow' }}>(Duplicate ID)</span>}
							</label>
						</div>
						<div>
							<span style={{ marginLeft: '25px', color: '#aaa' }}>Tags:</span>{' '}
							{importCategory.category.tags.length == 0 && <span>None</span>}
							{importCategory.category.tags.length > 0 &&
								importCategory.category.tags
									.map((tag) => {
										switch (tag.tagType) {
											case TagType.Map:
												const map = HostManager.getMaps(false).filter(
													(m) => m.id == (tag as IMapTag).mapId
												)[0] || { m: 'Unknown map' };
												return `${map.m}`;
											case TagType.Profession:
												return `${ProfessionName[(tag as IProfessionTag).profession]}`;
											case TagType.GameMode:
												return `${GameModeName[(tag as IGameModeTag).gameMode]}`;
											case TagType.Commander:
												return 'Commander';
										}
										return '';
									})
									.join(', ')}
						</div>
						<div>
							{importCategory.category.categoryType == CategoryType.Build && (
								<ul>{importCategory.category.groups.map((group) => <li>{group.name}</li>)}</ul>
							)}
							{importCategory.category.categoryType == CategoryType.Text &&
								importCategory.category.groups.map((group) => (
									<ul>{group.text.map((text) => <li>{text}</li>)}</ul>
								))}
						</div>
					</div>
				))}
			</div>
		</Fragment>
	);
};
