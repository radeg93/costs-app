import { Injectable } from '@angular/core';
import { CostsStore } from '@store/costs.store';
import { Observable } from 'rxjs';
import { ExchangeRate, PaymentCurrency } from '@models/exchange-rate.interface';
import { Cost } from '@models/costs.interface';

@Injectable({
	providedIn: 'root',
})
export class CostsQuery {
	constructor(private costsStore: CostsStore) {}

	// Observables
	baseCurrency$: Observable<string> = this.costsStore.select((state) => state.baseCurrency);
	daCurrency$: Observable<string> = this.costsStore.select((state) => state.daCurrency);
	allCurrencies$: Observable<Array<PaymentCurrency>> = this.costsStore.select((state) => state.allCurrencies);
	costs$: Observable<Array<Cost>> = this.costsStore.select((state) => state.costs);
	baseExchangeRate$: Observable<number> = this.costsStore.select((state) => state.baseExchangeRate);
	daExchangeRate$: Observable<number> = this.costsStore.select((state) => state.daExchangeRate);
	exchangeRates$: Observable<ExchangeRate> = this.costsStore.select((state) => state.exchangeRates);
	baseToDaExchangeRates$: Observable<number> = this.costsStore.select((state) => state.baseToDaExchangeRate);

	// State snapshot
	getBaseCurrency = (): string => this.costsStore.getState().baseCurrency;
	getDaCurrency = (): string => this.costsStore.getState().daCurrency;
	getAllCurrencies = (): Array<PaymentCurrency> => this.costsStore.getState().allCurrencies;
	getAllCosts = (): Array<Cost> => this.costsStore.getState().costs;
	getBaseExchangeRate = (): number => this.costsStore.getState().baseExchangeRate;
	getDaExchangeRate = (): number => this.costsStore.getState().daExchangeRate;
	getExchangeRates = (): ExchangeRate => this.costsStore.getState().exchangeRates;
	getBaseToDaExchangeRates = (): number => this.costsStore.getState().baseToDaExchangeRate;
}
