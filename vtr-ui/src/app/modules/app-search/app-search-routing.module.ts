import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuardService } from 'src/app/services/guard/guardService.service';
import { PageSearchComponent } from '../../components/app-search/page-search/page-search.component';


const routes: Routes = [
	{
		path: '',
		component: PageSearchComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService],
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
