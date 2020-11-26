import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuardService } from 'src/app/services/guard/guardService.service';
import { SnapshotGuard } from 'src/app/services/guard/snapshot-guard';
import { SnapshotMainComponent } from './components/main/snapshot-main.component';
import { PageSnapshotComponent } from './pages/page-snapshot.component';

const routes: Routes = [
	{
		path: '',
		component: PageSnapshotComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService, SnapshotGuard],
		data: {
			pageName: 'Snapshot'
		},
		children: [
			{
				path: '',
				component: SnapshotMainComponent,
				// canDeactivate: [GuardService],
				// canActivate: [GuardService],
				data: {
					pageName: 'Snapshot'
				}
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SnapshotRoutingModule {}
