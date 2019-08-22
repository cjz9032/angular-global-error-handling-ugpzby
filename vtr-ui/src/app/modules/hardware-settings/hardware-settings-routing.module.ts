import { GuardService } from 'src/app/services/guard/security-guardService.service';
import { NgModule } from '@angular/core';
import { PageDeviceComponent } from 'src/app/components/pages/page-device/page-device.component';
import { PageDeviceSettingsComponent } from 'src/app/components/pages/page-device-settings/page-device-settings.component';
import { PageDeviceUpdatesComponent } from 'src/app/components/pages/page-device-updates/page-device-updates.component';
import { PageSmartAssistComponent } from 'src/app/components/pages/page-smart-assist/page-smart-assist.component';
import { PageSupportDetailComponent } from 'src/app/components/pages/page-support-detail/page-support-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { SubpageDeviceSettingsAudioComponent } from 'src/app/components/pages/page-device-settings/children/subpage-device-settings-audio/subpage-device-settings-audio.component';
import { SubpageDeviceSettingsDisplayComponent } from 'src/app/components/pages/page-device-settings/children/subpage-device-settings-display/subpage-device-settings-display.component';
import { SubpageDeviceSettingsInputAccessoryComponent } from 'src/app/components/pages/page-device-settings/children/subpage-device-settings-input-accessory/subpage-device-settings-input-accessory.component';
import { SubpageDeviceSettingsPowerComponent } from 'src/app/components/pages/page-device-settings/children/subpage-device-settings-power/subpage-device-settings-power.component';


const routes: Routes = [
	{
		path: '',
		component: PageDeviceComponent,
		data: {
			pageName: 'Device.MyDevice',
			pageContent: 'My Device Status'
		}
	},
	{
		path: 'device',
		component: PageDeviceComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService],
		data: {
			pageName: 'Device.MyDevice',
			pageContent: 'My Device Status'
		}
	},
	{
		path: 'device-settings',
		component: PageDeviceSettingsComponent,
		data: {
			pageName: 'Device.MyDeviceSettings',
			pageContent: 'My Device Status'
		},
		children: [
			{
				path: '',
				redirectTo: 'power',
				pathMatch: 'full'
			},
			{
				path: 'power',
				component: SubpageDeviceSettingsPowerComponent,
				canDeactivate: [GuardService],
				canActivate: [GuardService],
				data: {
					pageName: 'Device.MyDeviceSettings'
				}
			},
			{
				path: 'audio',
				component: SubpageDeviceSettingsAudioComponent,
				canDeactivate: [GuardService],
				canActivate: [GuardService],
				data: {
					pageName: 'Device.MyDeviceSettings'
				}
			},
			{
				path: 'display-camera',
				component: SubpageDeviceSettingsDisplayComponent,
				canDeactivate: [GuardService],
				canActivate: [GuardService],
				data: {
					pageName: 'Device.MyDeviceSettings'
				}
			},
			{
				path: 'input-accessories',
				component: SubpageDeviceSettingsInputAccessoryComponent,
				canDeactivate: [GuardService],
				canActivate: [GuardService],
				data: {
					pageName: 'Device.MyDeviceSettings'
				}
			}
		]
	},
	{
		path: 'smart-assist',
		component: PageSmartAssistComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService],

		data: {
			pageName: 'Device.SmartAssist',
			pageContent: 'My Device Status'
		}
	},
	{
		path: 'system-updates',
		component: PageDeviceUpdatesComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService],
		data: {
			pageName: 'Device.SystemUpdate',
			pageContent: 'My Device Status'
		}
	},
	{
		path: 'support-detail/:id',
		component: PageSupportDetailComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService],
		data: {
			pageName: 'Support.Detail'
		}
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(routes)
	],
	exports: [
		RouterModule
	]
})
export class HardwareSettingRoutingModule { }
