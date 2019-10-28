import { ICategory } from '@models/IConfig';

export enum SelectionMethod {
	Clicked,
	Key
}

export interface ISelectedCategory {
	data: ICategory;
	index: number | null;
	groupIndex: number | null;
	childIndex: number | null;
	method: SelectionMethod;
}
