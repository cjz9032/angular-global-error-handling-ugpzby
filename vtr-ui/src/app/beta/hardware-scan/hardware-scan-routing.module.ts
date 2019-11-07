import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageHardwareScanComponent } from './page-hardwarescan/page-hardware-scan.component';
import { HardwareComponentsComponent } from './page-hardwarescan/children/hardware-components/hardware-components.component';
import { RecoverBadSectorsComponent } from './page-hardwarescan/children/recover-bad-sectors/recover-bad-sectors.component';
import { HardwareViewResultsComponent } from './page-hardwarescan/children/hardware-view-results/hardware-view-results.component';

import { HardwareScanGuard } from './guard/hardware-scan-guard';
import { GuardService } from 'src/app/services/guard/security-guardService.service';

const routes: Routes = [
	{
		path: 'hardware-scan',
		component: PageHardwareScanComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService, HardwareScanGuard],
		data: {
			pageName: 'Device.HardwareScan'
		},
		children: [
			{
				path: '',
				component: HardwareComponentsComponent,
				canDeactivate: [GuardService],
				canActivate: [GuardService, HardwareScanGuard],
				data: {
					pageName: 'Device.HardwareScan'
				}
			},
			{
				path: 'recover-bad-sectors',
				component: RecoverBadSectorsComponent,
				canDeactivate: [GuardService],
				canActivate: [GuardService, HardwareScanGuard],
				data: {
					pageName: 'Device.HardwareScan'
				}
			},
			{
				path: 'view-results',
				component: HardwareViewResultsComponent,
				canDeactivate: [GuardService],
				canActivate: [GuardService, HardwareScanGuard],
				data: {
					pageName: 'Device.HardwareScan'
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
