import { HomeComponent } from './../components/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { PageSettingsComponent } from '../components/pages/page-settings/page-settings.component';
import { PageCptComponent } from '../components/pages/page-cpt/page-cpt.component';
import { CptpageMyDeviceComponent } from '../components/pages/page-cpt/children/hardware-settings/cptpage-my-device/cptpage-my-device.component';
import { PageDashboardComponent } from '../components/pages/page-dashboard/page-dashboard.component';
import { PageDeviceGamingComponent } from '../components/pages/page-device-gaming/page-device-gaming.component';

const routes: Routes = [

	{
		path: 'dashboard',
		component: PageDashboardComponent
	},
	{
		path: 'device-gaming',
		component: PageDeviceGamingComponent
	},
	{
		path: 'gaming',
		loadChildren: './gaming.module#GamingModule'
	},
	{
		path: 'device',
		loadChildren: './hardware-settings/hardware-settings.module#HardwareSettingsModule'
	},
	{
		path: 'settings',
		component: PageSettingsComponent,
		data: {
			pageName: 'Page.Settings'
		}
	},
	{
		path: 'home-security',
		loadChildren: './connected-home-security/connected-home-security.module#ConnectedHomeSecurityModule'
	},
	{
		path: 'privacy',
		loadChildren: '../components/pages/page-privacy/privacy.module#PrivacyModule'
	},
	{
		path: 'security',
		loadChildren: './security-advisor/security-advisor.module#SecurityAdvisorModule'
	},
	{
		path: 'support',
		loadChildren: './support/support.module#SupportModule'
	},
	{
		path: 'apps-for-you/:id',
		loadChildren: './apps-for-you/apps-for-you.module#AppsForYouModule'
	},
	{
		path: 'android',
		loadChildren: './android/android-dashboard.module#AndroidDashboardModule'
	},
	{
		path: 'beta',
		loadChildren: '../beta/beta.module#BetaModule'
	},
	{
		path: 'support/smart-performance',
		loadChildren: './smart-performance/smart-performance.module#SmartPerformanceModule'
	},
	{
		path: 'cpt',
		/*component: PageCptComponent*/
		loadChildren: './cpt/cpt.module#CptModule'
	},
	{
		path: '',
		component: HomeComponent,
		pathMatch: 'full'
	},
	{
		path: '**',
		component: HomeComponent
	}


];


@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			useHash: true,
			scrollPositionRestoration: 'enabled',
			enableTracing: false,
			preloadingStrategy: PreloadAllModules
		})
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
