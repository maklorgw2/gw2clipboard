import React, { Fragment, useState, useEffect } from 'react';
import { TagType, GameModeName, IGameModeTag, ProfessionName, IProfessionTag, IMapTag } from '@models/ITag';
import { CategoryType, CategoryTypeName, IExportCategory } from '@models/IConfig';
import { HostManager } from '@libs/HostManager';

export const ExportConfig = (props: { selectElement: JSX.Element }) => {
	const [ importCategories, setImportCategories ] = useState<IExportCategory[]>([]);

	useEffect(
		() => {
			const existingCategories = [ ...HostManager.getConfig().categoryData ];
			existingCategories.sort((a, b) => {
				if (a.categoryType + a.name < b.categoryType + b.name) return -1;
				if (a.categoryType + a.name > b.categoryType + b.name) return 1;
				return 0;
			});

			setImportCategories(
				existingCategories.map((cat) => ({
					category: cat,
					selected: false
				}))
			);
		},
		[ HostManager.getConfig().categoryData ]
	);

	const selectedCategories = importCategories.filter((imp) => imp.selected);
	return (
		<Fragment>
			<div className="layout-header">
				{props.selectElement}
				<button
					style={{ float: 'right' }}
					disabled={selectedCategories.length == 0}
					onClick={() => {
						const exported = HostManager.exportCategories(selectedCategories.map((sc) => sc.category));
						if (exported) alert('Export complete');
					}}
				>
					Export
				</button>
			</div>
			<div className="layout-subheader">
					<div style={{ marginLeft: '5px' }}>
						<button
							onClick={(event) => {
								setImportCategories((prevState) => {
									for (var i = 0; i < prevState.length; i++) prevState[i].selected = true;
									return [ ...prevState ];
								});
							}}
							disabled={importCategories.length == 0}
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
							disabled={importCategories.length == 0}
						>
							Deselect all
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
									style={{verticalAlign:'middle'}}
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
												)[0] || { t: 'Unknown map' };
												return `${map.t}`;
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
