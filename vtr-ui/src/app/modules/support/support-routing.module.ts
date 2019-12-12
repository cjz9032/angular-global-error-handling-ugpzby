import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageSupportComponent } from '../../components/pages/page-support/page-support.component';
import { GuardService } from 'src/app/services/guard/guardService.service';
import { NonArmGuard } from 'src/app/services/guard/non-arm-guard';

const routes: Routes = [
	{
		path: '',
		component: PageSupportComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService, NonArmGuard],
		data: {
			pageName: 'Page.Support'
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
export class SupportRoutingModule { }
