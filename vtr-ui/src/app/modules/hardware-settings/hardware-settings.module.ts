import { SettingsPageLayoutModule } from './../../components/settings-page-layout/settings-page-layout.module';
import { ActiveProtectionSystemAdvancedComponent } from 'src/app/components/pages/page-smart-assist/active-protection-system-advanced/active-protection-system-advanced.component';
import { ActiveProtectionSystemComponent } from 'src/app/components/pages/page-smart-assist/active-protection-system/active-protection-system.component';
import { AutoupdateSettingsComponent } from 'src/app/components/pages/page-device-updates/children/autoupdate-settings/autoupdate-settings.component';
import { AvailableUpdatesComponent } from 'src/app/components/pages/page-device-updates/children/available-updates/available-updates.component';
import { BaseCameraDetail } from 'src/app/services/camera/camera-detail/base-camera-detail.service';
import { BatteryCardComponent } from 'src/app/components/battery/battery-card/battery-card.component';
import { BatteryChargeThresholdSettingsComponent } from 'src/app/components/battery/battery-charge-threshold-settings/battery-charge-threshold-settings.component';
import { BatteryDetailComponent } from 'src/app/components/battery/battery-detail/battery-detail.component';
import { BatteryIndicatorComponent } from 'src/app/components/battery/battery-indicator/battery-indicator.component';
import { CameraBackgroundBlurComponent } from 'src/app/components/camera-background-blur/camera-background-blur.component';
import { CameraControlComponent } from 'src/app/components/camera-control/camera-control.component';
import { CameraDetailMockService } from 'src/app/services/camera/camera-detail/camera-detail.mock.service';
import { ClockComponent } from 'src/app/components/clock/clock.component';
import { CommonModule } from '@angular/common';
import { CommonUiModule } from '../common/common-ui.module';
import { CommonWidgetModule } from '../common/common-widget.module';
import { ContainerCardModule } from 'src/app/components/container-card/container-card.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { DisplayColorTempComponent } from 'src/app/components/display/display-color-temp/display-color-temp.component';
import { DolbyModesTranslationPipe } from 'src/app/pipe/dolby-modes-translation.pipe';
import { EyeCareModeComponent } from 'src/app/components/display/eye-care-mode/eye-care-mode.component';

import { HardwareSettingRoutingModule } from './hardware-settings-routing.module';
import { HeaderMainModule } from 'src/app/components/header-main/header-main.module';
import { InstallationHistoryComponent } from 'src/app/components/pages/page-device-updates/children/installation-history/installation-history.component';
import { IntelligentMediaComponent } from 'src/app/components/pages/page-smart-assist/intelligent-media/intelligent-media.component';
import { MetricsModule } from 'src/app/directives/metrics.module';
import { NgbDropdownModule, NgbTooltipModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { OledPowerSettingsComponent } from 'src/app/components/display/oled-power-settings/oled-power-settings.component';
import { PageDeviceComponent } from 'src/app/components/pages/page-device/page-device.component';
import { PageDeviceSettingsComponent } from 'src/app/components/pages/page-device-settings/page-device-settings.component';
import { PageDeviceUpdatesComponent } from 'src/app/components/pages/page-device-updates/page-device-updates.component';
import { PageHardwarescanComponent } from 'src/app/components/pages/page-hardwarescan/page-hardwarescan.component';
import { PageQuestionsComponent } from 'src/app/components/pages/page-questions/page-questions.component';
import { PageSmartAssistComponent } from 'src/app/components/pages/page-smart-assist/page-smart-assist.component';
import { PageSupportDetailComponent } from 'src/app/components/pages/page-support-detail/page-support-detail.component';
import { PowerSmartSettingsComponent } from 'src/app/components/widgets/power-smart-settings/power-smart-settings.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared.module';
import { SmartStandbyComponent } from 'src/app/components/pages/page-device-settings/children/subpage-device-settings-power/smart-standby/smart-standby.component';
import { SpinnerComponent } from 'src/app/components/common/spinner/spinner.component';
import { SubpageDeviceSettingsAudioComponent } from 'src/app/components/pages/page-device-settings/children/subpage-device-settings-audio/subpage-device-settings-audio.component';
import { SubpageDeviceSettingsDisplayComponent } from 'src/app/components/pages/page-device-settings/children/subpage-device-settings-display/subpage-device-settings-display.component';
import { SubpageDeviceSettingsInputAccessoryComponent } from 'src/app/components/pages/page-device-settings/children/subpage-device-settings-input-accessory/subpage-device-settings-input-accessory.component';
import { SubpageDeviceSettingsPowerComponent } from 'src/app/components/pages/page-device-settings/children/subpage-device-settings-power/subpage-device-settings-power.component';
import { UserDefinedKeyComponent } from 'src/app/components/pages/page-device-settings/children/subpage-device-settings-input-accessory/user-defined-key/user-defined-key.component';
import { TopRowFunctionsComponent } from 'src/app/components/pages/page-device-settings/children/subpage-device-settings-input-accessory/top-row-functions/top-row-functions.component';
import { VoiceComponent } from 'src/app/components/pages/page-smart-assist/voice/voice.component';
import { WidgetOfflineModule } from 'src/app/components/widgets/widget-offline-info/widget-offline.module';
import { WidgetSecurityStatusModule } from 'src/app/components/widgets/widget-security-status/widget-security-status.module';
import { CommonModalModule } from '../common/common-modal.module';
import { PageLayoutModule } from 'src/app/components/page-layout/page-layout.module';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUsb } from '@fortawesome/free-brands-svg-icons/faUsb';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faBatteryThreeQuarters } from '@fortawesome/free-solid-svg-icons/faBatteryThreeQuarters';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faChevronCircleUp } from '@fortawesome/pro-light-svg-icons/faChevronCircleUp';
import { faPlane } from '@fortawesome/pro-light-svg-icons/faPlane';
import { faThumbtack } from '@fortawesome/pro-light-svg-icons/faThumbtack';
import { faBatteryHalf } from '@fortawesome/pro-light-svg-icons/faBatteryHalf';
import { faBatteryFull } from '@fortawesome/pro-light-svg-icons/faBatteryFull';
import { faBatteryBolt } from '@fortawesome/pro-light-svg-icons/faBatteryBolt';
import { faQuestionCircle, faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import { faBatteryQuarter } from '@fortawesome/pro-light-svg-icons/faBatteryQuarter';
import { faTachometerFast } from '@fortawesome/pro-light-svg-icons/faTachometerFast';
import { faMicrophone } from '@fortawesome/pro-light-svg-icons/faMicrophone';
import { faKeyboard } from '@fortawesome/pro-light-svg-icons/faKeyboard';
import { faEye } from '@fortawesome/pro-light-svg-icons/faEye';
import { faTv } from '@fortawesome/pro-light-svg-icons/faTv';
import { faCamera } from '@fortawesome/pro-light-svg-icons/faCamera';
import { faGem } from '@fortawesome/pro-light-svg-icons/faGem';
import { faChevronDown } from '@fortawesome/pro-light-svg-icons/faChevronDown';
import { faChevronUp } from '@fortawesome/pro-light-svg-icons/faChevronUp';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons/faMinusCircle';
import { faCheck as falCheck } from '@fortawesome/pro-light-svg-icons/faCheck';
import { faTimes as falTimes } from '@fortawesome/pro-light-svg-icons/faTimes';
import { faCircle } from '@fortawesome/pro-light-svg-icons/faCircle';
import { faBriefcase } from '@fortawesome/pro-light-svg-icons/faBriefcase';
import { faCircle as falCircle } from '@fortawesome/free-solid-svg-icons/faCircle';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons/faCircleNotch';
import { faSync } from '@fortawesome/pro-light-svg-icons/faSync';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons/faAngleRight';
import { BatteryGaugeResetComponent } from 'src/app/components/pages/page-device-settings/children/subpage-device-settings-power/battery-gauge-reset/battery-gauge-reset.component';

library.add(faCheck);
library.add(faBriefcase);
library.add(faCheckCircle);
library.add(faChevronCircleUp);
library.add(faPlane);
library.add(faThumbtack);
library.add(faQuestionCircle);
library.add(faBatteryHalf);
library.add(faBatteryFull);
library.add(faBatteryBolt);
library.add(faBatteryQuarter);
library.add(faUsb);
library.add(faTachometerFast);
library.add(faMicrophone);
library.add(faKeyboard);
library.add(faEye);
library.add(faTv);
library.add(faCamera);
library.add(faGem);
library.add(faBatteryThreeQuarters);
library.add(faChevronDown);
library.add(faChevronUp);
library.add(faCaretUp);
library.add(faCaretDown);
library.add(faTimesCircle);
library.add(faPlusCircle);
library.add(faMinusCircle);
library.add(falCheck);
library.add(falTimes);
library.add(faCircle);
library.add(falCircle);
library.add(faSync);
library.add(faCircleNotch);
library.add(faAngleRight);
library.add(faCalendarAlt);

@NgModule({
	declarations: [
		ActiveProtectionSystemAdvancedComponent,
		ActiveProtectionSystemComponent,
		AutoupdateSettingsComponent,
		AvailableUpdatesComponent,
		BatteryCardComponent,
		BatteryChargeThresholdSettingsComponent,
		BatteryDetailComponent,
		BatteryIndicatorComponent,
		CameraBackgroundBlurComponent,
		CameraControlComponent,
		ClockComponent,
		DisplayColorTempComponent,
		DolbyModesTranslationPipe,
		EyeCareModeComponent,
		InstallationHistoryComponent,
		IntelligentMediaComponent,
		OledPowerSettingsComponent,
		PageDeviceComponent,
		PageDeviceSettingsComponent,
		PageDeviceUpdatesComponent,
		PageHardwarescanComponent,
		PageQuestionsComponent,
		PageSmartAssistComponent,
		PageSupportDetailComponent,
		PowerSmartSettingsComponent,
		SmartStandbyComponent,
		BatteryGaugeResetComponent,
		SpinnerComponent,
		SubpageDeviceSettingsAudioComponent,
		SubpageDeviceSettingsDisplayComponent,
		SubpageDeviceSettingsInputAccessoryComponent,
		SubpageDeviceSettingsPowerComponent,
		UserDefinedKeyComponent,
		TopRowFunctionsComponent,
		VoiceComponent
	],
	imports: [
		CommonModule,
		CommonUiModule,
		CommonWidgetModule,
		CommonModalModule,
		SharedModule,
		HardwareSettingRoutingModule,
		FontAwesomeModule,
		ContainerCardModule,
		MetricsModule,
		NgbTooltipModule,
		HeaderMainModule,
		WidgetOfflineModule,
		WidgetSecurityStatusModule,
		NgbDropdownModule,
		RouterModule,
		NgbCollapseModule,
		PageLayoutModule,
		SettingsPageLayoutModule,
	],
	exports: [
		CommonModule,
		CommonUiModule,
		CommonWidgetModule,
		CommonModalModule,
		PageLayoutModule,
		SettingsPageLayoutModule,
		RouterModule
	],
	providers: [{ provide: BaseCameraDetail, useClass: CameraDetailMockService }],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class HardwareSettingsModule { }
