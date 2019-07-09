import { AngularSvgIconModule } from 'angular-svg-icon';
import { ArticleItemComponent } from '../components/article-item/article-item.component';
import { BaseComponent } from '../components/base/base.component';
import { CommonModule } from '@angular/common';
import { CommonService } from '../services/common/common.service';
import { CommsService } from '../services/comms/comms.service';
import { ContainerArticleComponent } from '../components/container-article/container-article.component';
import { ContainerCardComponent } from '../components/container-card/container-card.component';
import { CookieService } from 'ngx-cookie-service';
import {
	CUSTOM_ELEMENTS_SCHEMA,
	NgModule,
	NO_ERRORS_SCHEMA
} from '@angular/core';
import { DeviceService } from '../services/device/device.service';
import { DevService } from '../services/dev/dev.service';
import { DisplayService } from '../services/display/display.service';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fal } from '@fortawesome/pro-light-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderMainComponent } from '../components/header-main/header-main.component';
import { HttpClientModule } from '@angular/common/http';
import { library } from '@fortawesome/fontawesome-svg-core';
import { MenuHeaderComponent } from '../components/menu-header/menu-header.component';
import { MenuMainComponent } from '../components/menu-main/menu-main.component';
import { MockService } from '../services/mock/mock.service.prod';
import { ModalLenovoIdComponent } from '../components/modal/modal-lenovo-id/modal-lenovo-id.component';
import { ModalWelcomeComponent } from '../components/modal/modal-welcome/modal-welcome.component';
import { Ng5SliderModule } from 'ng5-slider';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonPipeModule } from './common-pipe.module';
import { SettingsService } from '../services/settings.service';
import { TranslationModule } from './translation.module';
import { UserService } from '../services/user/user.service';
import { CommonDirectiveModule } from './common-directive.module';

// FONT AWESOME

library.add(fas);
library.add(fab);
library.add(far);
library.add(fal);

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
	],
	exports: [
		ArticleItemComponent,
		BaseComponent,
		CommonDirectiveModule,
		CommonPipeModule,
		ContainerArticleComponent,
		ContainerCardComponent,
		FormsModule,
		HeaderMainComponent,
		HttpClientModule,
		MenuHeaderComponent,
		MenuMainComponent,
		ModalLenovoIdComponent,
		ModalWelcomeComponent,
		NgbModule,
		ReactiveFormsModule,
		TranslationModule
	],
	imports: [
		AngularSvgIconModule,
		CommonModule,
		CommonPipeModule,
		FontAwesomeModule,
		FormsModule,
		HttpClientModule,
		Ng5SliderModule,
		NgbModule,
		ReactiveFormsModule,
		TranslationModule.forRoot(),
		CommonDirectiveModule
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
		ModalLenovoIdComponent
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA
	]
})
export class SharedModule { }
