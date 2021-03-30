import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardService } from 'src/app/services/guard/guardService.service';
import { NonShellGuard } from 'src/app/services/guard/non-shell-guard';
import { PageSmartPrivacyComponent } from '../../components/pages/page-smart-privacy/page-smart-privacy.component';

const routes: Routes = [
	{
		path: '',
		component: PageSmartPrivacyComponent,
		canDeactivate: [GuardService],
		canActivate: [NonShellGuard, GuardService],
		data: {
			pageName: 'Page.Support.SmartPrivacy',
			pageContent: 'Smart Privacy',
		},
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SmartPrivacyRoutingModule {}
