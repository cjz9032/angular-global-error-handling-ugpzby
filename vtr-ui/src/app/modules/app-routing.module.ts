import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
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
		path: '',
		redirectTo: 'dashboard',
		pathMatch: 'full'
	},
	{
		path: 'home-security',
		loadChildren: './connected-home-security/connected-home-security.module#ConnectedHomeSecurityModule'
		// canDeactivate: [GuardService],
		// canActivate: [GuardService],
		// data: {
		// 	pageName: 'ConnectedHomeSecurity'
		// }
	},
	{
		path: 'security',
		loadChildren: './security-advisor/security-advisor.module#SecurityAdvisorModule'
		// canDeactivate: [GuardService],
		// canActivate: [GuardService],
		// data: {
		// 	pageName: 'Security'
		// }
	},
	{
		path: 'security/anti-virus',
		loadChildren: './security-advisor/security-advisor.module#SecurityAdvisorModule'
		// canDeactivate: [GuardService],
		// canActivate: [GuardService],
		// data: {
		// 	pageName: 'Security.AntiVirus',
		// 	pageContent: LocalStorageKey.SecurityCurrentPage
		// }
	}, {
		path: 'security/wifi-security',
		loadChildren: './security-advisor/security-advisor.module#SecurityAdvisorModule'
		// canDeactivate: [GuardService],
		// canActivate: [GuardService],
		// data: {
		// 	pageName: 'Security.WifiSecurity'
		// }
	}, {
		path: 'security/password-protection',
		loadChildren: './security-advisor/security-advisor.module#SecurityAdvisorModule'
		// canDeactivate: [GuardService],
		// canActivate: [GuardService],
		// data: {
		// 	pageName: 'Security.PasswordProtection'
		// }
	}, {
		path: 'security/internet-protection',
		loadChildren: './security-advisor/security-advisor.module#SecurityAdvisorModule'
		// canDeactivate: [GuardService],
		// canActivate: [GuardService],
		// data: {
		// 	pageName: 'Security.InternetProtection'
		// }
	}, {
		path: 'security/windows-hello',
		loadChildren: './security-advisor/security-advisor.module#SecurityAdvisorModule'
		// canActivate: [GuardService, WindowsHelloGuardService],
		// canDeactivate: [GuardService],
		// data: {
		// 	pageName: 'Security.WindowsHello'
		// }
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(
			routes,
			{
				useHash: true,
				scrollPositionRestoration: 'enabled',
				enableTracing: false,
				// preloadingStrategy: PreloadAllModules
			})
	],
	exports: [
		RouterModule
	]
})
export class AppRoutingModule { }
