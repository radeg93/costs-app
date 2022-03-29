import { Pipe, PipeTransform } from '@angular/core';
import { CostItem } from '@models/costs.interface';
import { CostType } from '@enums/costs.enum';

@Pipe({
	name: 'total',
})
export class TotalPipe implements PipeTransform {
	transform(costItems: Array<CostItem>, type: CostType, exchangeRate: any): number {
		const sum = costItems
			.map((item) =>
				item.costs
					.filter((cost) => cost.type === type)
					.map((cost) => cost.amount)
					.reduce((prev, curr) => prev + curr, 0)
			)
			.reduce((prev, curr) => prev + curr, 0);

		return sum * exchangeRate;
	}
}
