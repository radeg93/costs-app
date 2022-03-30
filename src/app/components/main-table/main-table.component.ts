import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CostItem } from '@models/costs.interface';
import { CostsQuery } from '@store/costs.query';
import { debounceTime, distinctUntilChanged, Observable, Subject, takeUntil } from 'rxjs';
import { ExchangeRate } from '@models/exchange-rate.interface';
import { CommentActionType, CostType } from '@enums/costs.enum';
import { CostsService } from '@store/costs.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Component({
	selector: 'app-main-table',
	templateUrl: './main-table.component.html',
	styleUrls: ['./main-table.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainTableComponent implements OnInit, OnDestroy {
	formGroup: FormGroup;

	@Input() costName: string;
	@Input() costItems: Array<CostItem>;

	baseCurrency$: Observable<string>;
	daCurrency$: Observable<string>;
	baseExchangeRate$: Observable<number>;
	daExchangeRate$: Observable<number>;
	exchangeRates: ExchangeRate;
	totalScreened: number;
	CostType = CostType;
	CommentActionType = CommentActionType;

	private unsubscribe$: Subject<void> = new Subject<void>();

	get daAmounts(): FormArray {
		return this.formGroup.get('daAmounts') as FormArray;
	}

	constructor(
		private costsQuery: CostsQuery,
		private costsService: CostsService,
		private formBuilder: FormBuilder,
		private decimalPipe: DecimalPipe,
		private changeDetectorRef: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.baseCurrency$ = this.costsQuery.baseCurrency$;
		this.daCurrency$ = this.costsQuery.daCurrency$;
		this.baseExchangeRate$ = this.costsQuery.baseExchangeRate$;
		this.daExchangeRate$ = this.costsQuery.daExchangeRate$;
		this.exchangeRates = this.costsQuery.getExchangeRates();

		this.formGroup = this.formBuilder.group({
			daAmounts: this.formBuilder.array([]),
		});
		this.setFormData();

		this.daAmounts.controls.forEach((control: AbstractControl) =>
			control.valueChanges
				.pipe(distinctUntilChanged(), debounceTime(500), takeUntil(this.unsubscribe$))
				.subscribe((changes) => this.trackDaAmountsChanges())
		);

		this.daExchangeRate$
			.pipe(takeUntil(this.unsubscribe$))
			.subscribe((exchangeRate: number) => this.trackDaExchangeRateChanges(exchangeRate));
	}

	setFormData() {
		const numericRegex = '^-?[0-9]\\d*(\\.\\d{1,2})?$';
		const daAmounts = this.formGroup.get('daAmounts') as FormArray;
		this.costItems.forEach((costItem: CostItem) => {
			const amount = costItem.costs[1].amount * this.costsQuery.getDaExchangeRate();
			daAmounts.push(
				this.formBuilder.group({
					amount: [amount, [Validators.required, Validators.pattern(numericRegex)]],
				})
			);
		});
	}

	trackDaAmountsChanges() {
		if (this.formGroup.valid) {
			this.totalScreened = this.daAmounts.value
				.map((item: any) => JSON.parse(item.amount))
				.reduce((prev: number, curr: number) => prev + curr, 0);
			this.changeDetectorRef.detectChanges();
		}
	}

	trackDaExchangeRateChanges(exchangeRate: number) {
		this.costItems.forEach((costItem: CostItem, index) => {
			const amount = costItem.costs[1].amount * exchangeRate;
			this.daAmounts.controls[index].patchValue({ amount: parseFloat(amount.toString()).toFixed(2) });
		});
		this.calculateTotalScreened(exchangeRate);
	}

	calculateTotalScreened = (exchangeRate?: number) => {
		const daExchangeRate = exchangeRate ?? this.costsQuery.getDaExchangeRate();
		const totalScreened = this.costItems
			.map((item) =>
				item.costs
					.filter((cost) => cost.type === CostType.Screened)
					.map((cost) => cost.amount)
					.reduce((prev, curr) => prev + curr, 0)
			)
			.reduce((prev, curr) => prev + curr, 0);

		this.totalScreened = totalScreened * daExchangeRate;
		this.changeDetectorRef.detectChanges();
	};

	toggleComments = (item: CostItem) => (item.hideComments = !item.hideComments);

	onAddComment = (event: any) => this.costsService.addComment(event.costItemId, event.comment);

	ngOnDestroy() {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}
}
