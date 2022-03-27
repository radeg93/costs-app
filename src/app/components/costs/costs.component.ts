import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { AppService } from '@services/app.service';
import { ActivatedRoute, Data } from '@angular/router';
import { Cost, Costs } from '@models/costs.interface';
import { ExchangeRate, PaymentCurrency } from '@models/exchange-rate.interface';
import { CostsQuery } from '@store/costs.query';
import { CostsService } from '@store/costs.service';
import { MatSelectChange } from '@angular/material/select';
import { FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-costs',
	templateUrl: './costs.component.html',
	styleUrls: ['./costs.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostsComponent implements OnInit, OnInit {
	baseCurrency$: Observable<string>;
	daCurrency$: Observable<string>;
	allCurrencies$: Observable<Array<PaymentCurrency>>;
	costs$: Observable<Array<Cost>>;
	baseToDaExchangeRate$: Observable<number>;
	paymentCurrencies: Array<PaymentCurrency>;

	currencyControl: FormControl;

	private unsubscribe$: Subject<void> = new Subject<void>();

	constructor(
		private appService: AppService,
		private activatedRoute: ActivatedRoute,
		private costsQuery: CostsQuery,
		private costsService: CostsService
	) {}

	ngOnInit() {
		this.activatedRoute.data
			.pipe(
				map((data: Data) => data['costsAndExchangeRates']),
				takeUntil(this.unsubscribe$)
			)
			.subscribe((res: [costs: Costs, exchangeRates: ExchangeRate]) => this.updateStore(res[0], res[1]));

		this.allCurrencies$ = this.costsQuery.allCurrencies$;
		this.baseCurrency$ = this.costsQuery.baseCurrency$;
		this.daCurrency$ = this.costsQuery.daCurrency$;
		this.costs$ = this.costsQuery.costs$;
		this.baseToDaExchangeRate$ = this.costsQuery.baseToDaExchangeRates$;
		this.costsService.updateBaseToExchangeRates();
		this.currencyControl = new FormControl(this.costsQuery.getDaCurrency(), Validators.required);
	}

	changeCurrency(event: MatSelectChange) {
		const newExchangeRate = this.paymentCurrencies.find((currency) => currency.toCurrency === event.value)?.exchangeRate ?? 1;
		this.costsService.updateDaCurrency(event.value);
		this.costsService.updateDaExchangeRate(newExchangeRate);
		this.costsService.updateBaseToExchangeRates();
	}

	private updateStore(costs: Costs, exchangeRates: ExchangeRate) {
		const baseExchangeRate =
			exchangeRates.paymentCurrencies.find((currency) => currency.toCurrency === costs.baseCurrency.currency)?.exchangeRate ?? 1;
		const daExchangeRate =
			exchangeRates.paymentCurrencies.find((currency) => currency.toCurrency === costs.daCurrency.currency)?.exchangeRate ?? 1;
		this.costsService.updateBaseCurrency(costs.baseCurrency.currency);
		this.costsService.updateDaCurrency(costs.daCurrency.currency);
		this.costsService.updateAllCurrencies(exchangeRates.paymentCurrencies);
		this.costsService.updateCosts(costs.costs);
		this.costsService.updateBaseExchangeRate(baseExchangeRate);
		this.costsService.updateDaExchangeRate(daExchangeRate);
		this.paymentCurrencies = exchangeRates.paymentCurrencies;
	}

	ngOnDestroy() {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}
}
