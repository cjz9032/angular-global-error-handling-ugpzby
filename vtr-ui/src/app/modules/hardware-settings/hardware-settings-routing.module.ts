import { PageSettingsAppTransitionComponent } from 'src/app/components/pages/page-settings-app-transition/page-settings-app-transition.component';
import { GuardService } from 'src/app/services/guard/guardService.service';
import { NgModule } from '@angular/core';
import { PageDeviceComponent } from 'src/app/components/pages/page-device/page-device.component';
import { PageSupportDetailComponent } from 'src/app/components/pages/page-support-detail/page-support-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { NonGamingGuard } from 'src/app/services/guard/non-gaming-guard';
import { NonArmGuard } from 'src/app/services/guard/non-arm-guard';
import { NonShellGuard } from 'src/app/services/guard/non-shell-guard';
import { PerformanceBoostGuard } from 'src/app/services/guard/performance-boost-guard';

const routes: Routes = [
	{
		path: '',
		component: PageDeviceComponent,
		canDeactivate: [GuardService],
		canActivate: [NonShellGuard, GuardService, NonArmGuard],
		data: {
			pageName: 'Device.MyDevice',
			pageContent: 'My Device Status',
		},
	},
	{
		path: 'device',
		component: PageDeviceComponent,
		canDeactivate: [NonShellGuard, GuardService],
		canActivate: [GuardService, NonArmGuard],
		data: {
			pageName: 'Device.MyDevice',
			pageContent: 'My Device Status',
		},
	},
	{
		path: 'device-settings',
		canDeactivate: [GuardService],
		canActivate: [NonShellGuard, GuardService, NonArmGuard],
		data: {
			pageName: 'Device.MyDeviceSettings',
			pageContent: 'My Device Status',
		},
		children: [
			{
				path: '',
				redirectTo: 'power',
				pathMatch: 'full',
			},
			{
				path: 'power',
				component: PageSettingsAppTransitionComponent,
				canDeactivate: [GuardService],
				canActivate: [GuardService],
				data: {
					pageName: 'Device.MyDeviceSettings.power',
				},
			},
			{
				path: 'audio',
				component: PageSettingsAppTransitionComponent,
				canDeactivate: [GuardService],
				canActivate: [GuardService],
				data: {
					pageName: 'Device.MyDeviceSettings.audio',
				},
			},
			{
				path: 'display-camera',
				component: PageSettingsAppTransitionComponent,
				canDeactivate: [GuardService],
				canActivate: [GuardService],
				data: {
					pageName: 'Device.MyDeviceSettings.display-camera',
				},
			},
			{
				path: 'input-accessories',
				component: PageSettingsAppTransitionComponent,
				canDeactivate: [GuardService],
				canActivate: [GuardService],
				data: {
					pageName: 'Device.MyDeviceSettings.input-accessories',
				},
			},
			{
				path: 'smart-assist',
				component: PageSettingsAppTransitionComponent,
				canDeactivate: [GuardService],
				canActivate: [GuardService, NonArmGuard, PerformanceBoostGuard],

				data: {
					pageName: 'Device.SmartAssist.smart-assist',
					pageContent: 'My Device Status',
				},
			},
		],
	},

	{
		path: 'support-detail/:id',
		component: PageSupportDetailComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService],
		data: {
			pageName: 'Support.Detail'
		},
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class HardwareSettingRoutingModule {}
