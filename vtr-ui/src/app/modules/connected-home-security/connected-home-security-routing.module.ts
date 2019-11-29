import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageConnectedHomeSecurityComponent } from '../../components/pages/page-connected-home-security/page-connected-home-security.component';
import { GuardService } from 'src/app/services/guard/guardService.service';
import { HomeSecurityGuard } from 'src/app/services/guard/home-securiry-guard';
import { NonGamingGuard } from 'src/app/services/guard/non-gaming-guard';
import { NonArmGuard } from 'src/app/services/guard/non-arm-guard';
import { NonSmodeGuard } from 'src/app/services/guard/non-smode-guard';
import { NonCommercialGuard } from 'src/app/services/guard/non-commercial-guard';

const routes: Routes = [
	{
		path: '',
		component: PageConnectedHomeSecurityComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService,
			NonGamingGuard,
			NonArmGuard,
			NonSmodeGuard,
			NonCommercialGuard,
			HomeSecurityGuard],
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
