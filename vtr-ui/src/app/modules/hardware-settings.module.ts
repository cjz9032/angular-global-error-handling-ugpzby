import { ActiveProtectionSystemAdvancedComponent } from '../components/pages/page-smart-assist/active-protection-system-advanced/active-protection-system-advanced.component';
import { ActiveProtectionSystemComponent } from '../components/pages/page-smart-assist/active-protection-system/active-protection-system.component';
import { AutoupdateSettingsComponent } from '../components/pages/page-device-updates/children/autoupdate-settings/autoupdate-settings.component';
import { AvailableUpdatesComponent } from '../components/pages/page-device-updates/children/available-updates/available-updates.component';
import { BaseCameraDetail } from '../services/camera/camera-detail/base-camera-detail.service';
import { BatteryCardComponent } from '../components/battery/battery-card/battery-card.component';
import { BatteryChargeThresholdSettingsComponent } from '../components/battery/battery-charge-threshold-settings/battery-charge-threshold-settings.component';
import { BatteryDetailComponent } from '../components/battery/battery-detail/battery-detail.component';
import { BatteryIndicatorComponent } from '../components/battery/battery-indicator/battery-indicator.component';
import { CameraBackgroundBlurComponent } from '../components/camera-background-blur/camera-background-blur.component';
import { CameraControlComponent } from '../components/camera-control/camera-control.component';
import { CameraDetailMockService } from '../services/camera/camera-detail/camera-detail.mock.service';
import { ClockComponent } from '../components/clock/clock.component';
import { CommonModule } from '@angular/common';
import { CommonUiModule } from './common-ui.module';
import { CommonWidgetModule } from './common-widget.module';
import { ContainerCollapsibleComponent } from '../components/container-collapsible/container-collapsible.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { DisplayColorTempComponent } from '../components/display/display-color-temp/display-color-temp.component';
import { DolbyModesTranslationPipe } from '../pipe/dolby-modes-translation.pipe';
import { EyeCareModeComponent } from '../components/display/eye-care-mode/eye-care-mode.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HardwareSettingRoutingModule } from './hardware-settings-routing.module';
import { InstallationHistoryComponent } from '../components/pages/page-device-updates/children/installation-history/installation-history.component';
import { IntelligentMediaComponent } from '../components/pages/page-smart-assist/intelligent-media/intelligent-media.component';
import { OledPowerSettingsComponent } from '../components/display/oled-power-settings/oled-power-settings.component';
import { PageDeviceComponent } from '../components/pages/page-device/page-device.component';
import { PageDeviceSettingsComponent } from '../components/pages/page-device-settings/page-device-settings.component';
import { PageDeviceUpdatesComponent } from '../components/pages/page-device-updates/page-device-updates.component';
import { PageHardwarescanComponent } from '../components/pages/page-hardwarescan/page-hardwarescan.component';
import { PagePrivacyComponent } from '../components/pages/page-privacy/page-privacy.component';
import { PageQuestionsComponent } from '../components/pages/page-questions/page-questions.component';
import { PageSettingsComponent } from '../components/pages/page-settings/page-settings.component';
import { PageSmartAssistComponent } from '../components/pages/page-smart-assist/page-smart-assist.component';
import { PageSupportComponent } from '../components/pages/page-support/page-support.component';
import { PageSupportDetailComponent } from '../components/pages/page-support-detail/page-support-detail.component';
import { PowerSmartSettingsComponent } from '../components/widgets/power-smart-settings/power-smart-settings.component';
import { SharedModule } from './shared.module';
import { SmartStandbyComponent } from '../components/pages/page-device-settings/children/subpage-device-settings-power/smart-standby/smart-standby.component';
import { SpinnerComponent } from '../components/common/spinner/spinner.component';
import { SubpageDeviceSettingsAudioComponent } from '../components/pages/page-device-settings/children/subpage-device-settings-audio/subpage-device-settings-audio.component';
import { SubpageDeviceSettingsDisplayComponent } from '../components/pages/page-device-settings/children/subpage-device-settings-display/subpage-device-settings-display.component';
import { SubpageDeviceSettingsInputAccessoryComponent } from '../components/pages/page-device-settings/children/subpage-device-settings-input-accessory/subpage-device-settings-input-accessory.component';
import { SubpageDeviceSettingsPowerComponent } from '../components/pages/page-device-settings/children/subpage-device-settings-power/subpage-device-settings-power.component';
import { UserDefinedKeyComponent } from '../components/pages/page-device-settings/children/subpage-device-settings-input-accessory/user-defined-key/user-defined-key.component';
import { VoiceComponent } from '../components/pages/page-smart-assist/voice/voice.component';


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
		ContainerCollapsibleComponent,
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
		PagePrivacyComponent,
		PageQuestionsComponent,
		PageSettingsComponent,
		PageSmartAssistComponent,
		PageSupportComponent,
		PageSupportDetailComponent,
		PowerSmartSettingsComponent,
		SmartStandbyComponent,
		SpinnerComponent,
		SubpageDeviceSettingsAudioComponent,
		SubpageDeviceSettingsDisplayComponent,
		SubpageDeviceSettingsInputAccessoryComponent,
		SubpageDeviceSettingsPowerComponent,
		UserDefinedKeyComponent,
		VoiceComponent,
	],
	imports: [
		CommonModule,
		CommonUiModule,
		CommonWidgetModule,
		SharedModule,
		HardwareSettingRoutingModule,
		FontAwesomeModule
	],
	providers: [
		{ provide: BaseCameraDetail, useClass: CameraDetailMockService },
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA
	]
})
export class HardwareSettingsModule { }
