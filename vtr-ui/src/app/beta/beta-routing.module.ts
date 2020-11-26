import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BetaComponentComponent } from './beta-component/beta-component.component';

const routes: Routes = [
	{
		path: '',
		component: BetaComponentComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class BetaModuleRoutingModule {}
