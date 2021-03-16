import { GuardService } from 'src/app/services/guard/guardService.service';
import { NgModule } from '@angular/core';
import { PageDeviceUpdatesComponent } from 'src/app/components/pages/page-device-updates/page-device-updates.component';
import { RouterModule, Routes } from '@angular/router';
import { NonArmGuard } from 'src/app/services/guard/non-arm-guard';
import { NonSmodeGuard } from 'src/app/services/guard/non-smode-guard';
import { NonShellGuard } from 'src/app/services/guard/non-shell-guard';

const routes: Routes = [
	{
		path: 'system-updates',
		component: PageDeviceUpdatesComponent,
		canDeactivate: [GuardService],
		canActivate: [NonShellGuard, GuardService, NonArmGuard, NonSmodeGuard],
		data: {
			pageName: 'Device.SystemUpdate',
			pageContent: 'My Device Status',
		},
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SystemUpdateRoutingModule {}
