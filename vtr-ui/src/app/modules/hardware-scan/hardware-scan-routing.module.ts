import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageHardwareScanComponent } from './pages/page-hardware-scan.component';
import { HardwareComponentsComponent } from './pages/children/hardware-components/hardware-components.component';
import { HardwareViewResultsComponent } from './pages/children/hardware-view-results/hardware-view-results.component';

import { HardwareScanGuard } from '../../services/guard/hardware-scan-guard';
import { GuardService } from 'src/app/services/guard/guardService.service';
import { NonShellGuard } from 'src/app/services/guard/non-shell-guard';

const routes: Routes = [
	{
		path: '',
		component: PageHardwareScanComponent,
		canDeactivate: [GuardService],
		canActivate: [NonShellGuard, GuardService, HardwareScanGuard],
		data: {
			pageName: 'HardwareScan',
		},
		children: [
			{
				path: '',
				component: HardwareComponentsComponent,
				// canDeactivate: [GuardService],
				// canActivate: [GuardService],
				data: {
					pageName: 'HardwareScan',
				},
			},
			{
				path: 'view-results',
				component: HardwareViewResultsComponent,
				// canDeactivate: [GuardService],
				// canActivate: [GuardService],
				data: {
					pageName: 'HardwareScan.ViewResults',
				},
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class HardwareScanRoutingModule {}
