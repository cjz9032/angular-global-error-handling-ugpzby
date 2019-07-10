import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { PageSettingsComponent } from '../components/pages/page-settings/page-settings.component';

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
