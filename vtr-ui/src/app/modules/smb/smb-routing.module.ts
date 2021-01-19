import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageMeetingExpirienceComponent } from "src/app/components/pages/page-meeting-expirience/page-meeting-expirience.component";
import { SubpageMeetingManagerComponent } from "src/app/components/pages/page-meeting-expirience/children/subpage-meeting-manager/subpage-meeting-manager.component";
import { PageCreatorCentreComponent } from "src/app/components/pages/page-creator-centre/page-creator-centre.component";
import { SubpageCreatorSettingsComponent } from "src/app/components/pages/page-creator-centre/children/subpage-creator-settings/subpage-creator-settings.component";
import { SubpageEasyRenderingComponent } from "src/app/components/pages/page-creator-centre/children/subpage-easy-rendering/subpage-easy-rendering.component";
import { SubpageColorCalibrationComponent } from "src/app/components/pages/page-creator-centre/children/subpage-color-calibration/subpage-color-calibration.component";

const routes: Routes = [
  {
		path: 'meeting-experience',
		component: PageMeetingExpirienceComponent,
		children: [
			{
				path: '',
				redirectTo: 'meeting-manager',
				pathMatch: 'full',
			},
			{
				path: 'meeting-manager',
				component: SubpageMeetingManagerComponent,
			}			
		],
  },
  {
		path: 'creator-centre',
		component: PageCreatorCentreComponent,
		children: [
			{
				path: '',
				redirectTo: 'creator-settings',
				pathMatch: 'full',
			},
			{
				path: 'creator-settings',
				component: SubpageCreatorSettingsComponent,
			},
			{
				path: 'easy-rendering',
				component: SubpageEasyRenderingComponent,
			},
			{
				path: 'color-calibration',
				component: SubpageColorCalibrationComponent,
			
			}				
		],
	}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmbRoutingModule { }
