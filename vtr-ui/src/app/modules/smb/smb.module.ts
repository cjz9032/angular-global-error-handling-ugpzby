import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutModule } from 'src/app/components/page-layout/page-layout.module';
import { TranslationModule } from '../translation.module';
import { SmbRoutingModule } from './smb-routing.module';
import { PageMeetingExpirienceComponent } from 'src/app/components/pages/page-meeting-expirience/page-meeting-expirience.component';
import { SubpageMeetingManagerComponent } from 'src/app/components/pages/page-meeting-expirience/children/subpage-meeting-manager/subpage-meeting-manager.component';
import { PageCreatorCentreComponent } from 'src/app/components/pages/page-creator-centre/page-creator-centre.component';
import { SubpageCreatorSettingsComponent } from 'src/app/components/pages/page-creator-centre/children/subpage-creator-settings/subpage-creator-settings.component';
import { SubpageEasyRenderingComponent } from 'src/app/components/pages/page-creator-centre/children/subpage-easy-rendering/subpage-easy-rendering.component';
import { SubpageColorCalibrationComponent } from 'src/app/components/pages/page-creator-centre/children/subpage-color-calibration/subpage-color-calibration.component';
import { CommonUiModule } from '../common/common-ui.module';
import { ColorSettingsComponent } from 'src/app/components/pages/page-creator-centre/children/subpage-creator-settings/color-settings/color-settings.component';
import { IntelligentPerformanceComponent } from 'src/app/components/pages/page-creator-centre/children/subpage-creator-settings/intelligent-performance/intelligent-performance.component';


@NgModule({
  declarations: [
    PageMeetingExpirienceComponent,
    SubpageMeetingManagerComponent,
    PageCreatorCentreComponent,
    SubpageCreatorSettingsComponent,
    SubpageEasyRenderingComponent,
    SubpageColorCalibrationComponent,
    ColorSettingsComponent,
    IntelligentPerformanceComponent
  ],
  imports: [
    CommonModule,
    CommonUiModule,
    SmbRoutingModule,
    PageLayoutModule,
    TranslationModule.forChild()
  ],
  exports: [
    PageLayoutModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class SmbModule { }
