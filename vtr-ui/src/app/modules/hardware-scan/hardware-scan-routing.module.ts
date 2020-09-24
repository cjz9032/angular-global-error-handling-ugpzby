import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageHardwareScanComponent } from '../../components/pages/page-hardwarescan/page-hardware-scan.component';
import { HardwareComponentsComponent } from '../../components/pages/page-hardwarescan/children/hardware-components/hardware-components.component';
import { HardwareViewResultsComponent } from '../../components/pages/page-hardwarescan/children/hardware-view-results/hardware-view-results.component';

import { HardwareScanGuard } from '../../services/guard/hardware-scan-guard';
import { GuardService } from 'src/app/services/guard/guardService.service';

const routes: Routes = [
	{
		path: '',
		component: PageHardwareScanComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService, HardwareScanGuard],
		data: {
			pageName: 'HardwareScan'
		},
		children: [
			{
				path: '',
				component: HardwareComponentsComponent,
				// canDeactivate: [GuardService],
				// canActivate: [GuardService],
				data: {
					pageName: 'HardwareScan'
				}
			},
			{
				path: 'view-results',
				component: HardwareViewResultsComponent,
				// canDeactivate: [GuardService],
				// canActivate: [GuardService],
				data: {
					pageName: 'HardwareScan.ViewResults'
				}
			},
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HardwareScanRoutingModule { }
