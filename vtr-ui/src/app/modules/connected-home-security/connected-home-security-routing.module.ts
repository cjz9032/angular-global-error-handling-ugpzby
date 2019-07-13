import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageConnectedHomeSecurityComponent } from '../../components/pages/page-connected-home-security/page-connected-home-security.component';

const routes: Routes = [
	{
		path: '',
		component: PageConnectedHomeSecurityComponent,
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
export class ConnectedHomeSecurityRoutingModule { }
