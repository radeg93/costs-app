import { Pipe, PipeTransform } from '@angular/core';
import { CostSubItem } from '@models/costs.interface';

@Pipe({
	name: 'amount',
})
export class AmountPipe implements PipeTransform {
	transform(costSubItem: CostSubItem, exchangeRate: number): number {
		return costSubItem.amount * exchangeRate;
	}
}
