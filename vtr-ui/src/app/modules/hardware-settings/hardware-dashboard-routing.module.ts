import { GuardService } from 'src/app/services/guard/guardService.service';
import { NgModule } from '@angular/core';
import { PageDashboardComponent } from 'src/app/components/pages/page-dashboard/page-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { NonShellGuard } from 'src/app/services/guard/non-shell-guard';

const routes: Routes = [
	{
		path: '',
		component: PageDashboardComponent,
		canDeactivate: [GuardService],
		canActivate: [NonShellGuard, GuardService],
		data: {
			pageName: 'Dashboard',
		},
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class HardwareDashboardRoutingModule {}
