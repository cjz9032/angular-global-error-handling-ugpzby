import { HomeComponent } from './../components/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { PageSettingsComponent } from '../components/pages/page-settings/page-settings.component';
import { PageDashboardComponent } from '../components/pages/page-dashboard/page-dashboard.component';
import { PageDeviceGamingComponent } from '../components/pages/page-device-gaming/page-device-gaming.component';
import { GuardService } from 'src/app/services/guard/guardService.service';

const routes: Routes = [

	{
		path: 'dashboard',
		component: PageDashboardComponent,
		canDeactivate: [GuardService],
		canActivate: [ GuardService ],
		data: {
			pageName: 'Dashboard'
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
		path: 'gaming',
		loadChildren: () => import('./gaming.module').then(m => m.GamingModule)
	},
	{
		path: 'device',
		loadChildren: () => import('./hardware-settings/hardware-settings.module').then(m => m.HardwareSettingsModule)
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
		loadChildren: () => import('./connected-home-security/connected-home-security.module').then(m => m.ConnectedHomeSecurityModule)
	},
	{
		path: 'security',
		loadChildren: () => import('./security-advisor/security-advisor.module').then(m => m.SecurityAdvisorModule)
	},
	{
		path: 'support',
		loadChildren: () => import('./support/support.module').then(m => m.SupportModule)
	},
	{
		path: 'apps-for-you/:id',
		loadChildren: () => import('./apps-for-you/apps-for-you.module').then(m => m.AppsForYouModule)
	},
	{
		path: 'android',
		loadChildren: () => import('./android/android-dashboard.module').then(m => m.AndroidDashboardModule)
	},
	{
		path: 'beta',
		loadChildren: () => import('../beta/beta.module').then(m => m.BetaModule)
	},
	{
		path: 'support/smart-performance',
		loadChildren: () => import('./smart-performance/smart-performance.module').then(m => m.SmartPerformanceModule)
	},
	{
		path: 'cpt',
		/*component: PageCptComponent*/
		loadChildren: () => import('./cpt/cpt.module').then(m => m.CptModule)
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
