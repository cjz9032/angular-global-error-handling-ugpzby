import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageMeetingExpirienceComponent } from 'src/app/components/pages/page-meeting-expirience/page-meeting-expirience.component';
import { SubpageMeetingManagerComponent } from 'src/app/components/pages/page-meeting-expirience/children/subpage-meeting-manager/subpage-meeting-manager.component';
import { PageCreatorCentreComponent } from 'src/app/components/pages/page-creator-centre/page-creator-centre.component';
import { SubpageCreatorSettingsComponent } from 'src/app/components/pages/page-creator-centre/children/subpage-creator-settings/subpage-creator-settings.component';
import { SubpageEasyRenderingComponent } from 'src/app/components/pages/page-creator-centre/children/subpage-easy-rendering/subpage-easy-rendering.component';
import { SubpageColorCalibrationComponent } from 'src/app/components/pages/page-creator-centre/children/subpage-color-calibration/subpage-color-calibration.component';
import { GuardService } from 'src/app/services/guard/guardService.service';
import { NonArmGuard } from 'src/app/services/guard/non-arm-guard';

const routes: Routes = [
	{
		path: '',
		component: PageMeetingExpirienceComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService, NonArmGuard],
	},
	{
		path: 'meeting-experience',
		component: PageMeetingExpirienceComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService, NonArmGuard],
		children: [
			{
				path: '',
				redirectTo: 'meeting-manager',
				pathMatch: 'full',
			},
			{
				path: 'meeting-manager',
				component: SubpageMeetingManagerComponent,
				canDeactivate: [GuardService],
				canActivate: [GuardService, NonArmGuard],
				data: {
					pageName: 'smb.meeting-manager',
				},
			},
		],
	},
	{
		path: 'creator-centre',
		component: PageCreatorCentreComponent,
		canDeactivate: [GuardService],
		canActivate: [GuardService, NonArmGuard],
		children: [
			{
				path: '',
				redirectTo: 'creator-settings',
				pathMatch: 'full',
			},
			{
				path: 'creator-settings',
				component: SubpageCreatorSettingsComponent,
				canDeactivate: [GuardService],
				canActivate: [GuardService, NonArmGuard],
				data: {
					pageName: 'smb.creator-settings',
				},
			},
			{
				path: 'easy-rendering',
				component: SubpageEasyRenderingComponent,
				canDeactivate: [GuardService],
				canActivate: [GuardService, NonArmGuard],
				data: {
					pageName: 'smb.easy-rendering',
				},
			},
			{
				path: 'color-calibration',
				component: SubpageColorCalibrationComponent,
				canDeactivate: [GuardService],
				canActivate: [GuardService, NonArmGuard],
				data: {
					pageName: 'smb.color-calibration',
				},
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SmbRoutingModule {}
