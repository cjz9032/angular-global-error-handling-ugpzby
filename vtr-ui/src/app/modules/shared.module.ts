import { AngularSvgIconModule } from 'angular-svg-icon';
import { BaseComponent } from '../components/base/base.component';
import { CommonDirectiveModule } from './common/common-directive.module';
import { CommonModule } from '@angular/common';
import { CommonPipeModule } from './common/common-pipe.module';
import { CommsService } from '../services/comms/comms.service';
import { CookieService } from 'ngx-cookie-service';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { DeviceService } from '../services/device/device.service';
import { DevService } from '../services/dev/dev.service';
import { DisplayService } from '../services/display/display.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MockService } from '../services/mock/mock.service.prod';
import { ModalLenovoIdComponent } from '../components/modal/modal-lenovo-id/modal-lenovo-id.component';
import { Ng5SliderModule } from 'ng5-slider';
import { PageUserComponent } from 'src/app/components/pages/page-user/page-user.component';
import { RouterModule } from '@angular/router';
import { SettingsService } from '../services/settings.service';
import { TranslationModule } from './translation.module';
import { UiButtonModule } from '../components/ui/ui-button/ui-button.module';
import { MetricsModule } from '../directives/metrics.module';
import { HeaderMainModule } from '../components/header-main/header-main.module';
import { ModalCommonConfirmationComponent } from 'src/app/components/modal/modal-common-confirmation/modal-common-confirmation.component';
import { AppSearchModule } from 'src/app/beta/app-search/app-search.module';
import { httpInterceptorProviders } from 'src/app/providers/net/http-interceptors';

@NgModule({
	declarations: [
		BaseComponent,
		// HeaderMainComponent,
		// MenuHeaderComponent,
		// UiHeaderWarrantyComponent,
		// MenuMainComponent,
		ModalCommonConfirmationComponent,
		ModalLenovoIdComponent,
		PageUserComponent
	],
	imports: [
		AngularSvgIconModule,
		CommonDirectiveModule,
		CommonModule,
		CommonPipeModule,
		FontAwesomeModule,
		FormsModule,
		HttpClientModule,
		Ng5SliderModule,
		ReactiveFormsModule,
		RouterModule,
		TranslationModule.forChild(),
		UiButtonModule,
		MetricsModule,
		HeaderMainModule,
		AppSearchModule
	],
	exports: [
		AngularSvgIconModule,
		BaseComponent,
		CommonDirectiveModule,
		CommonPipeModule,
		FontAwesomeModule,
		FormsModule,
		HttpClientModule,
		// MenuHeaderComponent,
		// UiHeaderWarrantyComponent,
		// MenuMainComponent,
		ModalCommonConfirmationComponent,
		ModalLenovoIdComponent,
		Ng5SliderModule,
		ReactiveFormsModule,
		RouterModule,
		TranslationModule,
		PageUserComponent,
		UiButtonModule,
		MetricsModule,
		HeaderMainModule,
		AppSearchModule
	],
	providers: [
		CommsService,
		CookieService,
		DevService,
		DeviceService,
		DisplayService,
		MockService,
		SettingsService,
		httpInterceptorProviders
	],
	entryComponents: [
		// ModalWelcomeComponent,
		ModalCommonConfirmationComponent,
		ModalLenovoIdComponent
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class SharedModule { }
