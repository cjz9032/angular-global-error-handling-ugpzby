import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageAppsForYouComponent } from '../../components/pages/page-apps-for-you/page-apps-for-you.component';
import { GuardService } from 'src/app/services/guard/guardService.service';
import { NonArmGuard } from 'src/app/services/guard/non-arm-guard';
import { NonSmodeGuard } from 'src/app/services/guard/non-smode-guard';
import { NonShellGuard } from 'src/app/services/guard/non-shell-guard';

const routes: Routes = [
	{
		path: '',
		component: PageAppsForYouComponent,
		canDeactivate: [GuardService],
		canActivate: [NonShellGuard, GuardService, NonArmGuard, NonSmodeGuard],
		data: {
			pageName: 'AppsForYou',
		},
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AppsForYouRoutingModule {}
