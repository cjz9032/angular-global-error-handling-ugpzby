import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { PageDashboardComponent } from '../components/pages/page-dashboard/page-dashboard.component';
import { PageDeviceGamingComponent } from '../components/pages/page-device-gaming/page-device-gaming.component';
import { GuardService } from '../services/guard/guardService.service';
import { NonCommercialGuard } from '../services/guard/non-commercial-guard';
import { NonSMBGuard } from '../services/guard/non-smb-guard';
import { NonConsumerGuard } from '../services/guard/non-consumer-guard';

const routes: Routes = [
	{
		path: '',
		component: PageDeviceGamingComponent,
		canDeactivate: [ GuardService ],
		canActivate: [ GuardService, NonCommercialGuard, NonSMBGuard, NonConsumerGuard ],
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
