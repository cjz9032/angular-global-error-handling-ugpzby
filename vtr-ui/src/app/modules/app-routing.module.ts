import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageSettingsComponent } from '../components/pages/page-settings/page-settings.component';
import { PageSupportComponent } from '../components/pages/page-support/page-support.component';

const routes: Routes = [
	{
		path: 'dashboard',
		loadChildren: './hardware-dashboard.module#HardwareDashboardModule'
	},
	{
		path: 'gaming',
		loadChildren: './gaming.module#GamingModule'
	},
	{
		path: 'device',
		loadChildren: './hardware-settings.module#HardwareSettingsModule'
	},
	{
		path: 'support',
		component: PageSupportComponent,
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
		path: 'security',
		loadChildren: './security-advisor/security-advisor.module#SecurityAdvisorModule'
	},
	{
		path: '',
		redirectTo: 'dashboard',
		pathMatch: 'full'
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(
			routes,
			{
				useHash: true,
				scrollPositionRestoration: 'enabled',
				enableTracing: false
			})
	],
	exports: [
		RouterModule
	]
})
export class AppRoutingModule { }
