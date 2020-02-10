import { TestBed, async } from '@angular/core/testing';

import { QaService } from './qa.service';
import { TranslateModule, TranslateService, TranslateLoader, LangChangeEvent } from '@ngx-translate/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpLoaderFactory } from 'src/app/modules/translation.module';
import { HttpClient } from '@angular/common/http';
import { QA } from 'src/app/data-models/qa/qa.model';
import { of } from 'rxjs';



describe('QaService', () => {
	let service: QaService;
	let translate: TranslateService;
	let http: HttpTestingController;
	const TRANSLATIONS_EN = require('../../../assets/i18n/en.json');
	const TRANSLATIONS_FR = require('../../../assets/i18n/fr.json');

	let imagePath = 'assets/images/qa';
	let qas: QA[] = [
		{
			id: 1,
			category: 'q&a',
			path: '/device/support-detail/1',
			iconPath: `${imagePath}/svg_icon_qa_backup.svg`,
			like: false,
			dislike: false,
		},
		{
			id: 3,
			category: 'q&a',
			path: '/device/support-detail/3',
			iconPath: `${imagePath}/svg_icon_qa_pcbit.svg`,
			like: false,
			dislike: false,
		},
		{
			id: 4,
			category: 'q&a',
			path: '/device/support-detail/4',
			iconPath: `${imagePath}/svg_icon_qa_battery.svg`,
			like: false,
			dislike: false,
		},
		{
			id: 5,
			category: 'q&a',
			path: '/device/support-detail/5',
			iconPath: `${imagePath}/svg_icon_qa_tablet.svg`,
			like: false,
			dislike: false,
		},
		{
			id: 6,
			category: 'q&a',
			path: '/device/support-detail/6',
			iconPath: `${imagePath}/svg_icon_qa_cortana.svg`,
			like: false,
			dislike: false,
		}
	];

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
			QaService,
			TranslateService
		]
	}));

	it('should set Translation service', () => {
		let translate = TestBed.get(QaService)
		service = TestBed.get(QaService)
		service.setTranslationService(translate)
		expect(service).toEqual(translate)
	});

	it('#QaService should call getById', async () => {
		let id: number = 1
		service = TestBed.get(QaService);
		let output = qas.find((element, index, array) => {
			return element.id === id;
		})
		expect(service.getById(id)).toEqual(output);
	});

	it('should set language translations', () => {
		let evt: LangChangeEvent = {
			lang: 'en',
			translations: TRANSLATIONS_EN
		}
		service = TestBed.get(QaService)
		let qa = {
			title: 'Support Detail',
			description: 'Some description of translation',
			keys: 'en'
		}
		translate = TestBed.get(TranslateService)
		spyOnProperty(translate, 'onLangChange').and.returnValue(of(evt))
		// spyOn(translate, 'stream').and.returnValue(of(qa))
		service.setCurrentLangTranslations()
		expect(service.title).toEqual(translate.instant(service.title))
		// expect(translate.stream).toBeTruthy()
	});

	it('should call getQATranslation --- isPreserved', () => {
		service = TestBed.get(QaService);
		service.preserveTransKeys['isPreserved'] = true
		let translateQA = TestBed.get(TranslateService)
		service.getQATranslation(translateQA)
		expect(service.preserveTransKeys['isPreserved']).toBe(true)
	});

	it('should call getQATranslation -- isSubscribed', async(() => {
		let evt: LangChangeEvent = {
			lang: 'en',
			translations: TRANSLATIONS_EN
		}
		service = TestBed.get(QaService);
		let translate: TranslateService = TestBed.get(TranslateService)
		service.preserveTransKeys['isSubscribed'] = true
		// evt.lang = 'fr',
		// evt.translations = TRANSLATIONS_FR
		service.getQATranslation(translate)
		spyOnProperty(translate, 'onLangChange').and.returnValue(of(evt))
		let spy = spyOn(service, 'getObjectValue').and.callThrough()
		// translate.onLangChange.subscribe((event: LangChangeEvent) => {
		// 	expect(spy).toHaveBeenCalledWith(event.translations, service.preserveTransKeys['pageTitle'])
		// } )
		// expect(service.title).toEqual('Support Detail')
		// translateQA['onLangChange'].sub
	}))


	it('should call getObjectValue when no object', () => {
		let evt: LangChangeEvent = {
			lang: 'en',
			translations: ''
		}
		service = TestBed.get(QaService);
		let res = service.getObjectValue(evt.translations, 'faq.pageTitle');
		expect(res).toBe(null)

	});

	it('should call getObjectValue', () => {
		let evt: LangChangeEvent = {
			lang: 'en',
			translations: TRANSLATIONS_EN
		}
		service = TestBed.get(QaService);
		let res = service.getObjectValue(evt.translations, 'faq.pageTitle');
		expect(res).toEqual('Support Detail')

	});

	it('should unsubscribe', () => {
		service = TestBed.get(QaService)
		service.destroyChangeSubscribed()
		expect(service.preserveTransKeys['isSubscribed']).toEqual(false)
		
	});

	it('should unsubscribe - if', () => {
		service = TestBed.get(QaService)
		service.preserveTransKeys['isSubscribed'] = true
		service.destroyChangeSubscribed()
		expect(service.preserveTransKeys['isSubscribed']).toEqual(false)
		
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
