import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageDashboardAndroidComponent } from 'src/app/components/pages/page-dashboard-android/page-dashboard-android.component';

const routes: Routes = [
	{
		path: '',
		component: PageDashboardAndroidComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AndroidDashboardRoutingModule {}
