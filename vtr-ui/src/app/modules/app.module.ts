import { AppComponent } from '../app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { CommonPipeModule } from './common/common-pipe.module';
import { CommonService } from '../services/common/common.service';
import { CommonUiModule } from './common/common-ui.module';
import { CommsService } from '../services/comms/comms.service';
import { CookieService } from 'ngx-cookie-service';
import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { DevService } from '../services/dev/dev.service';
import { DisplayService } from '../services/display/display.service';
import { environment } from 'src/environments/environment';
import { faBolt } from '@fortawesome/pro-light-svg-icons/faBolt';
import { faBrowser } from '@fortawesome/pro-light-svg-icons/faBrowser';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons/faCaretRight';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faChevronDown } from '@fortawesome/pro-light-svg-icons/faChevronDown';
import { faChevronRight } from '@fortawesome/pro-light-svg-icons/faChevronRight';
import { faChevronUp } from '@fortawesome/pro-light-svg-icons/faChevronUp';
import { faCircleNotch } from '@fortawesome/pro-light-svg-icons/faCircleNotch';
import { faCloudDownload } from '@fortawesome/pro-light-svg-icons/faCloudDownload';
import { faCommentAltDots } from '@fortawesome/pro-light-svg-icons/faCommentAltDots';
import { faExclamation } from '@fortawesome/free-solid-svg-icons/faExclamation';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { faFlask } from '@fortawesome/pro-light-svg-icons/faFlask';
import { faGift } from '@fortawesome/pro-light-svg-icons/faGift';
import { faHeart } from '@fortawesome/pro-light-svg-icons/faHeart';
import { faLaptop } from '@fortawesome/pro-light-svg-icons/faLaptop';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons/faMinusCircle';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons/faQuestionCircle';
import { faShoePrints } from '@fortawesome/pro-light-svg-icons/faShoePrints';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import { faWifiSlash } from '@fortawesome/pro-light-svg-icons/faWifiSlash';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalErrorHandler } from '../services/error-handler/global.service';
import { HomeComponent } from './../components/home/home.component';
import { HttpClient } from '@angular/common/http';
import { library } from '@fortawesome/fontawesome-svg-core';
import { MetricsTranslateService } from '../services/mertics-traslate/metrics-translate.service';
import { MissingTranslationDefaultHandler } from '../i18n/handler/missing-tranlsation-default-handler';
import { MissingTranslationHandler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ModalAppUpdateAvailableComponent } from '../components/modal/modal-app-update-available/modal-app-update-available.component';
import { ModalArticleDetailComponent } from '../components/modal/modal-article-detail/modal-article-detail.component';
import { ModalDccDetailComponent } from '../components/modal/modal-dcc-detail/modal-dcc-detail.component';
import { ModalServerSwitchComponent } from 'src/app/components/modal/modal-server-switch/modal-server-switch.component';
import { ModalWelcomeComponent } from '../components/modal/modal-welcome/modal-welcome.component';
import { ModernPreloadModule } from './modern-preload/modern-preload.module';
import { NavbarModule } from './common/navbar.module';
import { NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PageLayoutModule } from '../components/page-layout/page-layout.module';
import { PageSettingsComponent } from '../components/pages/page-settings/page-settings.component';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { UiButtonModule } from '../components/ui/ui-button/ui-button.module';
import { WebpackTranslateLoader } from '../i18n/loader/webpack-translate-loader.loader';
import { HardwareDashboardModule } from './hardware-settings/hardware-dashboard.module';
import { GamingDashboardModule } from './gaming-dashboard.module';
@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		ModalWelcomeComponent,
		ModalArticleDetailComponent,
		ModalDccDetailComponent,
		ModalServerSwitchComponent,
		ModalAppUpdateAvailableComponent,
		PageSettingsComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production, registrationStrategy: 'registerImmediately' }),
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useClass: WebpackTranslateLoader,
				deps: [HttpClient]
			},
			missingTranslationHandler: {
				provide: MissingTranslationHandler,
				useClass: MissingTranslationDefaultHandler
			},
			isolate: false
		}),
		NavbarModule,
		NgbModalModule,
		NgbTooltipModule,
		UiButtonModule,
		RouterModule,
		CommonPipeModule,
		CommonUiModule,
		FormsModule,
		ReactiveFormsModule,
		ModernPreloadModule,
		PageLayoutModule,
		FontAwesomeModule,
		HardwareDashboardModule,
		GamingDashboardModule
	],
	exports: [
		NavbarModule,
		RouterModule,
		CommonPipeModule,
		CommonUiModule,
		ModernPreloadModule,
		PageLayoutModule,
	],
	providers: [
		CommonService,
		MetricsTranslateService,
		DevService,
		DisplayService,
		CookieService,
		CommsService
	],
	entryComponents: [
		ModalWelcomeComponent,
		ModalArticleDetailComponent,
		ModalDccDetailComponent,
		ModalServerSwitchComponent,
		ModalAppUpdateAvailableComponent,
	],
	bootstrap: [AppComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
	constructor() {
		library.add(faCheck);
		library.add(faExclamation);
		library.add(faBolt);
		library.add(faChevronRight);
		library.add(faTimesCircle);
		library.add(faCaretUp);
		library.add(faCaretRight);
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
		library.add(faExclamationTriangle);
		library.add(faExclamationCircle);
		library.add(faQuestionCircle);
		library.add(faCloudDownload);
		library.add(faLaptop);
		library.add(faHeart);
	}
}
