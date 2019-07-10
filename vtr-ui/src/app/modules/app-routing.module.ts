import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

const routes: Routes = [
	{
		path: 'dashboard',
		loadChildren: './hardware-dashboard.module#HardwareDashboardModule'
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
		loadChildren: './hardware-settings.module#HardwareSettingsModule'
	},
	{
		path: '',
		redirectTo: 'dashboard',
		pathMatch: 'full'
	},
	{
		path: '',
		redirectTo: 'device-gaming',
		pathMatch: 'full'
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			useHash: true,
			scrollPositionRestoration: 'enabled',
			enableTracing: false
			// preloadingStrategy: PreloadAllModules
		})
	],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
