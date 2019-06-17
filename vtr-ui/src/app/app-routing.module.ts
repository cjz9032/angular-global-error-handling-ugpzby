import { PageLightingcustomizeComponent } from './components/pages/page-lightingcustomize/page-lightingcustomize.component';
import { PageHardwarescanComponent } from './components/pages/page-hardwarescan/page-hardwarescan.component';
import { PageMacrokeyComponent } from './components/pages/page-macrokey/page-macrokey.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageDashboardComponent } from './components/pages/page-dashboard/page-dashboard.component';
import { PageDeviceComponent } from './components/pages/page-device/page-device.component';
import { PageDeviceGamingComponent } from './components/pages/page-device-gaming/page-device-gaming.component';
import { PageDeviceSettingsComponent } from './components/pages/page-device-settings/page-device-settings.component';
import { SubpageDeviceSettingsPowerComponent } from './components/pages/page-device-settings/children/subpage-device-settings-power/subpage-device-settings-power.component';
import { SubpageDeviceSettingsAudioComponent } from './components/pages/page-device-settings/children/subpage-device-settings-audio/subpage-device-settings-audio.component';
import { SubpageDeviceSettingsDisplayComponent } from './components/pages/page-device-settings/children/subpage-device-settings-display/subpage-device-settings-display.component';
import { PageDeviceUpdatesComponent } from './components/pages/page-device-updates/page-device-updates.component';
import { PageSecurityComponent } from './components/pages/page-security/page-security.component';
import { PageSecurityAntivirusComponent } from './components/pages/page-security-antivirus/page-security-antivirus.component';
import { PageSecurityWifiComponent } from './components/pages/page-security-wifi/page-security-wifi.component';
import { PageSecurityPasswordComponent } from './components/pages/page-security-password/page-security-password.component';
import { PageSecurityInternetComponent } from './components/pages/page-security-internet/page-security-internet.component';
import { PageSecurityHomeSecurityComponent } from './components/pages/page-security-home-security/page-security-home-security.component';
import { PageSupportComponent } from './components/pages/page-support/page-support.component';
import { PageSupportDetailComponent } from './components/pages/page-support-detail/page-support-detail.component';
import { PageUserComponent } from './components/pages/page-user/page-user.component';
import { PageSecurityWindowsHelloComponent } from './components/pages/page-security-windows-hello/page-security-windows-hello.component';
import { WindowsHelloGuardService } from './services/guard/windows-hello-guardService.service';
import { PageConnectedHomeSecurityComponent } from './components/pages/page-connected-home-security/page-connected-home-security.component';
import { PrivacyModule } from './components/pages/page-privacy/privacy.module';
import { GuardService } from './services/guard/security-guardService.service';
import { LocalStorageKey } from './enums/local-storage-key.enum';
import { PageAutocloseComponent } from './components/pages/page-autoclose/page-autoclose.component';
import { PageNetworkBoostComponent } from './components/pages/page-network-boost/page-network-boost.component';
import { PageSmartAssistComponent } from './components/pages/page-smart-assist/page-smart-assist.component';
import { PageSettingsComponent } from './components/pages/page-settings/page-settings.component';
import { SubpageDeviceSettingsInputAccessoryComponent } from './components/pages/page-device-settings/children/subpage-device-settings-input-accessory/subpage-device-settings-input-accessory.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'dashboard',
		pathMatch: 'full'
	}, {
		path: 'dashboard',
		component: PageDashboardComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService],
		data: {
			pageName: 'Dashboard'
		}
	}, {
		path: 'macrokey',
		component: PageMacrokeyComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService],
		data: {
			pageName: 'Macrokey'
		}
	}, {
		path: 'hardwarescan',
		component: PageHardwarescanComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService],

		data: {
			pageName: 'Hardwarescan'
		}
	}, {
		path: 'lightingcustomize/:id',
		component: PageLightingcustomizeComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService],

		data: {
			pageName: 'Lightingcustomize'
		}
	}, {
		path: 'device',
		component: PageDeviceComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService],
		data: {
			pageName: 'Device.MyDevice'
		}
	}, {
		path: 'device-gaming',
		component: PageDeviceGamingComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService],
		data: {
			pageName: 'Device.MyDevice'
		}
	}, {
		path: 'device/device-settings',
		component: PageDeviceSettingsComponent,
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
		path: 'device/smart-assist',
		component: PageSmartAssistComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService],
		data: {
			pageName: 'Device.MyDeviceSettings'
		}
	},
	{
		path: 'device/system-updates',
		component: PageDeviceUpdatesComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService],
		data: {
			pageName: 'Device.SystemUpdate'
		}
	}, {
		path: 'security',
		component: PageSecurityComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService],
		data: {
			pageName: 'Security.MySecurity'
		}

	}, {
		path: 'security/anti-virus',
		component: PageSecurityAntivirusComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService],
		data: {
			pageName: 'Security.AntiVirus',
			pageContent: LocalStorageKey.SecurityCurrentPage
		}
	}, {
		path: 'security/wifi-security',
		component: PageSecurityWifiComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService],
		data: {
			pageName: 'Security.WifiSecurity'
		}
	}, {
		path: 'security/password-protection',
		component: PageSecurityPasswordComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService],
		data: {
			pageName: 'Security.PasswordProtection'
		}
	}, {
		path: 'security/internet-protection',
		component: PageSecurityInternetComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService],
		data: {
			pageName: 'Security.InternetProtection'
		}
	}, {
		path: 'security/windows-hello',
		component: PageSecurityWindowsHelloComponent,
		canActivate: [GuardService, WindowsHelloGuardService],
		canDeactivate: [GuardService],
		data: {
			pageName: 'Security.WindowsHello'
		}
	}, {
		path: 'support',
		component: PageSupportComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService],
		data: {
			pageName: 'Page.Support'
		}
	}, {
		path: 'support-detail/:id',
		component: PageSupportDetailComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService],
		data: {
			pageName: 'Support.Detail'
		}
	}, {
		path: 'home-security',
		component: PageConnectedHomeSecurityComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService],
		data: {
			pageName: 'ConnectedHomeSecurity'
		}
	}, {
		path: 'user',
		component: PageUserComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService],
		data: {
			pageName: 'User'
		}
	}, {
		path: 'autoclose',
		component: PageAutocloseComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService],
		data: {
			pageName: 'AutoClose'
		}
	}, {
		path: 'networkboost',
		component: PageNetworkBoostComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService],
		data: {
			pageName: 'NetworkBoost'
		}
	}, {
		path: 'settings',
		component: PageSettingsComponent,
		data: {
			pageName: 'Page.Settings'
		}
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled' })
	],
	exports: [
		RouterModule
	]
})
export class AppRoutingModule { }
