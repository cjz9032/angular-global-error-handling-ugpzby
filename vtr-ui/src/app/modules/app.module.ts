import { AppComponent } from '../app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { CommonPipeModule } from './common/common-pipe.module';
import { CommonService } from '../services/common/common.service';
import { CommonUiModule } from './common/common-ui.module';
import { CookieService } from 'ngx-cookie-service';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
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
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons/faQuoteLeft';
import { RouterModule } from '@angular/router';
import { faFlask } from '@fortawesome/pro-light-svg-icons/faFlask';
import { ModalArticleDetailComponent } from '../components/modal/modal-article-detail/modal-article-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@lenovo/material/dialog';
import {
	MatRippleModule,
	MAT_RIPPLE_GLOBAL_OPTIONS,
	RippleGlobalOptions,
} from '@lenovo/material/core';
import { MatSnackBarModule } from '@lenovo/material/snack-bar';
import { MatTooltipModule, MatTooltipDefaultOptions, MAT_TOOLTIP_DEFAULT_OPTIONS } from '@lenovo/material/tooltip';

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
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { ChunkLoadErrorHandler } from '../services/error-handler/global.service';
import { HttpClient } from '@angular/common/http';
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
import { HardwareScanRoutingModule } from './hardware-scan/hardware-scan-routing.module';
import { HardwareScanModule } from './hardware-scan/hardware-scan.module';
import { CommsService } from '../services/comms/comms.service';
import { UiCustomSliderModule } from '../components/ui/ui-custom-slider/ui-custom-slider.module';
import { UICustomRadioModule } from '../components/ui/ui-custom-radio/ui-custom-radio.module';
import { UiCloseButtonModule } from '../components/ui/ui-close-button/ui-close-button.module';
import { InitializerService } from '../services/initializer/initializer.service';

// import { ModalErrorMessageComponent } from '../components/modal/modal-error-message/modal-error-message.component';
import { ModalStoreRatingComponent } from '../components/modal/modal-store-rating/modal-store-rating.component';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { faEllipsisH } from '@fortawesome/pro-light-svg-icons/faEllipsisH';
import { faTimes } from '@fortawesome/pro-light-svg-icons/faTimes';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons/faHeart';

const globalRippleConfig: RippleGlobalOptions = {
	disabled: true,
	animation: {
		enterDuration: 300,
		exitDuration: 0,
	},
};

const matTooltipDefaultOptions: MatTooltipDefaultOptions = {
	showDelay: 0,
	hideDelay: 0,
	touchendHideDelay: 0,
	position: 'above'
};


@NgModule({
	declarations: [
		AppComponent,
		ModalWelcomeComponent,
		ModalArticleDetailComponent,
		ModalDccDetailComponent,
		ModalAppUpdateAvailableComponent,
		ModalNewFeatureTipComponent,
		PageSettingsComponent,
		ModalStoreRatingComponent,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		ServiceWorkerModule.register('ngsw-worker.js', {
			enabled: environment.production,
			registrationStrategy: 'registerImmediately',
		}),
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useClass: WebpackTranslateLoader,
				deps: [HttpClient],
			},
			missingTranslationHandler: {
				provide: MissingTranslationHandler,
				useClass: MissingTranslationDefaultHandler,
			},
			isolate: false,
		}),
		NavbarModule,
		NgbModalModule,
		NgbTooltipModule,
		UiButtonModule,
		UiCloseButtonModule,
		RouterModule,
		CommonPipeModule,
		CommonUiModule,
		FormsModule,
		ReactiveFormsModule,
		ModernPreloadModule,
		PageLayoutModule,
		FontAwesomeModule,
		HardwareDashboardModule,
		GamingDashboardModule,
		HardwareScanModule,
		HardwareScanRoutingModule,
		UiCustomSliderModule,
		UICustomRadioModule,
		MatDialogModule,
		MatRippleModule,
		MatSnackBarModule,
		MatTooltipModule,
	],
	exports: [
		NavbarModule,
		RouterModule,
		CommonPipeModule,
		CommonUiModule,
		ModernPreloadModule,
		PageLayoutModule,
		UiCustomSliderModule,
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
			useClass: ChunkLoadErrorHandler,
		},
		{
			provide: APP_INITIALIZER,
			useFactory: (initializerService: InitializerService) =>
				initializerService.initialize.bind(initializerService),
			deps: [InitializerService],
			multi: true,
		},
		{ provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: globalRippleConfig },
		{
			provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useFactory: () => matTooltipDefaultOptions
		},
	],
	entryComponents: [
		ModalWelcomeComponent,
		ModalArticleDetailComponent,
		ModalDccDetailComponent,
		ModalAppUpdateAvailableComponent,
		ModalNewFeatureTipComponent,
		// ModalErrorMessageComponent
	],
	bootstrap: [AppComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(faCheck);
		library.addIcons(faExclamation);
		library.addIcons(faBolt);
		library.addIcons(faChevronRight);
		library.addIcons(faTimesCircle);
		library.addIcons(faCaretUp);
		library.addIcons(faCaretRight);
		library.addIcons(faCaretDown);
		library.addIcons(faPlusCircle);
		library.addIcons(faMinusCircle);
		library.addIcons(faChevronUp);
		library.addIcons(faChevronDown);
		library.addIcons(faCircleNotch);
		library.addIcons(faBrowser);
		library.addIcons(faGift);
		library.addIcons(faCommentAltDots);
		library.addIcons(faShoePrints);
		library.addIcons(faWifiSlash);
		library.addIcons(faFlask);
		library.addIcons(faExclamationTriangle);
		library.addIcons(faExclamationCircle);
		library.addIcons(faQuestionCircle);
		library.addIcons(faCloudDownload);
		library.addIcons(faLaptop);
		library.addIcons(faHeart);
		library.addIcons(faEnvelope);
		library.addIcons(faEllipsisH);
		library.addIcons(faTimes);
		library.addIcons(fasHeart);
		library.addIcons(faQuoteLeft);
		library.addIcons(faTrashAlt);
	}
}
