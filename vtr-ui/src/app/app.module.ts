// ANGULAR MODULES
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// THIRD PARTY MODULES
import { CookieService } from 'ngx-cookie-service';

// ROUTING MODULES
import { AppRoutingModule } from './app-routing.module';

// APPLICATION BASE COMPONENTS
import { AppComponent } from './app.component';
import { MenuMainComponent } from './components/menu-main/menu-main.component';
import { HeaderMainComponent } from './components/header-main/header-main.component';
import { ClockComponent } from './components/clock/clock.component';

// APPLICATION PAGE COMPONENTS
import { PageDashboardComponent } from './components/pages/page-dashboard/page-dashboard.component';
import { PageDeviceComponent } from './components/pages/page-device/page-device.component';
import { PageSecurityComponent } from './components/pages/page-security/page-security.component';
import { PageSupportComponent } from './components/pages/page-support/page-support.component';
import { PageUserComponent } from './components/pages/page-user/page-user.component';
import { PageQuestionsComponent } from './components/pages/page-questions/page-questions.component';

// APPLICATION WIDGET COMPONENTS
import { WidgetFeedbackComponent } from './components/widgets/widget-feedback/widget-feedback.component';
import { WidgetSettingsComponent } from './components/widgets/widget-settings/widget-settings.component';
import { WidgetDeviceComponent } from './components/widgets/widget-device/widget-device.component';
import { WidgetSecurityComponent } from './components/widgets/widget-security/widget-security.component';
import { WidgetQuestionsComponent } from './components/widgets/widget-questions/widget-questions.component';

// APPLICATION SERVICES
import { DevService } from './services/dev/dev.service';
import { DisplayService } from './services/display/display.service';
import { ContainerService } from './services/container/container.service';
import { CommsService } from './services/comms/comms.service';
import { DashboardService } from './services/dashboard/dashboard.service';
import { DeviceService } from './services/device/device.service';
import { SecurityService } from './services/security/security.service';
import { UserService } from './services/user/user.service';
import { ContainerCardComponent } from './components/container-card/container-card.component';

// FONT AWESOME
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { PageDeviceSettingsComponent } from './components/pages/page-device-settings/page-device-settings.component';
import { PageDeviceUpdatesComponent } from './components/pages/page-device-updates/page-device-updates.component';
import { PageSecurityAntivirusComponent } from './components/pages/page-security-antivirus/page-security-antivirus.component';
import { PageSecurityWifiComponent } from './components/pages/page-security-wifi/page-security-wifi.component';
import { PageSecurityPasswordComponent } from './components/pages/page-security-password/page-security-password.component';
import { PageSecurityInternetComponent } from './components/pages/page-security-internet/page-security-internet.component';
library.add(fas);

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
		WidgetFeedbackComponent,
		WidgetSettingsComponent,
		WidgetDeviceComponent,
		WidgetSecurityComponent,
		WidgetQuestionsComponent,
		PageQuestionsComponent,
		ContainerCardComponent,
		HeaderMainComponent,
		PageDeviceSettingsComponent,
		PageDeviceUpdatesComponent,
		PageSecurityAntivirusComponent,
		PageSecurityWifiComponent,
		PageSecurityPasswordComponent,
		PageSecurityInternetComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		HttpClientModule,
		FontAwesomeModule
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
	bootstrap: [AppComponent]
})
export class AppModule { }
