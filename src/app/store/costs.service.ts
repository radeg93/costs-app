import { Injectable } from '@angular/core';
import { CostsStore } from '@store/costs.store';
import { CostsQuery } from '@store/costs.query';
import { PaymentCurrency } from '@models/exchange-rate.interface';
import { Comment, Cost } from '@models/costs.interface';
import { CostType } from '@enums/costs.enum';

@Injectable({
	providedIn: 'root',
})
export class CostsService {
	constructor(private costsStore: CostsStore, private costsQuery: CostsQuery) {}

	updateBaseCurrency = (baseCurrency: string) => this.costsStore.setState({ baseCurrency });

	updateDaCurrency = (daCurrency: string) => this.costsStore.setState({ daCurrency });

	updateAllCurrencies = (allCurrencies: Array<PaymentCurrency>) => this.costsStore.setState({ allCurrencies });

	updateCosts = (costs: Array<Cost>) => this.costsStore.setState({ costs });

	updateBaseExchangeRate = (baseExchangeRate: number) => this.costsStore.setState({ baseExchangeRate });

	updateDaExchangeRate = (daExchangeRate: number) => this.costsStore.setState({ daExchangeRate });

	updateBaseToExchangeRates = () => {
		const allCurrencies = this.costsQuery.getAllCurrencies();
		const daCurrency = this.costsQuery.getDaCurrency();
		const baseCurrency = this.costsQuery.getBaseCurrency();
		const daExchangeRate = allCurrencies.find((currency) => currency.toCurrency === daCurrency)?.exchangeRate ?? 1;
		const baseExchangeRate = allCurrencies.find((currency) => currency.toCurrency === baseCurrency)?.exchangeRate ?? 1;
		const baseToDaExchangeRate = daExchangeRate / baseExchangeRate;
		this.costsStore.setState({ baseToDaExchangeRate });
	};

	addComment = (costItemId: number, comment: Comment) => {
		const costs = this.costsStore.getState().costs.map((cost) => {
			return {
				...cost,
				costItems: cost.costItems.map((item) =>
					item.id === costItemId ? { ...item, comments: item.comments ? [...item?.comments, comment] : [comment] } : item
				),
			};
		});
		this.costsStore.setState({ costs });
	};

	editComment = (costItemId: number, comment: Comment) => {
		const costs = this.costsStore.getState().costs.map((cost) => {
			return {
				...cost,
				costItems: cost.costItems.map((item) => {
					if (item.id === costItemId) {
						const filteredComments = item.comments?.filter((com) => com.id !== comment.id);
						return { ...item, comments: [...filteredComments, comment] };
					}
					return item;
				}),
			};
		});
		this.costsStore.setState({ costs });
	};

	removeComment = (commentId: number) => {
		const costs = this.costsStore.getState().costs.map((cost) => {
			return {
				...cost,
				costItems: cost.costItems.map((item) => ({
					...item,
					comments: item.comments?.filter((comment) => comment.id !== commentId),
				})),
			};
		});
		this.costsStore.setState({ costs });
	};
}
