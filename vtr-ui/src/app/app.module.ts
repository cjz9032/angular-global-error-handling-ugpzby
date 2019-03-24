// ANGULAR MODULES
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

// THIRD PARTY MODULES
import { CookieService } from 'ngx-cookie-service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng5SliderModule } from 'ng5-slider';

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

// APPLICATION PAGE COMPONENTS
import { PageDashboardComponent } from './components/pages/page-dashboard/page-dashboard.component';
import { PageDeviceComponent } from './components/pages/page-device/page-device.component';
import { PageSecurityComponent } from './components/pages/page-security/page-security.component';
import { PageSupportComponent } from './components/pages/page-support/page-support.component';
import { PageUserComponent } from './components/pages/page-user/page-user.component';
import { PageQuestionsComponent } from './components/pages/page-questions/page-questions.component';
import { PageDeviceSettingsComponent } from './components/pages/page-device-settings/page-device-settings.component';
import { PageDeviceUpdatesComponent } from './components/pages/page-device-updates/page-device-updates.component';
import { AvailableUpdatesComponent } from './components/pages/page-device-updates/children/available-updates/available-updates.component';
import { PageSecurityAntivirusComponent } from './components/pages/page-security-antivirus/page-security-antivirus.component';
import { PageSecurityWifiComponent } from './components/pages/page-security-wifi/page-security-wifi.component';
import { PageSecurityPasswordComponent } from './components/pages/page-security-password/page-security-password.component';
import { PageSecurityInternetComponent } from './components/pages/page-security-internet/page-security-internet.component';


// APPLICATION SUBPAGE COMPONENTS
import { SubpageDeviceSettingsPowerComponent } from './components/pages/page-device-settings/children/subpage-device-settings-power/subpage-device-settings-power.component';
import { SubpageDeviceSettingsAudioComponent } from './components/pages/page-device-settings/children/subpage-device-settings-audio/subpage-device-settings-audio.component';
import { SubpageDeviceSettingsDisplayComponent } from './components/pages/page-device-settings/children/subpage-device-settings-display/subpage-device-settings-display.component';

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

// APPLICATION MODALS
import { ModalWelcomeComponent } from './components/modal/modal-welcome/modal-welcome.component';
import { ModalLenovoIdComponent } from './components/modal/modal-lenovo-id/modal-lenovo-id.component';

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

// FONT AWESOME
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

import { EyeCareModeComponent } from './components/display/eye-care-mode/eye-care-mode.component';
import { UiButtonComponent } from './components/ui/ui-button/ui-button.component';
import { ConnectedHomeComponent } from './components/pages/page-security-wifi/children/connected-home/connected-home.component';
import { ConnectedHomeMyHomeComponent } from './components/pages/page-security-wifi/children/connected-home-my-home/connected-home-my-home.component';
import { WifiSecurityComponent } from './components/pages/page-security-wifi/children/wifi-security/wifi-security.component';
import { AdvisorWifiSecurityComponent } from './components/pages/page-security/children/advisor-wifi-security/advisor-wifi-security.component';

import { PageSecurityWindowsHelloComponent } from './components/pages/page-security-windows-hello/page-security-windows-hello.component';
import { CameraControlComponent } from './components/camera-control/camera-control.component';
import { PageSupportDetailComponent } from './components/pages/page-support-detail/page-support-detail.component';
import { WidgetSupportComponent } from './components/widgets/widget-support/widget-support.component';
import { UiListSupportComponent } from './components/ui/ui-list-support/ui-list-support.component';
import { WidgetWarrantyComponent } from './components/widgets/widget-warranty/widget-warranty.component';
import { SanitizeHtmlPipe } from './pipe/sanitizehtml.pipe';
import { WidgetRebootComponent } from './components/widgets/widget-reboot/widget-reboot.component';
import { ContainerArticleComponent } from './components/container-article/container-article.component';
import { ArticleItemComponent } from './components/article-item/article-item.component';
import { SanitizeUrlPipe } from './pipe/sanitise-url.pipe';
import { UniqueIdPipe } from './pipe/unique-id.pipe';
import { environment } from '../environments/environment';
import { ModalBatteryChargeThresholdComponent } from './components/modal/modal-battery-charge-threshold/modal-battery-charge-threshold.component';
import { MetricsDirective } from './directives/metrics.directive';
import { InstallationHistoryComponent } from './components/pages/page-device-updates/children/installation-history/installation-history.component';
import { SeparatePascalCasePipe } from './pipe/separate-pascal-case.pipe';
import { InstalledSystemUpdatesListComponent } from './components/pages/page-device-updates/children/installed-system-updates-list/installed-system-updates-list.component';
import { ModalCommonConfirmationComponent } from './components/modal/modal-common-confirmation/modal-common-confirmation.component';
import { ModalArticleDetailComponent } from './components/modal/modal-article-detail/modal-article-detail.component';
import { DolbyModesTranslationPipe } from './pipe/dolby-modes-translation.pipe';

library.add(fas);
library.add(fab);
library.add(far);

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
		PageQuestionsComponent,
		ContainerCardComponent,
		HeaderMainComponent,
		PageDeviceSettingsComponent,
		PageDeviceUpdatesComponent,
		AvailableUpdatesComponent,
		PageSecurityAntivirusComponent,
		PageSecurityWifiComponent,
		PageSecurityPasswordComponent,
		PageSecurityInternetComponent,
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
		SanitizeHtmlPipe,
		WidgetRebootComponent,
		FeedbackFormComponent,
		ContainerArticleComponent,
		ArticleItemComponent,
		SanitizeUrlPipe,
		UniqueIdPipe,
		ModalBatteryChargeThresholdComponent,
		MetricsDirective,
		InstallationHistoryComponent,
		SeparatePascalCasePipe,
		InstalledSystemUpdatesListComponent,
		ModalCommonConfirmationComponent,
		ModalArticleDetailComponent,
		DolbyModesTranslationPipe
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		HttpClientModule,
		FontAwesomeModule,
		NgbModule,
		Ng5SliderModule,
		ReactiveFormsModule,
		// ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
		TranslationModule
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
		{ provide: BaseCameraDetail, useClass: CameraDetailMockService }
	],
	bootstrap: [AppComponent],
	entryComponents: [
		ModalLenovoIdComponent,
		ModalWelcomeComponent,
		ModalBatteryChargeThresholdComponent,
		ModalCommonConfirmationComponent,
		ModalArticleDetailComponent
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	]
})
export class AppModule { }
