import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { PageSettingsComponent } from '../components/pages/page-settings/page-settings.component';
import { NonGamingGuard } from '../services/guard/non-gaming-guard';

const routes: Routes = [

	{
		path: 'dashboard',
		loadChildren: './hardware-settings/hardware-dashboard.module#HardwareDashboardModule'
	},
	{
		path: 'device-gaming',
		loadChildren: './gaming-dashboard.module#GamingDashboardModule'
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
	// {
	// 	path: 'device/smart-performance',
	// 	loadChildren: './smart-performance/smart-performance.module#SmartPerformanceModule'
	// },
	{
		path: '',
		canActivate: [ NonGamingGuard ],
		loadChildren: './hardware-settings/hardware-dashboard.module#HardwareDashboardModule',
		pathMatch: 'full'
	},
	{
		path: '**',
		canActivate: [ NonGamingGuard ],
		loadChildren: './hardware-settings/hardware-dashboard.module#HardwareDashboardModule',
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
