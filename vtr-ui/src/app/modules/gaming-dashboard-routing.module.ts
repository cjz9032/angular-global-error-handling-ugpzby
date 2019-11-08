import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { PageDashboardComponent } from '../components/pages/page-dashboard/page-dashboard.component';
import { PageDeviceGamingComponent } from '../components/pages/page-device-gaming/page-device-gaming.component';
import { GuardService } from '../services/guard/guardService.service';

const routes: Routes = [
	{
		path: '',
		component: PageDeviceGamingComponent,
		canDeactivate: [ GuardService ],
		canActivate: [ GuardService ],
		data: {
			pageName: 'Gaming.Dashboard'
		}
	}
];
@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class GamingDashboardRoutingModule {}
