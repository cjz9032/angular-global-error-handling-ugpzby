import { PageNetworkboostComponent } from './../components/pages/page-networkboost/page-networkboost.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { PageDashboardComponent } from '../components/pages/page-dashboard/page-dashboard.component';
import { PageDeviceGamingComponent } from '../components/pages/page-device-gaming/page-device-gaming.component';
import { GuardService } from '../services/guard/guardService.service';
import { PageMacrokeyComponent } from '../components/pages/page-macrokey/page-macrokey.component';
import { PageLightingcustomizeComponent } from '../components/pages/page-lightingcustomize/page-lightingcustomize.component';
import { PageAutocloseComponent } from './../components/pages/page-autoclose/page-autoclose.component';
import { PageUserComponent } from '../components/pages/page-user/page-user.component';

const routes: Routes = [
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
			pageName: 'Gaming.Dashboard',
			pageContent: 'Gaming Dashboard'
		}
	},
	{
		path: 'macrokey',
		component: PageMacrokeyComponent,
		canDeactivate: [ GuardService ],
		canActivate: [ GuardService ],
		data: {
			pageName: 'Gaming.Macrokey',
			pageContent: 'Gaming Macrokey'
		}
	},
	{
		path: 'lightingcustomize/:id',
		component: PageLightingcustomizeComponent,
		canDeactivate: [ GuardService ],
		canActivate: [ GuardService ],

		data: {
			pageName: 'Gaming.Lighting',
			pageContent: 'Gaming Lighting'
		}
	},
	{
		path: 'networkboost',
		component: PageNetworkboostComponent,
		canDeactivate: [ GuardService ],
		canActivate: [ GuardService ],
		data: {
			pageName: 'Gaming.NetworkBoost',
			pageContent: 'Gaming NetworkBoost'

		}
	},
	{
		path: 'autoclose',
		component: PageAutocloseComponent,
		canDeactivate: [ GuardService ],
		canActivate: [ GuardService ],
		data: {
			pageName: 'Gaming.AutoClose',
			pageContent: 'Gaming AutoClose'
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
