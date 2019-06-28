import { OutsideclickDirective } from './directives/outsideclick.directive';
// ANGULAR MODULES
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// THIRD PARTY MODULES
import { CookieService } from 'ngx-cookie-service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng5SliderModule } from 'ng5-slider';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ColorPickerModule } from 'ngx-color-picker';

// CUSTOM MODULES
import { AppRoutingModule } from './app-routing.module';
import { TranslationModule } from './modules/translation.module';

// APPLICATION BASE COMPONENTS
import { AppComponent } from './app.component';
import { MenuMainComponent } from './components/menu-main/menu-main.component';
import { HeaderMainComponent } from './components/header-main/header-main.component';
import { MenuHeaderComponent } from './components/menu-header/menu-header.component';
import { ClockComponent } from './components/clock/clock.component';

// APPLICATION REUSABLE COMPONENTS
import { ContainerCardComponent } from './components/container-card/container-card.component';
import { ContainerCollapsibleComponent } from './components/container-collapsible/container-collapsible.component';
import { BatteryCardComponent } from './components/battery/battery-card/battery-card.component';
import { BatteryIndicatorComponent } from './components/battery/battery-indicator/battery-indicator.component';
import { BatteryDetailComponent } from './components/battery/battery-detail/battery-detail.component';
import { BatteryChargeThresholdSettingsComponent } from './components/battery/battery-charge-threshold-settings/battery-charge-threshold-settings.component';
import { FeedbackFormComponent } from './components/feedback-form/feedback-form/feedback-form.component';

// APPLICATION UI COMPONENTS
import { UiSwitchOnoffComponent } from './components/ui/ui-switch-onoff/ui-switch-onoff.component';
import { UiSwitchTristateComponent } from './components/ui/ui-switch-tristate/ui-switch-tristate.component';
import { UiRectangleRadioComponent } from './components/ui/ui-rectangle-radio/ui-rectangle-radio.component';
import { UiRangeSliderComponent } from './components/ui/ui-range-slider/ui-range-slider.component';
import { UiRowSwitchComponent } from './components/ui/ui-row-switch/ui-row-switch.component';
import { UiListChevronComponent } from './components/ui/ui-list-chevron/ui-list-chevron.component';
import { UiListCheckboxComponent } from './components/ui/ui-list-checkbox/ui-list-checkbox.component';
import { UiHeaderSubpageComponent } from './components/ui/ui-header-subpage/ui-header-subpage.component';
import { UiNumberButtonComponent } from './components/ui/ui-number-button/ui-number-button.component';
import { UiMacrokeyDetailsComponent } from './components/ui/ui-macrokey-details/ui-macrokey-details.component';
import { UiMacrokeyRecordedListComponent } from './components/ui/ui-macrokey-recorded-list/ui-macrokey-recorded-list.component';

// APPLICATION PAGE COMPONENTS
import { PageDashboardComponent } from './components/pages/page-dashboard/page-dashboard.component';
import { PageDeviceComponent } from './components/pages/page-device/page-device.component';
import { PageSupportComponent } from './components/pages/page-support/page-support.component';
import { PageUserComponent } from './components/pages/page-user/page-user.component';
import { PageQuestionsComponent } from './components/pages/page-questions/page-questions.component';
import { PageDeviceSettingsComponent } from './components/pages/page-device-settings/page-device-settings.component';
import { PageDeviceUpdatesComponent } from './components/pages/page-device-updates/page-device-updates.component';
import { AvailableUpdatesComponent } from './components/pages/page-device-updates/children/available-updates/available-updates.component';

// APPLICATION SUBPAGE COMPONENTS
import { SubpageDeviceSettingsPowerComponent } from './components/pages/page-device-settings/children/subpage-device-settings-power/subpage-device-settings-power.component';
import { SubpageDeviceSettingsAudioComponent } from './components/pages/page-device-settings/children/subpage-device-settings-audio/subpage-device-settings-audio.component';
import { SubpageDeviceSettingsDisplayComponent } from './components/pages/page-device-settings/children/subpage-device-settings-display/subpage-device-settings-display.component';
import { PageSmartAssistComponent } from './components/pages/page-smart-assist/page-smart-assist.component';

// APPLICATION WIDGET COMPONENTS
import { WidgetSwitchIconComponent } from './components/widgets/widget-switch-icon/widget-switch-icon.component';
import { WidgetDeviceComponent } from './components/widgets/widget-device/widget-device.component';
import { WidgetSecurityComponent } from './components/widgets/widget-security/widget-security.component';
import { WidgetCarouselComponent } from './components/widgets/widget-carousel/widget-carousel.component';
import { WidgetQuicksettingsComponent } from './components/widgets/widget-quicksettings/widget-quicksettings.component';
import { WidgetStatusComponent } from './components/widgets/widget-status/widget-status.component';
import { WidgetQuestionsComponent } from './components/widgets/widget-questions/widget-questions.component';
import { WidgetFeedbackComponent } from './components/widgets/widget-feedback/widget-feedback.component';
import { WidgetDeviceUpdateComponent } from './components/widgets/widget-device-update/widget-device-update.component';
import { WidgetDeviceUpdateSettingsComponent } from './components/widgets/widget-device-update-settings/widget-device-update-settings.component';
import { WidgetMacrokeySettingsComponent } from './components/widgets/widget-macrokey-settings/widget-macrokey-settings.component';

// APPLICATION MODALS
import { ModalWelcomeComponent } from './components/modal/modal-welcome/modal-welcome.component';
import { ModalLenovoIdComponent } from './components/modal/modal-lenovo-id/modal-lenovo-id.component';
import { ModalWifiSecurityInvitationComponent } from './components/modal/modal-wifi-security-invitation/modal-wifi-security-invitation.component';
import { ModalWifiSecuriryLocationNoticeComponent } from './components/modal/modal-wifi-securiry-location-notice/modal-wifi-securiry-location-notice.component';
import { ModalHomeProtectionLocationNoticeComponent } from './components/modal/modal-home-protection-location-notice/modal-home-protection-location-notice.component';

// APPLICATION SERVICES
import { DevService } from './services/dev/dev.service';
import { MockService } from './services/mock/mock.service';
import { DisplayService } from './services/display/display.service';
import { ContainerService } from './services/container/container.service';
import { CommsService } from './services/comms/comms.service';
import { DashboardService } from './services/dashboard/dashboard.service';
import { SecurityService } from './services/security/security.service';
import { UserService } from './services/user/user.service';
import { BaseCameraDetail } from './services/camera/camera-detail/base-camera-detail.service';
import { CameraDetailMockService } from './services/camera/camera-detail/camera-detail.mock.service';
import { AudioService } from './services/audio/audio.service';
import { RegionService } from './services/region/region.service';
import { GlobalErrorHandler } from './services/error-handler/global.service';

// FONT AWESOME
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fal } from '@fortawesome/pro-light-svg-icons';

import { EyeCareModeComponent } from './components/display/eye-care-mode/eye-care-mode.component';
import { UiButtonComponent } from './components/ui/ui-button/ui-button.component';
import { CameraControlComponent } from './components/camera-control/camera-control.component';
import { PageSupportDetailComponent } from './components/pages/page-support-detail/page-support-detail.component';
import { WidgetSupportComponent } from './components/widgets/widget-support/widget-support.component';
import { UiListSupportComponent } from './components/ui/ui-list-support/ui-list-support.component';
import { WidgetWarrantyComponent } from './components/widgets/widget-warranty/widget-warranty.component';
import { WidgetRebootComponent } from './components/widgets/widget-reboot/widget-reboot.component';
import { ContainerArticleComponent } from './components/container-article/container-article.component';
import { ArticleItemComponent } from './components/article-item/article-item.component';
import { UniqueIdPipe } from './pipe/unique-id.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalBatteryChargeThresholdComponent } from './components/modal/modal-battery-charge-threshold/modal-battery-charge-threshold.component';
import { MetricsDirective } from './directives/metrics.directive';
import { TranslateDirective } from './directives/translate.directive';
import { LinkStatusDirective } from './directives/link-status.directive';
import { InstallationHistoryComponent } from './components/pages/page-device-updates/children/installation-history/installation-history.component';
import { SeparatePascalCasePipe } from './pipe/separate-pascal-case.pipe';
import { ModalCommonConfirmationComponent } from './components/modal/modal-common-confirmation/modal-common-confirmation.component';
import { BaseComponent } from './components/base/base.component';
import { AppEventDirective } from './directives/app-event.directive';
import { ModalUpdateChangeLogComponent } from './components/modal/modal-update-change-log.component/modal-update-change-log.component';
import { ModalArticleDetailComponent } from './components/modal/modal-article-detail/modal-article-detail.component';
import { ModalThreatLocatorComponent } from './components/modal/modal-threat-locator/modal-threat-locator.component';
import { DolbyModesTranslationPipe } from './pipe/dolby-modes-translation.pipe';
import { WidgetOfflineInfoComponent } from './components/widgets/widget-offline-info/widget-offline-info.component';
import { UiLandingFeatureComponent } from './components/ui/ui-landing-feature/ui-landing-feature.component';
import { UiObjectTitleComponent } from './components/ui/ui-object-title/ui-object-title.component';
import { UiSecurityStatusbarComponent } from './components/ui/ui-security-statusbar/ui-security-statusbar.component';
import { UiFeatureItemComponent } from './components/ui/ui-feature-item/ui-feature-item.component';
import { MinutesToHourminPipe } from './pipe/minutes-to-hourmin.pipe';
import { ModalAboutComponent } from './components/modal/modal-about/modal-about.component';
import { UiCircleRadioComponent } from './components/ui/ui-circle-radio/ui-circle-radio.component';
import { WidgetPermissionNoteComponent } from './components/widgets/widget-permission-note/widget-permission-note.component';
import { ModalSupportWechatComponent } from './components/modal/modal-support-wechat/modal-support-wechat.component';
import { ModalLicenseComponent } from './components/modal/modal-license/modal-license.component';
import { SpinnerComponent } from './components/common/spinner/spinner.component';
import { PagePrivacyComponent } from './components/pages/page-privacy/page-privacy.component';
import { PageDeviceGamingComponent } from './components/pages/page-device-gaming/page-device-gaming.component';
import { WidgetLegionEdgeComponent } from './components/widgets/widget-legion-edge/widget-legion-edge.component';
import { WidgetSystemToolsComponent } from './components/widgets/widget-system-tools/widget-system-tools.component';
import { WidgetSystemMonitorComponent } from './components/widgets/widget-system-monitor/widget-system-monitor.component';
import { WidgetQuicksettingsListComponent } from './components/widgets/widget-quicksettings-list/widget-quicksettings-list.component';
import { WidgetLightingComponent } from './components/widgets/widget-lighting/widget-lighting.component';
import { ModalGamingLegionedgeComponent } from './components/modal/modal-gaming-legionedge/modal-gaming-legionedge.component';
import { PrivacyModule } from './components/pages/page-privacy/privacy.module';
import { UiGamingCollapsibleContainerComponent } from './components/ui/ui-gaming-collapsible-container/ui-gaming-collapsible-container.component';
import { PageMacrokeyComponent } from './components/pages/page-macrokey/page-macrokey.component';
import { PageLightingcustomizeComponent } from './components/pages/page-lightingcustomize/page-lightingcustomize.component';
import { PageHardwarescanComponent } from './components/pages/page-hardwarescan/page-hardwarescan.component';
import { UiRoundedRectangleRadioComponent } from './components/ui/ui-rounded-rectangle-radio/ui-rounded-rectangle-radio.component';
import { CameraBackgroundBlurComponent } from './components/camera-background-blur/camera-background-blur.component';
import { PageAutocloseComponent } from './components/pages/page-autoclose/page-autoclose.component';
import { PageNetworkBoostComponent } from './components/pages/page-network-boost/page-network-boost.component';
import { PowerSmartSettingsComponent } from './components/widgets/power-smart-settings/power-smart-settings.component';
import { PageSettingsComponent } from './components/pages/page-settings/page-settings.component';
import { UiPopoverComponent } from './components/ui/ui-popover/ui-popover.component';
import { OledPowerSettingsComponent } from './components/display/oled-power-settings/oled-power-settings.component';
import { UiMacrokeyPopupComponent } from './components/ui/ui-macrokey-popup/ui-macrokey-popup.component';
import { ModalChsWelcomeContainerComponent } from './components/pages/page-connected-home-security/component/modal-chs-welcome-container/modal-chs-welcome-container.component';

// SA Components
import { PageSecurityAntivirusComponent } from './components/pages/page-security-antivirus/page-security-antivirus.component';
import { PageSecurityWifiComponent } from './components/pages/page-security-wifi/page-security-wifi.component';
import { PageSecurityPasswordComponent } from './components/pages/page-security-password/page-security-password.component';
import { PageSecurityInternetComponent } from './components/pages/page-security-internet/page-security-internet.component';
import { PageSecurityHomeSecurityComponent } from './components/pages/page-security-home-security/page-security-home-security.component';
import { PageSecurityComponent } from './components/pages/page-security/page-security.component';
import { WifiSecurityComponent } from './components/pages/page-security-wifi/children/wifi-security/wifi-security.component';
import { AdvisorWifiSecurityComponent } from './components/pages/page-security/children/advisor-wifi-security/advisor-wifi-security.component';
import { PageSecurityWindowsHelloComponent } from './components/pages/page-security-windows-hello/page-security-windows-hello.component';

// SA Widgets
import { WidgetSecurityStatusComponent } from './components/widgets/widget-security-status/widget-security-status.component';
import { WidgetMcafeeComponent } from './components/widgets/widget-mcafee/widget-mcafee.component';

// SA pipes
import { JoinclassPipe } from './pipe/security-wifi/join-class.pipe';
import { SuccessClassPipe } from './pipe/security-wifi/success-class.pipe';
import { SubTransformPipe } from './pipe/security-antivirus/sub-transform.pipe';
import { DateClassPipe } from './pipe/security-antivirus/date-class.pipe';
import { IconClassPipe } from './pipe/ui-security-statusbar/icon-class.pipe';
import { IconNamePipe } from './pipe/ui-security-statusbar/icon-name.pipe';
import { StatusTextPipe } from './pipe/ui-security-statusbar/status-text.pipe';
import { TextClassPipe } from './pipe/ui-security-statusbar/text-class.pipe';
import { StatusTransformPipe } from './pipe/ui-security-statusbar/status-transform.pipe';
import { PipeInstallPipe } from './pipe/security-antivirus/pipe-install.pipe';
import { UiLightingProfileComponent } from './components/ui/ui-lighting-profile/ui-lighting-profile.component';
import { UiDropDownComponent } from './components/ui/ui-dropdown/ui-dropdown.component';

// CHS Components
import { PageConnectedHomeSecurityComponent } from './components/pages/page-connected-home-security/page-connected-home-security.component';
import { ConnectedHomeComponent } from './components/pages/page-security-wifi/children/connected-home/connected-home.component';
import { ConnectedHomeMyHomeComponent } from './components/pages/page-security-wifi/children/connected-home-my-home/connected-home-my-home.component';

// CHS widgets
import { HomeSecurityAccountStatusComponent } from './components/pages/page-connected-home-security/component/home-security-account-status/home-security-account-status.component';
import { HomeSecurityMyDeviceComponent } from './components/pages/page-connected-home-security/component/home-security-my-device/home-security-my-device.component';
import { HomeSecurityAllDevicesComponent } from './components/pages/page-connected-home-security/component/home-security-all-devices/home-security-all-devices.component';
import { HomeSecurityDeviceComponent } from './components/pages/page-connected-home-security/component/home-security-device/home-security-device.component';
// CHS pipes
import { DaysIntervalPipe } from './pipe/connected-home-security/account-status/days-interval.pipe';
import { CharacterLimitPipe } from './pipe/ui-chs-statusbar/character-limit.pipe';

import { AutoupdateSettingsComponent } from './components/pages/page-device-updates/children/autoupdate-settings/autoupdate-settings.component';
import { UiLightingProfileToggleComponent } from './components/ui/ui-lighting-profile-toggle/ui-lighting-profile-toggle.component';
import { UiBrightnessSliderComponent } from './components/ui/ui-brightness-slider/ui-brightness-slider.component';
import { SvgInlinePipe } from './pipe/svg-inline/svg-inline.pipe';
import { UiLightingEffectComponent } from './components/ui/ui-lighting-effect/ui-lighting-effect.component';
import { UiLightingSingleColorComponent } from './components/ui/ui-lighting-single-color/ui-lighting-single-color.component';
import { UiLightingColorWheelComponent } from './components/ui/ui-lighting-color-wheel/ui-lighting-color-wheel.component';
import { DisplayColorTempComponent } from './components/display/display-color-temp/display-color-temp.component';
import { IntelligentMediaComponent } from './components/pages/page-smart-assist/intelligent-media/intelligent-media.component';
import { UiMacrokeyCollapsibleContainerComponent } from './components/ui/ui-macrokey-collapsible-container/ui-macrokey-collapsible-container.component';
import { UiGamingDriverPopupComponent } from './components/ui/ui-gaming-driver-popup/ui-gaming-driver-popup.component';
import { ActiveProtectionSystemComponent } from './components/pages/page-smart-assist/active-protection-system/active-protection-system.component';
import { UiApsSliderComponent } from './components/ui/ui-aps-slider/ui-aps-slider.component';
import { UiCheckboxComponent } from './components/ui/ui-checkbox/ui-checkbox.component';
import { UiCircleRadioWithCheckboxComponent } from './components/ui/ui-circle-radio-with-checkbox/ui-circle-radio-with-checkbox.component';
import { UiChsStatusbarComponent } from './components/ui/ui-chs-statusbar/ui-chs-statusbar.component';
import { ActiveProtectionSystemAdvancedComponent } from './components/pages/page-smart-assist/active-protection-system-advanced/active-protection-system-advanced.component';
import { UiColorWheelComponent } from './components/ui/ui-color-wheel/ui-color-wheel.component';
import { SubpageDeviceSettingsInputAccessoryComponent } from './components/pages/page-device-settings/children/subpage-device-settings-input-accessory/subpage-device-settings-input-accessory.component';
import { ModalIntelligentCoolingModesComponent } from './components/modal/modal-intelligent-cooling-modes/modal-intelligent-cooling-modes.component';
import { UiTimePickerComponent } from './components/ui/ui-time-picker/ui-time-picker.component';
import { VoiceComponent } from './components/pages/page-smart-assist/voice/voice.component';
import { ModalVoiceComponent } from './components/modal/modal-voice/modal-voice.component';
import { CapitalizeFirstPipe } from './pipe/capitalize-pipe/capitalize-first.pipe';
import { SanitizeModule } from './modules/sanitize.module';
import { SmartStandbyComponent } from './components/pages/page-device-settings/children/subpage-device-settings-power/smart-standby/smart-standby.component';
import { UiDaysPickerComponent } from './components/ui/ui-days-picker/ui-days-picker.component';
import { DownloadFailedModalComponent } from './components/pages/page-smart-assist/voice/download-failed-modal/download-failed-modal.component';

library.add(fas);
library.add(fab);
library.add(far);
library.add(fal);

@NgModule({
	declarations: [
		AppComponent,
		MenuMainComponent,
		ClockComponent,
		PageUserComponent,
		PageDashboardComponent,
		PageDeviceComponent,
		PageSecurityComponent,
		PageSupportComponent,
		WidgetSwitchIconComponent,
		WidgetDeviceComponent,
		WidgetSecurityComponent,
		WidgetCarouselComponent,
		WidgetQuicksettingsComponent,
		WidgetFeedbackComponent,
		WidgetStatusComponent,
		WidgetQuestionsComponent,
		WidgetDeviceUpdateComponent,
		WidgetDeviceUpdateSettingsComponent,
		HomeSecurityAccountStatusComponent,
		PageQuestionsComponent,
		ContainerCardComponent,
		HeaderMainComponent,
		PageDeviceSettingsComponent,
		PageDeviceUpdatesComponent,
		PageSmartAssistComponent,
		AvailableUpdatesComponent,
		PageSecurityAntivirusComponent,
		PageSecurityWifiComponent,
		PageSecurityPasswordComponent,
		PageSecurityInternetComponent,
		PageSecurityHomeSecurityComponent,
		MenuHeaderComponent,
		SubpageDeviceSettingsPowerComponent,
		SubpageDeviceSettingsAudioComponent,
		SubpageDeviceSettingsDisplayComponent,
		PageQuestionsComponent,
		ModalWelcomeComponent,
		ContainerCollapsibleComponent,
		UiSwitchOnoffComponent,
		UiSwitchTristateComponent,
		BatteryDetailComponent,
		BatteryChargeThresholdSettingsComponent,
		UiRangeSliderComponent,
		UiListChevronComponent,
		UiListCheckboxComponent,
		UiRectangleRadioComponent,
		BatteryCardComponent,
		BatteryIndicatorComponent,
		UiRowSwitchComponent,
		UiHeaderSubpageComponent,
		UiSwitchTristateComponent,
		UiRowSwitchComponent,
		EyeCareModeComponent,
		UiHeaderSubpageComponent,
		UiButtonComponent,
		ConnectedHomeComponent,
		ConnectedHomeMyHomeComponent,
		WifiSecurityComponent,
		AdvisorWifiSecurityComponent,
		PageSecurityWindowsHelloComponent,
		CameraControlComponent,
		PageSupportDetailComponent,
		WidgetSupportComponent,
		UiListSupportComponent,
		WidgetWarrantyComponent,
		ModalLenovoIdComponent,
		WidgetRebootComponent,
		FeedbackFormComponent,
		ContainerArticleComponent,
		ArticleItemComponent,
		UniqueIdPipe,
		ModalBatteryChargeThresholdComponent,
		WidgetMcafeeComponent,
		PipeInstallPipe,
		IconClassPipe,
		IconNamePipe,
		TextClassPipe,
		StatusTextPipe,
		ModalBatteryChargeThresholdComponent,
		MetricsDirective,
		TranslateDirective,
		LinkStatusDirective,
		InstallationHistoryComponent,
		SeparatePascalCasePipe,
		ModalCommonConfirmationComponent,
		BaseComponent,
		ModalCommonConfirmationComponent,
		AppEventDirective,
		OutsideclickDirective,
		ModalUpdateChangeLogComponent,
		ModalCommonConfirmationComponent,
		ModalArticleDetailComponent,
		DolbyModesTranslationPipe,
		WidgetOfflineInfoComponent,
		ModalThreatLocatorComponent,
		DolbyModesTranslationPipe,
		ModalWifiSecurityInvitationComponent,
		ModalWifiSecuriryLocationNoticeComponent,
		ModalHomeProtectionLocationNoticeComponent,
		UiLandingFeatureComponent,
		UiObjectTitleComponent,
		UiSecurityStatusbarComponent,
		IconClassPipe,
		IconNamePipe,
		StatusTextPipe,
		TextClassPipe,
		UiFeatureItemComponent,
		UiSecurityStatusbarComponent,
		WidgetSecurityStatusComponent,
		StatusTransformPipe,
		MinutesToHourminPipe,
		SubTransformPipe,
		DateClassPipe,
		ModalAboutComponent,
		JoinclassPipe,
		SuccessClassPipe,
		UiCircleRadioComponent,
		WidgetPermissionNoteComponent,
		ModalSupportWechatComponent,
		ModalLicenseComponent,
		SpinnerComponent,
		PagePrivacyComponent,
		PageDeviceGamingComponent,
		WidgetLegionEdgeComponent,
		WidgetSystemToolsComponent,
		WidgetSystemMonitorComponent,
		WidgetQuicksettingsListComponent,
		WidgetLightingComponent,
		PageConnectedHomeSecurityComponent,
		ModalGamingLegionedgeComponent,
		UiGamingCollapsibleContainerComponent,
		PageMacrokeyComponent,
		PageLightingcustomizeComponent,
		PageHardwarescanComponent,
		UiRoundedRectangleRadioComponent,
		CameraBackgroundBlurComponent,
		PageAutocloseComponent,
		PageNetworkBoostComponent,
		PowerSmartSettingsComponent,
		PageSettingsComponent,
		HomeSecurityDeviceComponent,
		UiLightingProfileComponent,
		OledPowerSettingsComponent,
		UiDropDownComponent,
		AutoupdateSettingsComponent,
		UiPopoverComponent,
		UiMacrokeyPopupComponent,
		ModalChsWelcomeContainerComponent,
		WidgetMacrokeySettingsComponent,
		UiNumberButtonComponent,
		UiMacrokeyDetailsComponent,
		UiMacrokeyRecordedListComponent,
		SvgInlinePipe,
		IntelligentMediaComponent,
		DisplayColorTempComponent,
		UiLightingProfileToggleComponent,
		UiBrightnessSliderComponent,
		UiLightingEffectComponent,
		UiLightingSingleColorComponent,
		UiLightingColorWheelComponent,
		HomeSecurityMyDeviceComponent,
		HomeSecurityAllDevicesComponent,
		UiMacrokeyCollapsibleContainerComponent,
		UiGamingDriverPopupComponent,
		ActiveProtectionSystemComponent,
		UiApsSliderComponent,
		UiCheckboxComponent,
		UiCircleRadioWithCheckboxComponent,
		UiChsStatusbarComponent,
		ActiveProtectionSystemAdvancedComponent,
		UiColorWheelComponent,
		SubpageDeviceSettingsInputAccessoryComponent,
		ModalIntelligentCoolingModesComponent,
		DaysIntervalPipe,
		CharacterLimitPipe,
		UiTimePickerComponent,
		VoiceComponent,
		ModalVoiceComponent,
		CapitalizeFirstPipe,
		SmartStandbyComponent,
		UiDaysPickerComponent,
		DownloadFailedModalComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		HttpClientModule,
		AngularSvgIconModule,
		FontAwesomeModule,
		NgbModule,
		// NgbActiveModal,
		Ng5SliderModule,
		ReactiveFormsModule,
		// ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
		TranslationModule,
		BrowserAnimationsModule,
		PrivacyModule,
		ColorPickerModule,
		SanitizeModule
	],
	providers: [
		CookieService,
		DevService,
		MockService,
		DisplayService,
		ContainerService,
		CommsService,
		DashboardService,
		SecurityService,
		UserService,
		AudioService,
		RegionService,
		{ provide: BaseCameraDetail, useClass: CameraDetailMockService },
		{ provide: ErrorHandler, useClass: GlobalErrorHandler }
	],
	bootstrap: [AppComponent],
	entryComponents: [
		ModalLenovoIdComponent,
		ModalWelcomeComponent,
		ModalBatteryChargeThresholdComponent,
		ModalCommonConfirmationComponent,
		ModalArticleDetailComponent,
		FeedbackFormComponent,
		ModalThreatLocatorComponent,
		ModalWifiSecurityInvitationComponent,
		ModalWifiSecuriryLocationNoticeComponent,
		ModalHomeProtectionLocationNoticeComponent,
		ModalUpdateChangeLogComponent,
		ModalAboutComponent,
		ModalSupportWechatComponent,
		ModalLicenseComponent,
		ModalGamingLegionedgeComponent,
		ModalChsWelcomeContainerComponent,
		ModalIntelligentCoolingModesComponent,
		ModalVoiceComponent,
		DownloadFailedModalComponent
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
