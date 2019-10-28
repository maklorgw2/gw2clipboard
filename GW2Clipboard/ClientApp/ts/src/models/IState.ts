import { CategoryType, ICategory, HostAction } from '@models/IConfig';
import { WindowState } from '@libs/HostManager';
import { IMumbleData } from '@models/IMumbleData';
import { Area } from '@libs/StateContext';
import { ISelectedCategory } from "@models/ISelectedCategory";
export interface IState {
	area: Area;
	windowState: WindowState;
	hotKeyHandler: (action: HostAction, state: IState, updateState: (partialState: Partial<IState>) => void) => void;
	categoryType: CategoryType;
	selectedCategory?: ISelectedCategory;
	filteredCategories: ICategory[];
	mumbleData: IMumbleData;
}
