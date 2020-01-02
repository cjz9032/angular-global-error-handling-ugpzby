import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageSmartPerformanceComponent } from 'src/app/components/pages/page-smart-performance/page-smart-performance.component';
import { GuardService } from 'src/app/services/guard/guardService.service';

const routes: Routes = [
	{
		path: '',
		component: PageSmartPerformanceComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService],
		data: {
			pageName: 'smart'
		}
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmartPerformanceRoutingModule { }
