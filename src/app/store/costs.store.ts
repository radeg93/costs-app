import { Injectable } from '@angular/core';
import { StateService } from '@services/state.service';
import { ExchangeRate, PaymentCurrency } from '@models/exchange-rate.interface';
import { Cost } from '@models/costs.interface';

interface CostState {
	baseCurrency: string;
	daCurrency: string;
	allCurrencies: Array<PaymentCurrency>;
	costs: Array<Cost>;
	baseExchangeRate: number;
	daExchangeRate: number;
	exchangeRates: ExchangeRate;
	baseToDaExchangeRate: number;
}

const initialState: CostState = {
	baseCurrency: '',
	daCurrency: '',
	allCurrencies: [],
	costs: [],
	baseExchangeRate: 1,
	daExchangeRate: 1,
	exchangeRates: <ExchangeRate>{},
	baseToDaExchangeRate: 1,
};

@Injectable({
	providedIn: 'root',
})
export class CostsStore extends StateService<CostState> {
	constructor() {
		super(initialState);
	}
}
