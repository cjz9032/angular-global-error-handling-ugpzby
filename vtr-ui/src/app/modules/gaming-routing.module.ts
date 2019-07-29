import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { PageDashboardComponent } from '../components/pages/page-dashboard/page-dashboard.component';
import { PageDeviceGamingComponent } from '../components/pages/page-device-gaming/page-device-gaming.component';
import { GuardService } from '../services/guard/security-guardService.service';
import { PageMacrokeyComponent } from '../components/pages/page-macrokey/page-macrokey.component';
import { PageLightingcustomizeComponent } from '../components/pages/page-lightingcustomize/page-lightingcustomize.component';
import { PageNetworkBoostComponent } from '../components/pages/page-network-boost/page-network-boost.component';
import { PageAutocloseComponent } from './../components/pages/page-autoclose/page-autoclose.component';
import { PageUserComponent } from '../components/pages/page-user/page-user.component';

const routes: Routes = [
	// {
	// 	path: 'dashboard',
	// 	component: PageDashboardComponent,
	// 	canDeactivate: [GuardService],
	// 	canActivate: [GuardService],
	// 	data: {
	// 		pageName: 'Dashboard'
	// 	}
	// },
	{
		path: '',
		component: PageDeviceGamingComponent,
		canDeactivate: [ GuardService ],
		canActivate: [ GuardService ],
		data: {
			pageName: 'Device',
			pageContent: 'Device Status'
		}
	},
	{
		path: 'device-gaming',
		component: PageDeviceGamingComponent,
		canDeactivate: [ GuardService ],
		canActivate: [ GuardService ],
		data: {
			pageName: 'Device',
			pageContent: 'Device Status'
		}
	},
	{
		path: 'macrokey',
		component: PageMacrokeyComponent,
		canDeactivate: [ GuardService ],
		canActivate: [ GuardService ],
		data: {
			pageName: 'Macrokey'
		}
	},
	{
		path: 'lightingcustomize/:id',
		component: PageLightingcustomizeComponent,
		canDeactivate: [ GuardService ],
		canActivate: [ GuardService ],

		data: {
			pageName: 'Lightingcustomize'
		}
	},
	{
		path: 'networkboost',
		component: PageNetworkBoostComponent,
		canDeactivate: [ GuardService ],
		canActivate: [ GuardService ],
		data: {
			pageName: 'NetworkBoost'
		}
	},
	{
		path: 'autoclose',
		component: PageAutocloseComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService],
		data: {
			pageName: 'AutoClose'
		}
	},
	{
		path: 'user',
		component: PageUserComponent,
		canDeactivate: [ GuardService ],
		canActivate: [ GuardService ],
		data: {
			pageName: 'User'
		}
	}
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class GamingRoutingModule {}
