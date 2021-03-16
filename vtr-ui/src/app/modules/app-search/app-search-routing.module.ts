import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuardService } from 'src/app/services/guard/guardService.service';
import { NonShellGuard } from 'src/app/services/guard/non-shell-guard';
import { PageSearchComponent } from '../../components/app-search/page-search/page-search.component';

const routes: Routes = [
	{
		path: '',
		component: PageSearchComponent,
		canDeactivate: [GuardService],
		canActivate: [NonShellGuard, GuardService],
		data: {
			pageName: 'Page.Search',
		},
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AppSearchRoutingModule {}
