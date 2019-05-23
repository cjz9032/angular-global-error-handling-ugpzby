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
import { SubpageDeviceSettingsSmartAssistComponent } from './components/pages/page-device-settings/children/subpage-device-settings-smart-assist/subpage-device-settings-smart-assist.component';
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
import { PrivacyModule } from './components/pages/page-privacy/privacy.module';
import { GuardService } from './services/guard/security-guardService.service';
import { LocalStorageKey } from './enums/local-storage-key.enum';
import { PageAutocloseComponent } from './components/pages/page-autoclose/page-autoclose.component';
import { PageNetworkBoostComponent } from './components/pages/page-network-boost/page-network-boost.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'dashboard',
		pathMatch: 'full'
	}, {
		path: 'dashboard',
		component: PageDashboardComponent,
		data: {
			pageName: 'Dashboard'
		}
	}, {
		path: 'macrokey',
		component: PageMacrokeyComponent,
		data: {
			pageName: 'Macrokey'
		}
	}, {
		path: 'hardwarescan',
		component: PageHardwarescanComponent,

		data: {
			pageName: 'Hardwarescan'
		}
	}, {
		path: 'lightingcustomize',
		component: PageLightingcustomizeComponent,

		data: {
			pageName: 'Lightingcustomize'
		}
	}, {
		path: 'device',
		component: PageDeviceComponent,
		data: {
			pageName: 'Device.MyDevice'
		}
	}, {
		path: 'device-gaming',
		component: PageDeviceGamingComponent,
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
				data: {
					pageName: 'Device.MyDeviceSettings'
				}
			},
			{
				path: 'audio',
				component: SubpageDeviceSettingsAudioComponent,
				data: {
					pageName: 'Device.MyDeviceSettings'
				}
			},
			{
				path: 'display-camera',
				component: SubpageDeviceSettingsDisplayComponent,
				data: {
					pageName: 'Device.MyDeviceSettings'
				}
			},
			{
				path: 'smart-assist',
				component: SubpageDeviceSettingsSmartAssistComponent,
				data: {
					pageName: 'Device.MyDeviceSettings'
				}
			}
		]
	},
	{
		path: 'device/system-updates',
		component: PageDeviceUpdatesComponent,
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
		canActivate: [WindowsHelloGuardService],
		canDeactivate: [GuardService],
		data: {
			pageName: 'Security.WindowsHello'
		}
	}, {
		path: 'security/home-security',
		component: PageSecurityHomeSecurityComponent,
		data: {
			pageName: 'Security.HomeSecurity'
		}
	}, {
		path: 'support',
		component: PageSupportComponent,
		data: {
			pageName: 'Page.Support'
		}
	}, {
		path: 'support-detail/:id',
		component: PageSupportDetailComponent,
		data: {
			pageName: 'Support.Detail'
		}
	}, {
		path: 'user',
		component: PageUserComponent,
		data: {
			pageName: 'User'
		}
	}, {
		path: 'autoclose',
		component: PageAutocloseComponent,
		data: {
			pageName: 'AutoClose'
		}
	}, {
		path: 'networkboost',
		component: PageNetworkBoostComponent,
		data: {
			pageName: 'NetworkBoost'
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
