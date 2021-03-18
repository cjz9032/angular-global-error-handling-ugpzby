import { GuardService } from 'src/app/services/guard/guardService.service';
import { NgModule } from '@angular/core';
import { PageDeviceComponent } from 'src/app/components/pages/page-device/page-device.component';
import { PageDeviceSettingsComponent } from 'src/app/components/pages/page-device-settings/page-device-settings.component';
import { PageSmartAssistComponent } from 'src/app/components/pages/page-smart-assist/page-smart-assist.component';
import { PageSupportDetailComponent } from 'src/app/components/pages/page-support-detail/page-support-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { SubpageDeviceSettingsAudioComponent } from 'src/app/components/pages/page-device-settings/children/subpage-device-settings-audio/subpage-device-settings-audio.component';
import { SubpageDeviceSettingsDisplayComponent } from 'src/app/components/pages/page-device-settings/children/subpage-device-settings-display/subpage-device-settings-display.component';
import { SubpageDeviceSettingsInputAccessoryComponent } from 'src/app/components/pages/page-device-settings/children/subpage-device-settings-input-accessory/subpage-device-settings-input-accessory.component';
import { NonGamingGuard } from 'src/app/services/guard/non-gaming-guard';
import { NonArmGuard } from 'src/app/services/guard/non-arm-guard';
import { SubpageDeviceSettingsPowerContainerComponent } from 'src/app/components/pages/page-device-settings/children/subpage-device-settings-power-container/subpage-device-settings-power-container.component';
import { PageHighDensityBatteryComponent } from 'src/app/components/pages/page-high-density-battery/page-high-density-battery.component';
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
		component: PageDeviceSettingsComponent,
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
				component: SubpageDeviceSettingsPowerContainerComponent,
				canDeactivate: [GuardService],
				canActivate: [GuardService],
				data: {
					pageName: 'Device.MyDeviceSettings.power',
				},
			},
			{
				path: 'audio',
				component: SubpageDeviceSettingsAudioComponent,
				canDeactivate: [GuardService],
				canActivate: [GuardService],
				data: {
					pageName: 'Device.MyDeviceSettings.audio',
				},
			},
			{
				path: 'display-camera',
				component: SubpageDeviceSettingsDisplayComponent,
				canDeactivate: [GuardService],
				canActivate: [GuardService],
				data: {
					pageName: 'Device.MyDeviceSettings.display-camera',
				},
			},
			{
				path: 'input-accessories',
				component: SubpageDeviceSettingsInputAccessoryComponent,
				canDeactivate: [GuardService],
				canActivate: [GuardService],
				data: {
					pageName: 'Device.MyDeviceSettings.input-accessories',
				},
			},
			{
				path: 'smart-assist',
				component: PageSmartAssistComponent,
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
			pageName: 'Support.Detail',
		},
	},
	{
		path: 'high-density-battery',
		component: PageHighDensityBatteryComponent,
		canDeactivate: [GuardService],
		canActivate: [NonShellGuard, GuardService],
		data: {
			pageName: 'Device.HighDensityBattery',
		},
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class HardwareSettingRoutingModule {}
