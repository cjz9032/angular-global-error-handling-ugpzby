import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageSupportComponent } from '../../components/pages/page-support/page-support.component';
import { GuardService } from 'src/app/services/guard/guardService.service';
import { NonArmGuard } from 'src/app/services/guard/non-arm-guard';
import { PageContentLibraryComponent } from 'src/app/components/pages/page-content-library/page-content-library.component';
import { ContentLibraryGuard } from 'src/app/services/guard/content-library-guard';

const routes: Routes = [
	{
		path: '',
		component: PageSupportComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService, NonArmGuard],
		data: {
			pageName: 'Page.Support',
		},
	},
	{
		path: 'content-library',
		component: PageContentLibraryComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService, ContentLibraryGuard, NonArmGuard],
		data: {
			pageName: 'ContentLibrary',
		},
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SupportRoutingModule { }
