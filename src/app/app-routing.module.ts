import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataResolver } from '@resolvers/data.resolver';
import { CostsComponent } from '@components/costs/costs.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: '/costs',
		pathMatch: 'full',
	},
	{
		path: 'costs',
		component: CostsComponent,
		resolve: {
			costsAndExchangeRates: DataResolver,
		},
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
