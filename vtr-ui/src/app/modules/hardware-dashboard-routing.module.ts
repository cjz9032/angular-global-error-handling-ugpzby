// import { PageHardwarescanComponent } from '../components/pages/page-hardwarescan/page-hardwarescan.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageDashboardComponent } from '../components/pages/page-dashboard/page-dashboard.component';
// import { PageDeviceComponent } from '../components/pages/page-device/page-device.component';
// import { PageDeviceSettingsComponent } from '../components/pages/page-device-settings/page-device-settings.component';
// import { SubpageDeviceSettingsPowerComponent } from '../components/pages/page-device-settings/children/subpage-device-settings-power/subpage-device-settings-power.component';
// import { SubpageDeviceSettingsAudioComponent } from '../components/pages/page-device-settings/children/subpage-device-settings-audio/subpage-device-settings-audio.component';
// import { SubpageDeviceSettingsDisplayComponent } from '../components/pages/page-device-settings/children/subpage-device-settings-display/subpage-device-settings-display.component';
// import { PageDeviceUpdatesComponent } from '../components/pages/page-device-updates/page-device-updates.component';
// import { PageSecurityComponent } from '../components/pages/page-security/page-security.component';
// import { PageSecurityAntivirusComponent } from '../components/pages/page-security-antivirus/page-security-antivirus.component';
// import { PageSecurityWifiComponent } from '../components/pages/page-security-wifi/page-security-wifi.component';
// import { PageSecurityPasswordComponent } from '../components/pages/page-security-password/page-security-password.component';
// import { PageSecurityInternetComponent } from '../components/pages/page-security-internet/page-security-internet.component';
// import { PageSupportComponent } from '../components/pages/page-support/page-support.component';
// import { PageSupportDetailComponent } from '../components/pages/page-support-detail/page-support-detail.component';
// import { PageUserComponent } from '../components/pages/page-user/page-user.component';
// import { PageSecurityWindowsHelloComponent } from '../components/pages/page-security-windows-hello/page-security-windows-hello.component';
// import { WindowsHelloGuardService } from '../services/guard/windows-hello-guardService.service';
// import { PageConnectedHomeSecurityComponent } from '../components/pages/page-connected-home-security/page-connected-home-security.component';
import { GuardService } from '../services/guard/security-guardService.service';
import { TranslationModule } from './translation.module';
// import { LocalStorageKey } from '../enums/local-storage-key.enum';
// import { PageAutocloseComponent } from '../components/pages/page-autoclose/page-autoclose.component';
// import { PageSmartAssistComponent } from '../components/pages/page-smart-assist/page-smart-assist.component';
// import { PageSettingsComponent } from '../components/pages/page-settings/page-settings.component';
// import { SubpageDeviceSettingsInputAccessoryComponent } from '../components/pages/page-device-settings/children/subpage-device-settings-input-accessory/subpage-device-settings-input-accessory.component';

// const routes: Routes = [
// 	{
// 		path: 'dashboard',
// 		component: PageDashboardComponent,
// 		canDeactivate: [GuardService],
// 		canActivate: [GuardService],
// 		data: {
// 			pageName: 'Dashboard'
// 		}
// 	}
// {
// 	path: 'hardwarescan',
// 	component: PageHardwarescanComponent,
// 	canDeactivate: [GuardService],
// 	canActivate: [GuardService],

// 	data: {
// 		pageName: 'Hardwarescan'
// 	}
// },
// {
// 	path: 'device',
// 	component: PageDeviceComponent,
// 	canDeactivate: [GuardService],
// 	canActivate: [GuardService],
// 	data: {
// 		pageName: 'Device.MyDevice',
// 		pageContent: 'My Device Status'
// 	}
// },
// {
// 	path: 'device/device-settings',
// 	component: PageDeviceSettingsComponent,
// 	data: {
// 		pageName: 'Device.MyDeviceSettings',
// 		pageContent: 'My Device Status'
// 	},
// 	children: [
// 		{
// 			path: '',
// 			redirectTo: 'power',
// 			pathMatch: 'full'
// 		},
// 		{
// 			path: 'power',
// 			component: SubpageDeviceSettingsPowerComponent,
// 			canDeactivate: [GuardService],
// 			canActivate: [GuardService],
// 			data: {
// 				pageName: 'Device.MyDeviceSettings'
// 			}
// 		},
// 		{
// 			path: 'audio',
// 			component: SubpageDeviceSettingsAudioComponent,
// 			canDeactivate: [GuardService],
// 			canActivate: [GuardService],
// 			data: {
// 				pageName: 'Device.MyDeviceSettings'
// 			}
// 		},
// 		{
// 			path: 'display-camera',
// 			component: SubpageDeviceSettingsDisplayComponent,
// 			canDeactivate: [GuardService],
// 			canActivate: [GuardService],
// 			data: {
// 				pageName: 'Device.MyDeviceSettings'
// 			}
// 		},
// 		{
// 			path: 'input-accessories',
// 			component: SubpageDeviceSettingsInputAccessoryComponent,
// 			canDeactivate: [GuardService],
// 			canActivate: [GuardService],
// 			data: {
// 				pageName: 'Device.MyDeviceSettings'
// 			}
// 		}
// 	]
// },
// {
// 	path: 'device/smart-assist',
// 	component: PageSmartAssistComponent,
// 	canDeactivate: [GuardService],
// 	canActivate: [GuardService],

// 	data: {
// 		pageName: 'Device.MyDeviceSettings',
// 		pageContent: 'My Device Status'
// 	}
// },
// {
// 	path: 'device/system-updates',
// 	component: PageDeviceUpdatesComponent,
// 	canDeactivate: [GuardService],
// 	canActivate: [GuardService],
// 	data: {
// 		pageName: 'Device.SystemUpdate',
// 		pageContent: 'My Device Status'
// 	}
// },
// {
// 	path: 'security',
// 	component: PageSecurityComponent,
// 	canDeactivate: [GuardService],
// 	canActivate: [GuardService],
// 	data: {
// 		pageName: 'Security.MySecurity',
// 		pageContent: 'My Device Status'
// 	}

// },
// {
// 	path: 'security/anti-virus',
// 	component: PageSecurityAntivirusComponent,
// 	canDeactivate: [GuardService],
// 	canActivate: [GuardService],
// 	data: {
// 		pageName: 'Security.AntiVirus',
// 		pageContent: LocalStorageKey.SecurityCurrentPage
// 	}
// },
// {
// 	path: 'security/wifi-security',
// 	component: PageSecurityWifiComponent,
// 	canDeactivate: [GuardService],
// 	canActivate: [GuardService],
// 	data: {
// 		pageName: 'Security.WifiSecurity'
// 	}
// },
// {
// 	path: 'security/password-protection',
// 	component: PageSecurityPasswordComponent,
// 	canDeactivate: [GuardService],
// 	canActivate: [GuardService],
// 	data: {
// 		pageName: 'Security.PasswordProtection'
// 	}
// },
// {
// 	path: 'security/internet-protection',
// 	component: PageSecurityInternetComponent,
// 	canDeactivate: [GuardService],
// 	canActivate: [GuardService],
// 	data: {
// 		pageName: 'Security.InternetProtection'
// 	}
// },
// {
// 	path: 'security/windows-hello',
// 	component: PageSecurityWindowsHelloComponent,
// 	canActivate: [GuardService, WindowsHelloGuardService],
// 	canDeactivate: [GuardService],
// 	data: {
// 		pageName: 'Security.WindowsHello'
// 	}
// },
// {
// 	path: 'support',
// 	component: PageSupportComponent,
// 	canDeactivate: [GuardService],
// 	canActivate: [GuardService],
// 	data: {
// 		pageName: 'Page.Support'
// 	}
// },
// {
// 	path: 'support-detail/:id',
// 	component: PageSupportDetailComponent,
// 	canDeactivate: [GuardService],
// 	canActivate: [GuardService],
// 	data: {
// 		pageName: 'Support.Detail'
// 	}
// },
// {
// 	path: 'home-security',
// 	component: PageConnectedHomeSecurityComponent,
// 	canDeactivate: [GuardService],
// 	canActivate: [GuardService],
// 	data: {
// 		pageName: 'ConnectedHomeSecurity'
// 	}
// },
// {
// 	path: 'user',
// 	component: PageUserComponent,
// 	canDeactivate: [GuardService],
// 	canActivate: [GuardService],
// 	data: {
// 		pageName: 'User'
// 	}
// },
// {
// 	path: 'autoclose',
// 	component: PageAutocloseComponent,
// 	canDeactivate: [GuardService],
// 	canActivate: [GuardService],
// 	data: {
// 		pageName: 'AutoClose'
// 	}
// },
// {
// 	path: 'settings',
// 	component: PageSettingsComponent,
// 	data: {
// 		pageName: 'Page.Settings'
// 	}
// }
// ];

const routes: Routes = [
	{
		path: '',
		component: PageDashboardComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService],
		data: {
			pageName: 'Dashboard'
		}
	}];
@NgModule({
	imports: [
		RouterModule.forChild(routes),
		TranslationModule
	],
	exports: [
		RouterModule,
		TranslationModule
	]
})
export class HardwareDashboardRoutingModule { }
