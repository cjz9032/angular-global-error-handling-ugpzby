import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageDashboardComponent } from './components/pages/page-dashboard/page-dashboard.component';
import { PageDeviceComponent } from './components/pages/page-device/page-device.component';
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
import { PageSupportComponent } from './components/pages/page-support/page-support.component';
import { PageSupportDetailComponent } from './components/pages/page-support-detail/page-support-detail.component';
import { PageUserComponent } from './components/pages/page-user/page-user.component';
import { PageSecurityWindowsHelloComponent } from './components/pages/page-security-windows-hello/page-security-windows-hello.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'dashboard',
		pathMatch: 'full'
	}, {
		path: 'dashboard',
		component: PageDashboardComponent
	}, {
		path: 'device',
		component: PageDeviceComponent
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
				component: SubpageDeviceSettingsPowerComponent
			},
			{
				path: 'audio',
				component: SubpageDeviceSettingsAudioComponent
			},
			{
				path: 'display-camera',
				component: SubpageDeviceSettingsDisplayComponent
			}
		]
	}, {
		path: 'device/system-updates',
		component: PageDeviceUpdatesComponent
	}, {
		path: 'security',
		component: PageSecurityComponent
	}, {
		path: 'security/anti-virus',
		component: PageSecurityAntivirusComponent
	}, {
		path: 'security/wifi-security',
		component: PageSecurityWifiComponent
	}, {
		path: 'security/password-protection',
		component: PageSecurityPasswordComponent
	}, {
		path: 'security/internet-protection',
		component: PageSecurityInternetComponent
	}, {
		path: 'security/windows-hello',
		component: PageSecurityWindowsHelloComponent
	}, {
		path: 'support',
		component: PageSupportComponent
	}, {
		path: 'support-detail/:id',
		component: PageSupportDetailComponent
	}, {
		path: 'user',
		component: PageUserComponent
	}, {
		path: 'privacy',
		loadChildren: './components/pages/page-privacy/privacy.module#PrivacyModule',
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
