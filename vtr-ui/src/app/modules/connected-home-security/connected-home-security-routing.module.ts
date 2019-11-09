import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageConnectedHomeSecurityComponent } from '../../components/pages/page-connected-home-security/page-connected-home-security.component';
import { GuardService } from 'src/app/services/guard/guardService.service';
import { HomeSecurityGuard } from 'src/app/services/guard/home-securiry-guard';
import { NoneGamingGuard } from 'src/app/services/guard/none-gaming-guard';
import { NoneArmGuard } from 'src/app/services/guard/none-arm-guard';
import { NoneSmodeGuard } from 'src/app/services/guard/none-smode-guard';
import { NoneThinkGuard } from 'src/app/services/guard/none-think-guard';

const routes: Routes = [
	{
		path: '',
		component: PageConnectedHomeSecurityComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService,
			NoneGamingGuard,
			NoneArmGuard,
			NoneSmodeGuard,
			NoneThinkGuard,
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
