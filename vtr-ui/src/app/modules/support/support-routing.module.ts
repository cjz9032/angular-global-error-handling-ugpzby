import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageSupportComponent } from '../../components/pages/page-support/page-support.component';
import { GuardService } from 'src/app/services/guard/security-guardService.service';

const routes: Routes = [
	{
		path: '',
		component: PageSupportComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService],
		data: {
			pageName: 'Page.Support'
		}
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(routes)
	],
	exports: [
		RouterModule
	]
})
export class SupportRoutingModule { }
