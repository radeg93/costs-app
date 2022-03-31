import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Cost, CostItem } from '@models/costs.interface';
import { CostsQuery } from '@store/costs.query';
import { debounceTime, distinctUntilChanged, Observable, pairwise, Subject, takeUntil } from 'rxjs';
import { ExchangeRate } from '@models/exchange-rate.interface';
import { CommentActionType, CostType } from '@enums/costs.enum';
import { CostsService } from '@store/costs.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { CostItemPresentational } from '@models/presentational.interface';

@Component({
	selector: 'app-main-table',
	templateUrl: './main-table.component.html',
	styleUrls: ['./main-table.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainTableComponent implements OnInit, OnDestroy {
	formGroup: FormGroup;

	@Input() set cost(value: Cost) {
		this.costName = value.name;
		this.costItems = value.costItems.map((item) => ({ ...item, hideComments: false }));
	}

	baseCurrency$: Observable<string>;
	daCurrency$: Observable<string>;
	baseExchangeRate$: Observable<number>;
	daExchangeRate$: Observable<number>;

	exchangeRates: ExchangeRate;
	costName: string;
	costItems: Array<CostItemPresentational>;
	daTotalScreened: number;
	baseTotalScreened: number;
	CostType = CostType;
	CommentActionType = CommentActionType;

	private readonly numericRegex = '^-?[0-9]\\d*(\\.\\d{1,2})?$';
	private unsubscribe$: Subject<void> = new Subject<void>();

	get daScreenedAmount(): FormArray {
		return this.formGroup.get('daScreenedAmount') as FormArray;
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
			daScreenedAmount: this.formBuilder.array([]),
		});
		this.setFormData();
		this.trackDaAmountsChanges();

		this.daScreenedAmount.controls.forEach((control: AbstractControl) =>
			control.valueChanges.pipe(distinctUntilChanged(), debounceTime(100), takeUntil(this.unsubscribe$)).subscribe((changes) => {
				if (this.formGroup.valid) {
					this.trackDaAmountsChanges();
					control.patchValue({ baseAmount: this.calculateBaseAmount(control) }, { emitEvent: false, onlySelf: true });
					this.changeDetectorRef.detectChanges();
				}
			})
		);

		this.daExchangeRate$.pipe(takeUntil(this.unsubscribe$), pairwise()).subscribe(([previous, current]) => {
			this.trackDaExchangeRateChanges(previous, current);
			this.changeDetectorRef.detectChanges();
		});
	}

	setFormData = () => {
		this.costItems.forEach((costItem: CostItem) => {
			const amount = costItem.costs[1].amount * this.costsQuery.getDaExchangeRate();
			const baseAmount = costItem.costs[1].amount * this.costsQuery.getBaseExchangeRate();
			this.daScreenedAmount.push(
				this.formBuilder.group({
					amount: [amount, [Validators.required, Validators.pattern(this.numericRegex)]],
					baseAmount: [baseAmount, Validators.required],
				})
			);
		});
	};

	trackDaAmountsChanges = () => {
		this.daTotalScreened = this.daScreenedAmount.value
			.map((item: any) => JSON.parse(item.amount))
			.reduce((prev: number, curr: number) => prev + curr, 0);

		this.baseTotalScreened = this.daTotalScreened / this.costsQuery.getBaseToDaExchangeRates();
	};

	trackDaExchangeRateChanges = (previousExchangeRate: number, currentExchangeRate: number) => {
		this.daScreenedAmount.controls.forEach((group) => {
			const newAmount = group.value.amount * (currentExchangeRate / previousExchangeRate);
			const newBaseAmount = newAmount / this.costsQuery.getBaseToDaExchangeRates();
			group.patchValue({
				amount: parseFloat(newAmount.toString()).toFixed(2),
				baseAmount: parseFloat(newBaseAmount.toString()).toFixed(2),
			});
		});
	};

	calculateBaseAmount = (control: AbstractControl) => {
		const newBaseAmount = control.value.amount / this.costsQuery.getBaseToDaExchangeRates();
		return parseFloat(newBaseAmount.toString()).toFixed(2);
	};

	toggleComments = (item: CostItemPresentational) => (item.hideComments = !item.hideComments);

	onAddComment = (event: any) => this.costsService.addComment(event.costItemId, event.comment);

	ngOnDestroy() {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}
}
