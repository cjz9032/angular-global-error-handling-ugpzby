import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageSmartPerformanceComponent } from 'src/app/components/pages/page-smart-performance/page-smart-performance.component';
import { GuardService } from 'src/app/services/guard/guardService.service';
import { SmartPerformanceGuard } from 'src/app/services/guard/smart-performance-guard';

const routes: Routes = [
	{
		path: '',
		component: PageSmartPerformanceComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService, SmartPerformanceGuard],
		data: {
			pageName: 'Page.Support.SmartPerformance',
			pageContent: 'Smart Performance'
		}
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SmartPerformanceRoutingModule { }
