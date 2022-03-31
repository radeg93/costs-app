import { CostItem } from '@models/costs.interface';

export interface CostItemPresentational extends CostItem {
	hideComments?: boolean;
}
