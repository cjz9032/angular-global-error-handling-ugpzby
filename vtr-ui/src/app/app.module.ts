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
import { ClockComponent } from './components/clock/clock.component';

// APPLICATION PAGE COMPONENTS
import { PageDashboardComponent } from './components/page-dashboard/page-dashboard.component';
import { PageDeviceComponent } from './components/page-device/page-device.component';
import { PageSecurityComponent } from './components/page-security/page-security.component';
import { PageSupportComponent } from './components/page-support/page-support.component';
import { PageUserComponent } from './components/page-user/page-user.component';

//APPLICATION SERVICES
import { DevService } from './services/dev/dev.service';
import { DisplayService } from './services/display/display.service';
import { ContainerService } from './services/container/container.service';
import { CommsService } from './services/comms/comms.service';
import { DashboardService } from './services/dashboard/dashboard.service';
import { DeviceService } from './services/device/device.service';
import { SecurityService } from './services/security/security.service';
import { UserService } from './services/user/user.service';
import { WidgetFeedbackComponent } from './components/widget-feedback/widget-feedback.component';
import { WidgetSettingsComponent } from './components/widget-settings/widget-settings.component';
import { WidgetDeviceComponent } from './components/widget-device/widget-device.component';
import { WidgetSecurityComponent } from './components/widget-security/widget-security.component';
import { WidgetQuestionsComponent } from './components/widget-questions/widget-questions.component';
import { PageQuestionsComponent } from './components/page-questions/page-questions.component';


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
		PageQuestionsComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		HttpClientModule
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
