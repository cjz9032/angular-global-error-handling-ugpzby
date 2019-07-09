import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslationModule } from './translation.module';

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
		loadChildren: './hardware-settings.module#HardwareSettingModule'
	},
	{
		path: '',
		redirectTo: 'dashboard',
		pathMatch: 'full'
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled' }),
		TranslationModule
	],
	exports: [
		RouterModule,
		TranslationModule
	]
})
export class AppRoutingModule { }
