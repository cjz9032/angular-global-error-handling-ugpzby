import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageDashboardComponent } from './components/pages/page-dashboard/page-dashboard.component';
import { PageDeviceComponent } from './components/pages/page-device/page-device.component';
import { PageSecurityComponent } from './components/pages/page-security/page-security.component';
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
		path: 'security',
		component: PageSecurityComponent
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
