import { TestBed, async } from '@angular/core/testing';

import { QaService } from './qa.service';
import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';
import { Injector } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpLoaderFactory } from 'src/app/modules/translation.module';
import { HttpClient } from '@angular/common/http';

const TRANSLATIONS_EN = require('../../../assets/i18n/en.json');
const TRANSLATIONS_FR = require('../../../assets/i18n/fr.json');

describe('QaService', () => {
	let service: QaService = null;
	let translateService: TranslateService = null;
	// let injector: Injector;
	// let translate: TranslateService;
	let http: HttpTestingController;

	beforeEach(() => TestBed.configureTestingModule({
		imports: [
			HttpClientTestingModule,
			TranslateModule.forRoot({
				loader: {
					provide: TranslateLoader,
					useFactory: HttpLoaderFactory,
					deps: [HttpClient]
				}
			})
		],
		providers: [
			TranslateService
		]
	}));

	it('#QaService should be created', async () => {
		service = TestBed.get(QaService);
		translateService = TestBed.get(TranslateService);
		http = TestBed.get(HttpTestingController);
		expect(service).toBeTruthy();
		expect(translateService).toBeTruthy();
	});



	/* it('#QaService setCurrentLangTranslations ', async () => {
		spyOn(service, 'setCurrentLangTranslations').and.callThrough();
		translateService.use('fr');
		service.setTranslationService(translateService);
		service.setCurrentLangTranslations();
		// passes
		expect(service.setCurrentLangTranslations).toHaveBeenCalled();
	}); */



	/* it('#QaService setTranslationService ', async () => {
		spyOn(translateService, 'getBrowserLang').and.returnValue('en');
		spyOn(service, 'setTranslationService').and.callThrough();
		translateService.use('fr');
		service.setTranslationService(translateService);
		// passes
		expect(service.setTranslationService).toHaveBeenCalled();
	});

	it('#QaService getById ', async () => {
		spyOn(service, 'getById').and.callThrough();
		// translateService.use('fr');
		service.getById(1);
		// passes
		expect(service.getById).toHaveBeenCalled();
	}); */

});
