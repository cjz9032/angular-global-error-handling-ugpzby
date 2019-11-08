import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageConnectedHomeSecurityComponent } from '../../components/pages/page-connected-home-security/page-connected-home-security.component';
import { GuardService } from 'src/app/services/guard/guardService.service';
import { HomeSecurityGuardService } from 'src/app/services/guard/home-securiry-guardService.service';

const routes: Routes = [
	{
		path: '',
		component: PageConnectedHomeSecurityComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService, HomeSecurityGuardService],
		data: {
			pageName: 'HomeSecurity'
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
export class ConnectedHomeSecurityRoutingModule { }
