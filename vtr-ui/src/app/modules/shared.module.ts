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
import { SettingsService } from '../services/settings/settings.service';
import { TranslationModule } from './translation.module';
import { UiButtonModule } from '../components/ui/ui-button/ui-button.module';
import { MetricsModule } from '../services/metric/metrics.module';
import { HeaderMainModule } from '../components/header-main/header-main.module';
import { ModalCommonConfirmationComponent } from 'src/app/components/modal/modal-common-confirmation/modal-common-confirmation.component';
import { httpInterceptorProviders } from 'src/app/providers/net/http-interceptors';
import { UiCloseButtonModule } from '../components/ui/ui-close-button/ui-close-button.module';
import { UiHyperlinkButtonComponent } from '../components/ui/ui-hyperlink-button/ui-hyperlink-button.component';
import { UiQuestionMarkButtonComponent } from './hardware-scan/components/dashboard/ui-question-mark-button/ui-question-mark-button.component';

@NgModule({
	declarations: [
		BaseComponent,
		// HeaderMainComponent,
		// MenuHeaderComponent,
		// UiHeaderWarrantyComponent,
		// MenuMainComponent,
		ModalCommonConfirmationComponent,
		ModalLenovoIdComponent,
		PageUserComponent,
		UiHyperlinkButtonComponent,
		UiQuestionMarkButtonComponent
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
		UiCloseButtonModule,
		MetricsModule,
		HeaderMainModule
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
		UiCloseButtonModule,
		MetricsModule,
		HeaderMainModule,
		UiHyperlinkButtonComponent,
		UiQuestionMarkButtonComponent
	],
	providers: [
		CommsService,
		CookieService,
		DevService,
		DeviceService,
		DisplayService,
		MockService,
		SettingsService,
		httpInterceptorProviders,
	],
	entryComponents: [
		// ModalWelcomeComponent,
		ModalCommonConfirmationComponent,
		ModalLenovoIdComponent,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class SharedModule {}
