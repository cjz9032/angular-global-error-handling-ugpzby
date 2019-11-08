import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageAppsForYouComponent } from '../../components/pages/page-apps-for-you/page-apps-for-you.component';
import { GuardService } from 'src/app/services/guard/guardService.service';

const routes: Routes = [
	{
		path: '',
		component: PageAppsForYouComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService],
		data: {
			pageName: 'AppsForYou'
		}
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(routes)
	],
	exports: [
		RouterModule
	]
})
export class AppsForYouRoutingModule { }
