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
import { CommonWidgetModule } from '../common/common-widget.module';
import { UiCustomSliderModule } from '../../components/ui/ui-custom-slider/ui-custom-slider.module';
import { AudioVendorService } from '../../components/pages/page-device-settings/children/subpage-device-settings-audio/audio-vendor.service';
import { AudioVendorFactory } from '../../components/pages/page-device-settings/children/subpage-device-settings-audio/audio-vendor.factory';
import { FORTE_CLIENT } from '../../components/pages/page-device-settings/children/subpage-device-settings-audio/forte-client';
import { DOLBY_FUSION_CLIENT } from '../../components/pages/page-device-settings/children/subpage-device-settings-audio/dolby-fusion-client';
import { VantageShellService } from '../../services/vantage-shell/vantage-shell.service';
import { DeviceService } from '../../services/device/device.service';
import { MatButtonModule } from '@lenovo/material/button';
import { MatTooltipModule } from '@lenovo/material/tooltip';
import { PromotionBannerComponent } from 'src/app/components/pages/page-creator-centre/children/promotion-banner/promotion-banner.component';
import { SharedModule } from '../shared.module';
import { ContainerCardModule } from 'src/app/components/container-card/container-card.module';


@NgModule({
	declarations: [
		PageMeetingExpirienceComponent,
		SubpageMeetingManagerComponent,
		PageCreatorCentreComponent,
		SubpageCreatorSettingsComponent,
		SubpageEasyRenderingComponent,
		SubpageColorCalibrationComponent,
		ColorSettingsComponent,
		IntelligentPerformanceComponent,
		PromotionBannerComponent,
	],
	imports: [
		CommonModule,
		CommonUiModule,
		ContainerCardModule,
		SharedModule,
		SmbRoutingModule,
		PageLayoutModule,
		TranslationModule.forChild(),
		CommonWidgetModule,
		UiCustomSliderModule,
		MatButtonModule,
		MatTooltipModule,
	],
	providers: [
		{
			provide: AudioVendorService,
			useFactory: AudioVendorFactory,
			deps: [FORTE_CLIENT, DOLBY_FUSION_CLIENT, VantageShellService, DeviceService],
		},
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class SmbModule { }
