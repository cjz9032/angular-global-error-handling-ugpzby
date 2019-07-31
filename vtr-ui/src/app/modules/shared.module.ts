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
// import { HeaderMainComponent } from '../components/header-main/header-main.component';
import { HttpClientModule } from '@angular/common/http';
// import { MenuHeaderComponent } from '../components/menu-header/menu-header.component';
// import { MenuMainComponent } from '../components/menu-main/menu-main.component';
import { MockService } from '../services/mock/mock.service.prod';
import { ModalLenovoIdComponent } from '../components/modal/modal-lenovo-id/modal-lenovo-id.component';
// import { ModalWelcomeComponent } from '../components/modal/modal-welcome/modal-welcome.component';
import { Ng5SliderModule } from 'ng5-slider';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageUserComponent } from 'src/app/components/pages/page-user/page-user.component';
import { RouterModule } from '@angular/router';
import { SettingsService } from '../services/settings.service';
import { TranslationModule } from './translation.module';
import { UiButtonModule } from '../components/ui/ui-button/ui-button.module';
// import { UiHeaderWarrantyComponent } from 'src/app/components/ui/ui-header-warranty/ui-header-warranty.component';
import { MetricsModule } from '../directives/metrics.module';
import { HeaderMainModule } from '../components/header-main/header-main.module';

@NgModule({
	declarations: [
		BaseComponent,
		// HeaderMainComponent,
		// MenuHeaderComponent,
		// UiHeaderWarrantyComponent,
		// MenuMainComponent,
		ModalLenovoIdComponent,
		// ModalWelcomeComponent,
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
		// NgbModule,
		ReactiveFormsModule,
		RouterModule,
		TranslationModule.forChild(),
		UiButtonModule,
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
		// HeaderMainComponent,
		HttpClientModule,
		// MenuHeaderComponent,
		// UiHeaderWarrantyComponent,
		// MenuMainComponent,
		ModalLenovoIdComponent,
		// ModalWelcomeComponent,
		Ng5SliderModule,
		// NgbModule,
		ReactiveFormsModule,
		RouterModule,
		TranslationModule,
		PageUserComponent,
		UiButtonModule,
		MetricsModule,
		HeaderMainModule
	],
	providers: [
		CommsService,
		CookieService,
		DevService,
		DeviceService,
		DisplayService,
		MockService,
		SettingsService
	],
	entryComponents: [
		// ModalWelcomeComponent,
		ModalLenovoIdComponent
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class SharedModule { }
