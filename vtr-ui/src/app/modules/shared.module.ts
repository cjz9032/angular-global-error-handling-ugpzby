import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationModule } from './translation.module';
import { Ng5SliderModule } from 'ng5-slider';
import { AngularSvgIconModule } from 'angular-svg-icon';

// FONT AWESOME
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fal } from '@fortawesome/pro-light-svg-icons';
import { CookieService } from 'ngx-cookie-service';
import { ModalWelcomeComponent } from '../components/modal/modal-welcome/modal-welcome.component';
import { MetricsDirective } from '../directives/metrics.directive';
import { GlobalErrorHandler } from '../services/error-handler/global.service';
import { PipeModule } from './pipe.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DevService } from '../services/dev/dev.service';
import { SettingsService } from '../services/settings.service';
import { DisplayService } from '../services/display/display.service';
import { DeviceService } from '../services/device/device.service';
import { CommonService } from '../services/common/common.service';
import { UserService } from '../services/user/user.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

library.add(fas);
library.add(fab);
library.add(far);
library.add(fal);

@NgModule({
	declarations: [
		ModalWelcomeComponent,
		MetricsDirective
	],
	exports: [
		MetricsDirective,
		TranslationModule,
		PipeModule,
		FormsModule,
		ReactiveFormsModule,
		NgbModule,
		HttpClientModule
	],
	imports: [
		// BrowserModule,
		CommonModule,
		PipeModule,
		TranslationModule,
		AngularSvgIconModule,
		FontAwesomeModule,
		Ng5SliderModule,
		FormsModule,
		ReactiveFormsModule,
		NgbModule,
		HttpClientModule
	],
	providers: [
		CookieService,
		DevService,
		DisplayService,
		DeviceService,
		CommonService,
		UserService,
		SettingsService,
		{ provide: ErrorHandler, useClass: GlobalErrorHandler }
	],
	entryComponents: [
		ModalWelcomeComponent
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA
	]
})
export class SharedModule { }
