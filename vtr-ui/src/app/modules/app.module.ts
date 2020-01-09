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
import { faShoePrints } from '@fortawesome/pro-light-svg-icons/faShoePrints';
import { RouterModule } from '@angular/router';
import { faFlask } from '@fortawesome/pro-light-svg-icons/faFlask';
import { ModalArticleDetailComponent } from '../components/modal/modal-article-detail/modal-article-detail.component';
import { ModalServerSwitchComponent } from 'src/app/components/modal/modal-server-switch/modal-server-switch.component'; // VAN-5872, server switch feature
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { faLaptop } from '@fortawesome/pro-light-svg-icons/faLaptop';
import { faHeart } from '@fortawesome/pro-light-svg-icons/faHeart';
import { faWifiSlash } from '@fortawesome/pro-light-svg-icons/faWifiSlash';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { faExclamation } from '@fortawesome/free-solid-svg-icons/faExclamation';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { faGift } from '@fortawesome/pro-light-svg-icons/faGift';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons/faMinusCircle';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons/faQuestionCircle';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GlobalErrorHandler } from '../services/error-handler/global.service';
import { HomeComponent } from './../components/home/home.component';
import { HttpClient } from '@angular/common/http';
import { library } from '@fortawesome/fontawesome-svg-core';
import { MetricsTranslateService } from '../services/mertics-traslate/metrics-translate.service';
import { MissingTranslationDefaultHandler } from '../i18n/handler/missing-tranlsation-default-handler';
import { MissingTranslationHandler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ModalAppUpdateAvailableComponent } from '../components/modal/modal-app-update-available/modal-app-update-available.component';
import { ModalDccDetailComponent } from '../components/modal/modal-dcc-detail/modal-dcc-detail.component';
import { ModalWelcomeComponent } from '../components/modal/modal-welcome/modal-welcome.component';
import { ModernPreloadModule } from './modern-preload/modern-preload.module';
import { NavbarModule } from './common/navbar.module';
import { NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PageLayoutModule } from '../components/page-layout/page-layout.module';
import { PageSettingsComponent } from '../components/pages/page-settings/page-settings.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { UiButtonModule } from '../components/ui/ui-button/ui-button.module';
import { WebpackTranslateLoader } from '../i18n/loader/webpack-translate-loader.loader';
import { ModalNewFeatureTipComponent } from '../components/modal/modal-new-feature-tip/modal-new-feature-tip.component';
import { NewFeatureTipService } from '../services/new-feature-tip/new-feature-tip.service';
import { HardwareDashboardModule } from './hardware-settings/hardware-dashboard.module';
import { GamingDashboardModule } from './gaming-dashboard.module';
import { ToolbarToastModule } from '../services/toolbartoast/toolbartoast.module';
import { ModalErrorMessageComponent } from '../components/modal/modal-error-message/modal-error-message.component';

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		ModalWelcomeComponent,
		ModalArticleDetailComponent,
		ModalDccDetailComponent,
		ModalServerSwitchComponent,
		ModalAppUpdateAvailableComponent,
		ModalNewFeatureTipComponent,
		PageSettingsComponent,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
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
		NewFeatureTipService,
		CommsService,
		{
			provide: ErrorHandler,
			useClass: GlobalErrorHandler
		}
	],
	entryComponents: [
		ModalWelcomeComponent,
		ModalArticleDetailComponent,
		ModalDccDetailComponent,
		ModalServerSwitchComponent,
		ModalAppUpdateAvailableComponent,
		ModalNewFeatureTipComponent,
		ModalErrorMessageComponent
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
