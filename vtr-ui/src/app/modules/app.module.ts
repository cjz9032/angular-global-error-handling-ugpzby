import { HomeComponent } from './../components/home/home.component';
import { AppComponent } from '../app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { GlobalErrorHandler } from '../services/error-handler/global.service';
import { HttpLoaderFactory } from './translation.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../services/common/common.service';
import { MetricsTranslateService } from '../services/mertics-traslate/metrics-translate.service';
import { NavbarModule } from './common/navbar.module';
import { DevService } from '../services/dev/dev.service';
import { DisplayService } from '../services/display/display.service';
import { CookieService } from 'ngx-cookie-service';
import { CommsService } from '../services/comms/comms.service';
import { ModalWelcomeComponent } from '../components/modal/modal-welcome/modal-welcome.component';
import { NgbTooltipModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { UiButtonModule } from '../components/ui/ui-button/ui-button.module';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faExclamation } from '@fortawesome/free-solid-svg-icons/faExclamation';
import { faBolt } from '@fortawesome/pro-light-svg-icons/faBolt';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons/faMinusCircle';
import { faChevronUp } from '@fortawesome/pro-light-svg-icons/faChevronUp';
import { faChevronDown } from '@fortawesome/pro-light-svg-icons/faChevronDown';
import { faCircleNotch } from '@fortawesome/pro-light-svg-icons/faCircleNotch';
import { faBrowser } from '@fortawesome/pro-light-svg-icons/faBrowser';
import { faGift } from '@fortawesome/pro-light-svg-icons/faGift';
import { faCommentAltDots } from '@fortawesome/pro-light-svg-icons/faCommentAltDots';
import { faShoePrints } from '@fortawesome/pro-light-svg-icons/faShoePrints';
import { RouterModule } from '@angular/router';
import { faChevronRight } from '@fortawesome/pro-light-svg-icons/faChevronRight';
import { faFlask } from '@fortawesome/pro-light-svg-icons/faFlask';
import { ModalAboutComponent } from '../components/modal/modal-about/modal-about.component';
import { ModalFindUsComponent } from 'src/app/components/modal/modal-find-us/modal-find-us.component';
import { CommonPipeModule } from './common/common-pipe.module';
import { ModalArticleDetailComponent } from '../components/modal/modal-article-detail/modal-article-detail.component';
import { SharedModule } from './shared.module';
import { ModalLicenseComponent } from 'src/app/components/modal/modal-license/modal-license.component';
import { ModalServerSwitchComponent } from 'src/app/components/modal/modal-server-switch/modal-server-switch.component'; // VAN-5872, server switch feature
import { ModernPreloadModule } from './modern-preload/modern-preload.module';

import { faWifiSlash} from '@fortawesome/pro-light-svg-icons/faWifiSlash';

library.add(faCheck);
library.add(faExclamation);
library.add(faBolt);
library.add(faChevronRight);
library.add(faTimesCircle);
library.add(faCaretUp);
library.add(faCaretDown);
library.add(faPlusCircle);
library.add(faMinusCircle);
library.add(faChevronUp);
library.add(faChevronDown);
library.add(faCircleNotch);
library.add(faBrowser);
library.add(faGift);
library.add(faCommentAltDots);
library.add(faShoePrints);
library.add(faWifiSlash);
library.add(faFlask);

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		ModalWelcomeComponent,
		ModalAboutComponent,
		ModalFindUsComponent,
		ModalArticleDetailComponent,
		ModalLicenseComponent,
		ModalServerSwitchComponent
	],
	imports: [
		BrowserModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			},
			isolate: false
		}),
		AppRoutingModule,
		NavbarModule,
		NgbModalModule,
		NgbTooltipModule,
		UiButtonModule,
		RouterModule,
		CommonPipeModule,
		SharedModule,
		ModernPreloadModule,
	],
	exports: [
		NavbarModule,
		RouterModule,
		CommonPipeModule,
		SharedModule,
		ModernPreloadModule,
	],
	providers: [
		CommonService,
		MetricsTranslateService,
		DevService,
		DisplayService,
		CookieService,
		CommsService,
		{ provide: ErrorHandler, useClass: GlobalErrorHandler }
	],
	entryComponents: [
		ModalWelcomeComponent,
		ModalAboutComponent,
		ModalFindUsComponent,
		ModalArticleDetailComponent,
		ModalLicenseComponent,
		ModalServerSwitchComponent
	],
	bootstrap: [AppComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
