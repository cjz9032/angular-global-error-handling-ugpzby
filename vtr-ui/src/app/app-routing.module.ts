import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageDashboardComponent } from './components/pages/page-dashboard/page-dashboard.component';
import { PageDeviceComponent } from './components/pages/page-device/page-device.component';
import { PageDeviceSettingsComponent } from './components/pages/page-device-settings/page-device-settings.component';
import { PageDeviceUpdatesComponent } from './components/pages/page-device-updates/page-device-updates.component';
import { PageSecurityComponent } from './components/pages/page-security/page-security.component';
import { PageSecurityAntivirusComponent } from './components/pages/page-security-antivirus/page-security-antivirus.component';
import { PageSecurityWifiComponent } from './components/pages/page-security-wifi/page-security-wifi.component';
import { PageSecurityPasswordComponent } from './components/pages/page-security-password/page-security-password.component';
import { PageSecurityInternetComponent } from './components/pages/page-security-internet/page-security-internet.component';
import { PageSupportComponent } from './components/pages/page-support/page-support.component';
import { PageUserComponent } from './components/pages/page-user/page-user.component';

const routes: Routes = [
	{
		path: '',
		component: PageDashboardComponent
	}, {
		path: 'dashboard',
		component: PageDashboardComponent
	}, {
		path: 'device',
		component: PageDeviceComponent
	}, {
		path: 'device-settings',
		component: PageDeviceSettingsComponent
	}, {
		path: 'system-updates',
		component: PageDeviceUpdatesComponent
	}, {
		path: 'security',
		component: PageSecurityComponent
	}, {
		path: 'anti-virus',
		component: PageSecurityAntivirusComponent
	}, {
		path: 'wifi-security',
		component: PageSecurityWifiComponent
	}, {
		path: 'password-protection',
		component: PageSecurityPasswordComponent
	}, {
		path: 'internet-protection',
		component: PageSecurityInternetComponent
	}, {
		path: 'support',
		component: PageSupportComponent
	}, {
		path: 'user',
		component: PageUserComponent
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { useHash: true })
	],
	exports: [
		RouterModule
	]
})
export class AppRoutingModule { }
