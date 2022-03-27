export interface Costs {
	daCurrency: Currency;
	baseCurrency: BaseCurrency;
	costs: Array<Cost>;
}

export interface Currency {
	currency: string;
}

export interface BaseCurrency extends Currency {
	exchangeRate: number;
}

export interface Cost {
	id: number;
	name: string;
	displayOrder: number;
	costItems: Array<CostItem>;
}

export interface CostItem {
	id: number;
	name: string;
	costItemAlias: {
		accountingCode: string;
	};
	annotation: {
		id: number;
		name: string;
	};
	costs: Array<CostSubItem>;
	comments: Array<Comment>;
	hideComments?: boolean;
}

export interface CostSubItem {
	daStage: string;
	persona: string;
	type: string;
	amount: number;
}

export interface Comment {
	id: number;
	daStage: string;
	persona: string;
	author: string;
	comment: string;
	type: string;
	date: string;
}
