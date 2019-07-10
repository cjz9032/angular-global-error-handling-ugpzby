import { AngularSvgIconModule } from 'angular-svg-icon';
import { ArticleItemComponent } from '../components/article-item/article-item.component';
import { BaseComponent } from '../components/base/base.component';
import { CommonDirectiveModule } from './common-directive.module';
import { CommonModule } from '@angular/common';
import { CommonPipeModule } from './common-pipe.module';
import { CommonService } from '../services/common/common.service';
import { CommsService } from '../services/comms/comms.service';
import { ContainerArticleComponent } from '../components/container-article/container-article.component';
import { ContainerCardComponent } from '../components/container-card/container-card.component';
import { CookieService } from 'ngx-cookie-service';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { DeviceService } from '../services/device/device.service';
import { DevService } from '../services/dev/dev.service';
import { DisplayService } from '../services/display/display.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderMainComponent } from '../components/header-main/header-main.component';
import { HttpClientModule } from '@angular/common/http';
import { MenuHeaderComponent } from '../components/menu-header/menu-header.component';
import { MenuMainComponent } from '../components/menu-main/menu-main.component';
import { MockService } from '../services/mock/mock.service.prod';
import { ModalLenovoIdComponent } from '../components/modal/modal-lenovo-id/modal-lenovo-id.component';
import { ModalWelcomeComponent } from '../components/modal/modal-welcome/modal-welcome.component';
import { Ng5SliderModule } from 'ng5-slider';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { SettingsService } from '../services/settings.service';
import { TranslationModule } from './translation.module';
import { UiButtonComponent } from '../components/ui/ui-button/ui-button.component';
import { UserService } from '../services/user/user.service';

@NgModule({
	declarations: [
		ArticleItemComponent,
		BaseComponent,
		ContainerArticleComponent,
		ContainerCardComponent,
		HeaderMainComponent,
		MenuHeaderComponent,
		MenuMainComponent,
		ModalLenovoIdComponent,
		ModalWelcomeComponent,
		UiButtonComponent
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
		NgbModule,
		ReactiveFormsModule,
		RouterModule,
		TranslationModule.forChild()
	],
	exports: [
		AngularSvgIconModule,
		ArticleItemComponent,
		BaseComponent,
		CommonDirectiveModule,
		CommonPipeModule,
		ContainerArticleComponent,
		ContainerCardComponent,
		FontAwesomeModule,
		FormsModule,
		HeaderMainComponent,
		HttpClientModule,
		MenuHeaderComponent,
		MenuMainComponent,
		ModalLenovoIdComponent,
		ModalWelcomeComponent,
		Ng5SliderModule,
		NgbModule,
		ReactiveFormsModule,
		RouterModule,
		TranslationModule,
		UiButtonComponent
	],
	providers: [
		CommonService,
		CommsService,
		CookieService,
		DevService,
		DeviceService,
		DisplayService,
		MockService,
		SettingsService,
		UserService
	],
	entryComponents: [
		ModalWelcomeComponent,
		ModalLenovoIdComponent,
		UiButtonComponent
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA
	]
})
export class SharedModule { }
