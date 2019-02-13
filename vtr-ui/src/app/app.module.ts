// ANGULAR MODULES
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// THIRD PARTY MODULES
import { CookieService } from 'ngx-cookie-service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// ROUTING MODULES
import { AppRoutingModule } from './app-routing.module';

// APPLICATION BASE COMPONENTS
import { AppComponent } from './app.component';
import { MenuMainComponent } from './components/menu-main/menu-main.component';
import { HeaderMainComponent } from './components/header-main/header-main.component';
import { MenuHeaderComponent } from './components/menu-header/menu-header.component';
import { ClockComponent } from './components/clock/clock.component';

// APPLICATION REUSABLE COMPONENTS
import { ContainerCardComponent } from './components/container-card/container-card.component';
import { BatteryDetailComponent } from './components/battery/battery-detail/battery-detail.component';
import { BatteryCardComponent } from './components/battery/battery-card/battery-card.component';
import { BatteryIndicatorComponent } from './components/battery/battery-indicator/battery-indicator.component';

// APPLICATION UI COMPONENTS
import { UiSwitchOnoffComponent } from './components/ui/ui-switch-onoff/ui-switch-onoff.component';
import { UiSwitchTristateComponent } from './components/ui/ui-switch-tristate/ui-switch-tristate.component';
import { UiRectangleRadioComponent } from './components/ui/ui-rectangle-radio/ui-rectangle-radio.component';
import { ContainerCollapsibleComponent } from './components/container-collapsible/container-collapsible.component';

// APPLICATION PAGE COMPONENTS
import { PageDashboardComponent } from './components/pages/page-dashboard/page-dashboard.component';
import { PageDeviceComponent } from './components/pages/page-device/page-device.component';
import { PageSecurityComponent } from './components/pages/page-security/page-security.component';
import { PageSupportComponent } from './components/pages/page-support/page-support.component';
import { PageUserComponent } from './components/pages/page-user/page-user.component';
import { PageQuestionsComponent } from './components/pages/page-questions/page-questions.component';
import { PageDeviceSettingsComponent } from './components/pages/page-device-settings/page-device-settings.component';
import { PageDeviceUpdatesComponent } from './components/pages/page-device-updates/page-device-updates.component';
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

// APPLICATION MODALS
import { ModalWelcomeComponent } from './components/modal/modal-welcome/modal-welcome.component';

// APPLICATION SERVICES
import { DevService } from './services/dev/dev.service';
import { DisplayService } from './services/display/display.service';
import { ContainerService } from './services/container/container.service';
import { CommsService } from './services/comms/comms.service';
import { DashboardService } from './services/dashboard/dashboard.service';
import { DeviceService } from './services/device/device.service';
import { SecurityService } from './services/security/security.service';
import { UserService } from './services/user/user.service';

// FONT AWESOME
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

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
		WidgetStatusComponent,
		PageQuestionsComponent,
		ContainerCardComponent,
		HeaderMainComponent,
		PageDeviceSettingsComponent,
		PageDeviceUpdatesComponent,
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
		UiRectangleRadioComponent,
		UiSwitchTristateComponent,
		BatteryDetailComponent,
		BatteryCardComponent,
		BatteryIndicatorComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		HttpClientModule,
		FontAwesomeModule,
		NgbModule
	],
	providers: [
		CookieService,
		DevService,
		DisplayService,
		ContainerService,
		CommsService,
		DashboardService,
		DeviceService,
		SecurityService,
		UserService
	],
	bootstrap: [AppComponent],
	entryComponents: [ModalWelcomeComponent]
})
export class AppModule {}
