import { HomeComponent } from './../components/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageSettingsComponent } from '../components/pages/page-settings/page-settings.component';
import { PageSupportComponent } from '../components/pages/page-support/page-support.component';
import { GuardService } from '../services/guard/security-guardService.service';

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
		path: 'android',
		loadChildren: './android/android-dashboard.module#AndroidDashboardModule'
	},
	{
		path: 'beta',
		loadChildren: '../beta/beta.module#BetaModule'
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
			// preloadingStrategy: PreloadAllModules
		})
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
