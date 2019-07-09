import { ActiveProtectionSystemAdvancedComponent } from '../components/pages/page-smart-assist/active-protection-system-advanced/active-protection-system-advanced.component';
import { ActiveProtectionSystemComponent } from '../components/pages/page-smart-assist/active-protection-system/active-protection-system.component';
import { AdvisorWifiSecurityComponent } from '../components/pages/page-security/children/advisor-wifi-security/advisor-wifi-security.component';
import { AutoupdateSettingsComponent } from '../components/pages/page-device-updates/children/autoupdate-settings/autoupdate-settings.component';
import { AvailableUpdatesComponent } from '../components/pages/page-device-updates/children/available-updates/available-updates.component';
import { BatteryCardComponent } from '../components/battery/battery-card/battery-card.component';
import { BatteryChargeThresholdSettingsComponent } from '../components/battery/battery-charge-threshold-settings/battery-charge-threshold-settings.component';
import { BatteryDetailComponent } from '../components/battery/battery-detail/battery-detail.component';
import { BatteryIndicatorComponent } from '../components/battery/battery-indicator/battery-indicator.component';
import { CameraBackgroundBlurComponent } from '../components/camera-background-blur/camera-background-blur.component';
import { CameraControlComponent } from '../components/camera-control/camera-control.component';
import { ClockComponent } from '../components/clock/clock.component';
import { CommonModule } from '@angular/common';
import { ConnectedHomeComponent } from '../components/pages/page-security-wifi/children/connected-home/connected-home.component';
import { ConnectedHomeMyHomeComponent } from '../components/pages/page-security-wifi/children/connected-home-my-home/connected-home-my-home.component';
import { ContainerCollapsibleComponent } from '../components/container-collapsible/container-collapsible.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { DisplayColorTempComponent } from '../components/display/display-color-temp/display-color-temp.component';
import { DolbyModesTranslationPipe } from '../pipe/dolby-modes-translation.pipe';
import { EyeCareModeComponent } from '../components/display/eye-care-mode/eye-care-mode.component';
import { HardwareSettingRoutingModule } from './hardware-settings-routing.module';
import { HomeSecurityAccountStatusComponent } from '../components/pages/page-connected-home-security/component/home-security-account-status/home-security-account-status.component';
import { HomeSecurityAllDevicesComponent } from '../components/pages/page-connected-home-security/component/home-security-all-devices/home-security-all-devices.component';
import { HomeSecurityDeviceComponent } from '../components/pages/page-connected-home-security/component/home-security-device/home-security-device.component';
import { HomeSecurityMyDeviceComponent } from '../components/pages/page-connected-home-security/component/home-security-my-device/home-security-my-device.component';
import { InstallationHistoryComponent } from '../components/pages/page-device-updates/children/installation-history/installation-history.component';
import { IntelligentMediaComponent } from '../components/pages/page-smart-assist/intelligent-media/intelligent-media.component';
import { OledPowerSettingsComponent } from '../components/display/oled-power-settings/oled-power-settings.component';
import { PageConnectedHomeSecurityComponent } from '../components/pages/page-connected-home-security/page-connected-home-security.component';
import { PageDeviceComponent } from '../components/pages/page-device/page-device.component';
import { PageDeviceSettingsComponent } from '../components/pages/page-device-settings/page-device-settings.component';
import { PageDeviceUpdatesComponent } from '../components/pages/page-device-updates/page-device-updates.component';
import { PageHardwarescanComponent } from '../components/pages/page-hardwarescan/page-hardwarescan.component';
import { PagePrivacyComponent } from '../components/pages/page-privacy/page-privacy.component';
import { PageQuestionsComponent } from '../components/pages/page-questions/page-questions.component';
import { PageSecurityAntivirusComponent } from '../components/pages/page-security-antivirus/page-security-antivirus.component';
import { PageSecurityComponent } from '../components/pages/page-security/page-security.component';
import { PageSecurityHomeSecurityComponent } from '../components/pages/page-security-home-security/page-security-home-security.component';
import { PageSecurityInternetComponent } from '../components/pages/page-security-internet/page-security-internet.component';
import { PageSecurityPasswordComponent } from '../components/pages/page-security-password/page-security-password.component';
import { PageSecurityWifiComponent } from '../components/pages/page-security-wifi/page-security-wifi.component';
import { PageSecurityWindowsHelloComponent } from '../components/pages/page-security-windows-hello/page-security-windows-hello.component';
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
import { VoiceComponent } from '../components/pages/page-smart-assist/voice/voice.component';
import { WifiSecurityComponent } from '../components/pages/page-security-wifi/children/wifi-security/wifi-security.component';
import { CommonUiModule } from './common-ui.module';
import { CommonWidgetModule } from './common-widget.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
	declarations: [
		ActiveProtectionSystemAdvancedComponent,
		ActiveProtectionSystemComponent,
		AdvisorWifiSecurityComponent,
		AutoupdateSettingsComponent,
		AvailableUpdatesComponent,
		BatteryCardComponent,
		BatteryChargeThresholdSettingsComponent,
		BatteryDetailComponent,
		BatteryIndicatorComponent,
		CameraBackgroundBlurComponent,
		CameraControlComponent,
		ClockComponent,
		ConnectedHomeComponent,
		ConnectedHomeMyHomeComponent,
		ContainerCollapsibleComponent,
		DisplayColorTempComponent,
		DolbyModesTranslationPipe,
		EyeCareModeComponent,
		HomeSecurityAccountStatusComponent,
		HomeSecurityAllDevicesComponent,
		HomeSecurityDeviceComponent,
		HomeSecurityMyDeviceComponent,
		InstallationHistoryComponent,
		IntelligentMediaComponent,
		OledPowerSettingsComponent,
		PageConnectedHomeSecurityComponent,
		PageDeviceComponent,
		PageDeviceSettingsComponent,
		PageDeviceUpdatesComponent,
		PageHardwarescanComponent,
		PagePrivacyComponent,
		PageQuestionsComponent,
		PageSecurityAntivirusComponent,
		PageSecurityComponent,
		PageSecurityHomeSecurityComponent,
		PageSecurityInternetComponent,
		PageSecurityPasswordComponent,
		PageSecurityWifiComponent,
		PageSecurityWindowsHelloComponent,
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
		VoiceComponent,
		WifiSecurityComponent,
	],
	imports: [
		CommonModule,
		CommonUiModule,
		CommonWidgetModule,
		SharedModule,
		HardwareSettingRoutingModule,
		FontAwesomeModule
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA
	]
})
export class HardwareSettingsModule { }
