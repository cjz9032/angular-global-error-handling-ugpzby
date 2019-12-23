import { HomeComponent } from './../components/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { PageSettingsComponent } from '../components/pages/page-settings/page-settings.component';

const routes: Routes = [
	{
		path: 'dashboard',
		loadChildren: () => import('./hardware-settings/hardware-dashboard.module').then(mod => mod.HardwareDashboardModule)
	},
	{
		path: 'device-gaming',
		loadChildren: () => import('./gaming-dashboard.module').then(mod => mod.GamingDashboardModule)
	},
	{
		path: 'gaming',
		loadChildren: () => import('./gaming.module').then(mod => mod.GamingModule)
	},
	{
		path: 'device',
		loadChildren: () => import('./hardware-settings/hardware-settings.module').then(mod => mod.HardwareSettingsModule)
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
		loadChildren: () => import('./connected-home-security/connected-home-security.module').then(mod => mod.ConnectedHomeSecurityModule)
	},
	{
		path: 'privacy',
		loadChildren: () => import('../components/pages/page-privacy/privacy.module').then(mod => mod.PrivacyModule)
	},
	{
		path: 'security',
		loadChildren: () => import('./security-advisor/security-advisor.module').then(mod => mod.SecurityAdvisorModule)
	},
	{
		path: 'support',
		loadChildren: () => import('./support/support.module').then(mod => mod.SupportModule)
	},
	{
		path: 'apps-for-you/:id',
		loadChildren: () => import('./apps-for-you/apps-for-you.module').then(mod => mod.AppsForYouModule)
	},
	{
		path: 'android',
		loadChildren: () => import('./android/android-dashboard.module').then(mod => mod.AndroidDashboardModule)
	},
	{
		path: 'beta',
		loadChildren: () => import('../beta/beta.module').then(mod => mod.BetaModule)
	},
	// {
	// 	path: 'device/smart-performance',
	// 	loadChildren: () => import('./smart-performance/smart-performance.module').then(mod => mod.SmartPerformanceModule)
	// },
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
