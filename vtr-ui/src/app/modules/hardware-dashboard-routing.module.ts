import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageDashboardComponent } from '../components/pages/page-dashboard/page-dashboard.component';
import { GuardService } from '../services/guard/security-guardService.service';

const routes: Routes = [
	{
		path: '',
		component: PageDashboardComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService],
		data: {
			pageName: 'Dashboard'
		}
	}];
@NgModule({
	imports: [
		RouterModule.forChild(routes)
	],
	exports: [
		RouterModule
	]
})
export class HardwareDashboardRoutingModule { }
