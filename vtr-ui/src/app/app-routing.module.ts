import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
import {PageGuardService} from "./guards/page-guard.service";
import { PrivacyModule } from './components/pages/page-privacy/privacy.module';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'dashboard',
		pathMatch: 'full'
	}, {
		path: 'dashboard',
		component: PageDashboardComponent,
		canDeactivate:[PageGuardService],
		canActivate:[PageGuardService],
		data: {
			pageName: 'Dashboard'
		}
	}, {
		path: 'device',
		component: PageDeviceComponent,
		canDeactivate:[PageGuardService],
		canActivate:[PageGuardService],
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
		canDeactivate:[PageGuardService],
		canActivate:[PageGuardService],
		children: [
			{
				path: '',
				redirectTo: 'power',
				pathMatch: 'full'
			},
			{
				path: 'power',
				component: SubpageDeviceSettingsPowerComponent,
				canDeactivate:[PageGuardService],
				canActivate:[PageGuardService],
				data: {
					pageName: 'Device.MyDeviceSettings'
				}
			},
			{
				path: 'audio',
				component: SubpageDeviceSettingsAudioComponent,
				canDeactivate:[PageGuardService],
				canActivate:[PageGuardService],
				data: {
					pageName: 'Device.MyDeviceSettings'
				}
			},

			{
				path: 'display-camera',
				component: SubpageDeviceSettingsDisplayComponent,
				canDeactivate:[PageGuardService],
				canActivate:[PageGuardService],
				data: {
					pageName: 'Device.MyDeviceSettings'
				}
			}
		]
	}, {
		path: 'device/system-updates',
		component: PageDeviceUpdatesComponent,
		canDeactivate:[PageGuardService],
		canActivate:[PageGuardService],
		data: {
			pageName: 'Device.SystemUpdate'
		}
	}, {
		path: 'security',
		component: PageSecurityComponent,
		canDeactivate:[PageGuardService],
		canActivate:[PageGuardService],
		data: { pageName: 'Security.MySecurity' }

	}, {
		path: 'security/anti-virus',
		component: PageSecurityAntivirusComponent,
		canDeactivate:[PageGuardService],
		canActivate:[PageGuardService],
		data: {
			pageName: 'Security.AntiVirus'
		}
	}, {
		path: 'security/wifi-security',
		component: PageSecurityWifiComponent,
		canDeactivate:[PageGuardService],
		canActivate:[PageGuardService],
		data: {
			pageName: 'Security.WifiSecurity'
		}
	}, {
		path: 'security/password-protection',
		component: PageSecurityPasswordComponent,
		canDeactivate:[PageGuardService],
		canActivate:[PageGuardService],
		data: {
			pageName: 'Security.PasswordProtection'
		}
	}, {
		path: 'security/internet-protection',
		component: PageSecurityInternetComponent,
		canDeactivate:[PageGuardService],
		canActivate:[PageGuardService],
		data: {
			pageName: 'Security.InternetProtection'
		}
	}, {
		path: 'security/windows-hello',
		component: PageSecurityWindowsHelloComponent,
		canActivate: [PageGuardService,WindowsHelloGuardService],
		canDeactivate:[PageGuardService],

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
		canDeactivate:[PageGuardService],
		canActivate:[PageGuardService],
		data: {
			pageName: 'Page.Support'
		}
	}, {
		path: 'support-detail/:id',
		component: PageSupportDetailComponent,
		canDeactivate:[PageGuardService],
		canActivate:[PageGuardService],
		data: {
			pageName: 'Support.Detail'
		}
	}, {
		path: 'user',
		component: PageUserComponent,
		canDeactivate:[PageGuardService],
		canActivate:[PageGuardService],
		data: {
			pageName: 'User'
		}
	}, {
		path: 'privacy',
		loadChildren: () => PrivacyModule,
		data: {
			pageName: 'Page.Privacy'
		}
	},
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
