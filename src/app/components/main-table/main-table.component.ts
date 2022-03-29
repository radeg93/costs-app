import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CostItem, CostSubItem } from '@models/costs.interface';
import { CostsQuery } from '@store/costs.query';
import { Observable } from 'rxjs';
import { ExchangeRate } from '@models/exchange-rate.interface';
import { CommentActionType, CostType } from '@enums/costs.enum';
import { CostsService } from '@store/costs.service';

@Component({
	selector: 'app-main-table',
	templateUrl: './main-table.component.html',
	styleUrls: ['./main-table.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainTableComponent implements OnInit {
	@Input() costName: string;
	@Input() costItems: Array<CostItem>;

	baseCurrency$: Observable<string>;
	daCurrency$: Observable<string>;
	baseExchangeRate$: Observable<number>;
	daExchangeRate$: Observable<number>;
	exchangeRates: ExchangeRate;
	CostType = CostType;
	CommentActionType = CommentActionType;

	constructor(private costsQuery: CostsQuery, private costsService: CostsService) {}

	ngOnInit(): void {
		this.baseCurrency$ = this.costsQuery.baseCurrency$;
		this.daCurrency$ = this.costsQuery.daCurrency$;
		this.baseExchangeRate$ = this.costsQuery.baseExchangeRate$;
		this.daExchangeRate$ = this.costsQuery.daExchangeRate$;
		this.exchangeRates = this.costsQuery.getExchangeRates();
	}

	toggleComments = (item: CostItem) => (item.hideComments = !item.hideComments);

	onAddComment = (event: any) => this.costsService.addComment(event.costItemId, event.comment);
}
