import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Costs } from '@models/costs.interface';
import { ExchangeRate } from '@models/exchange-rate.interface';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class AppService {
	private costsUrl = 'assets/data/costs.json';
	private exchangeRatesUrl = 'assets/data/exchange-rates.json';

	constructor(private httpClient: HttpClient) {}

	getCosts(): Observable<Costs> {
		return this.httpClient.get<Costs>(this.costsUrl);
	}

	getExchangeRates(): Observable<ExchangeRate> {
		return this.httpClient.get<ExchangeRate>(this.exchangeRatesUrl);
	}
}
