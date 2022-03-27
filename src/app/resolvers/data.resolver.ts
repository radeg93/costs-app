import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Costs } from '@models/costs.interface';
import { AppService } from '@services/app.service';
import { forkJoin, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataResolver implements Resolve<Costs> {
	constructor(private appService: AppService) {}

	resolve(): Observable<any> {
		const costs$ = this.appService.getCosts();
		const exchangeRates$ = this.appService.getExchangeRates();
		return forkJoin([costs$, exchangeRates$]);
	}
}
