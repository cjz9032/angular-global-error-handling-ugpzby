import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSupportDetailComponent } from './page-support-detail.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpLoaderFactory, TranslationModule } from 'src/app/modules/translation.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { QaService } from 'src/app/services/qa/qa.service';
import { ActivatedRoute, convertToParamMap, Router, Data, Params } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HeaderMainComponent } from '../../header-main/header-main.component';

/* const TRANSLATIONS_EN = require('../../../../assets/i18n/en.json');
const TRANSLATIONS_FR = require('../../../../assets/i18n/fr.json');

class FakeLoader implements TranslateLoader {
	getTranslation(lang: string): Observable<any> {
		return of(translations);
	}
} */

const testQuestion = {
	faq: {
		pageTitle: 'Support Detail',
		footer: {
			title: 'Not finding what you are looking for?',
			description: 'NEED ADDITIONAL SUPPORT? DON’T HESITATE TO CONTACT US VIA:',
			body: 'Lenovo Community',
			button: 'GO TO FORUM'
		},
		question1: {
			title: 'Back up and restore your files',
			description: '<div><div class=\'faqInFs4Fb\'>Back up and restore your files</div><hr /><div class=\'faqInMb7\'>It\'s always good to have a backup. Keep copies of your files on another drive in case something happens to the originals.</div><div class=\'faqInFs3Fb\'>Set up your backup</div><hr /><div class=\'mb-5\'>Select the <span class=\'faqInFb\'>Start</span> button, select <span class=\'faqInFb\'>Settings</span> > <span class=\'faqInFb\'>Update & security</span> > <span class=\'faqInFb\'>Backup</span> > <span class=\'faqInFb\'>Add a drive</span> , and then choose an external drive or network location for your backups.</div><div class=\'mb-5\'><img src=\'./../../../../assets/images/qa/1.1.png\' /></div><div class=\'mb-5\'>All set. Every hour, we\'ll back up everything in your user folder (C:\\Users\\username). To change which files get backed up or how often backups happen, go to <span class=\'faqInFb\'>More options</span>.</div><div class=\'faqInFs3Fb\'>Restore your files</div><div class=\'mb-5\'>If you\'re missing an important file or folder, here\'s how to get it back:</div><div><div class=\'mb-3\'>1. Type <span class=\'faqInFb\'>Restore files</span> in the search box on the taskbar, and then select <span class=\'faqInFb\'> Restore your files with File History</span>.</div><div class=\'mb-3\'>2. Look for the file you need, then use the arrows to see all its versions</div><div class=\'mb-3\'>3. When you find the version you want, select <span class=\'faqInFb\'>Restore</span> to save it in its original location. To save it in a different place, press and hold (or right-click) <span class=\'faqInFb\'>Restore</span>, select <span class=\'faqInFb\'>Restore to</span>, and then choose a new location. </div></div></div>',
			para1: {
				line1: 'It\'s always good to have a backup.',
				line2: 'Keep copies of your files on another drive in case something happens to the originals.'
			},
			heading1: 'Set up your backup',
			para2: {
				span1: 'Select the',
				span2: 'Start',
				span3: 'button, select',
				span4: 'Settings',
				span5: 'Update & security',
				span6: 'Backup',
				span7: 'Add a drive',
				span8: ', and then choose an external drive or network location for your backups.'
			},
			para3: {
				span1: 'All set.',
				span2: 'Every hour, we\'ll back up everything in your user folder (C:\\Users\\username).',
				span3: 'To change which files get backed up or how often backups happen, go to',
				span4: 'More options.'
			},
			heading2: 'Restore your files',
			para4: 'If you\'re missing an important file or folder, here\'s how to get it back:',
			para5: {
				span1: '1. Type',
				span2: 'Restore files',
				span3: 'in the search box on the taskbar, and then select',
				span4: 'Restore your files with File History.',
				span5: '2. Look for the file you need, then use the arrows to see all its versions',
				span6: '3. When you find the version you want, select',
				span7: 'Restore',
				span8: 'to save it in its original location. To save it in a different place, press and hold (or right-click)',
				span9: 'Restore',
				span10: ', select',
				span11: 'Restore to',
				span12: 'and then choose a new location.'
			}
		}
	}
};

const router = jasmine.createSpyObj('Router', ['navigate']);

describe('PageSupportDetailComponent', () => {
	let component: PageSupportDetailComponent;
	let fixture: ComponentFixture<PageSupportDetailComponent>;
	let qaService: QaService;
	let translate: TranslateService;
	// let http: HttpTestingController;

	/* 	beforeEach(async(() => {
			TestBed.configureTestingModule({
				declarations: [PageSupportDetailComponent],
				imports: [HttpClientModule, HttpClientTestingModule, TranslateModule.forRoot({
					loader: {
						provide: TranslateLoader,
						useFactory: HttpLoaderFactory,
						deps: [HttpClient],
						useClass: FakeLoader
					},
					isolate: false
				}),
					TranslationModule.forChild()
				],
				providers: [TranslateService, HttpTestingController, QaService, {
					provide: ActivatedRoute,
					useValue: {
						snapshot: {
							paramMap: convertToParamMap({ id: 1 })
						}
					}
				}],
				schemas: [NO_ERRORS_SCHEMA],
			})
				.compileComponents();
			translate = TestBed.get(TranslateService);
			http = TestBed.get(HttpTestingController);

		})); */

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PageSupportDetailComponent, HeaderMainComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [HttpClientModule, HttpClientTestingModule, TranslateModule.forRoot({
				loader: {
					provide: TranslateLoader,
					useFactory: HttpLoaderFactory,
					deps: [HttpClient]
				},
				isolate: false
			}),
				TranslationModule.forChild()
			],
			providers: [TranslateService, QaService,
				{
					provide: Router,
					useClass: router,
				},
				{
					provide: ActivatedRoute,
					useValue: {
						data: {
							subscribe: (fn: (value: Data) => void) => fn({
								id: 1,
							}),
						},
						params: {
							subscribe: (fn: (value: Params) => void) => fn({
								id: 1,
							}),
						},
						snapshot: {
							url: [
								{
									path: 'support-detail',
								}
							],
						},
					},
				},
			],
		})
			.overrideComponent(PageSupportDetailComponent, {
				set: {
					template: '',
				}
			});
	}));

	beforeEach(async () => {
		fixture = TestBed.createComponent(PageSupportDetailComponent);
		// translateService.use('en');
		component = fixture.debugElement.componentInstance;
		translate = TestBed.get(TranslateService);
		qaService = TestBed.get(QaService);
		fixture.detectChanges();
	});

	it('#PageSupportDetailComponent should create', async () => {
		expect(qaService).toBeTruthy();
		expect(component).toBeTruthy();
	});

	it('#PageSupportDetailComponent #qaService setTranslationService ', async () => {

		spyOn(qaService, 'setTranslationService').and.callThrough();
		translate.resetLang('el');
		qaService.preserveTransKeys.isSubscribed = false;
		qaService.setTranslationService(translate);
		expect(qaService.setTranslationService).toHaveBeenCalled();

	});

	it('#PageSupportDetailComponent #qaService setCurrentLangTranslations ', async () => {
		spyOn(translate.onLangChange, 'subscribe').and.callThrough();
		spyOn(qaService, 'setCurrentLangTranslations').and.callThrough();
		//translate.resetLang('es');
		translate.use('es');
		qaService.preserveTransKeys.isSubscribed = false;
		qaService.setCurrentLangTranslations();
		expect(qaService.setCurrentLangTranslations).toHaveBeenCalled();
	});


	it('#PageSupportDetailComponent #qaService getQATranslation qaService.preserveTransKeys.isSubscribed false ', async () => {
		spyOn(qaService, 'getQATranslation').and.callThrough();
		// translate.use('fr');
		translate.resetLang('fr');
		qaService.preserveTransKeys.isSubscribed = false;
		qaService.getQATranslation(translate);
		// passes
		expect(qaService.getQATranslation).toHaveBeenCalled();

	});

	it('#PageSupportDetailComponent #qaService getObjectValue ', async () => {
		spyOn(qaService, 'getObjectValue').and.callThrough();
		// translate.use('fr');
		translate.resetLang('fr');
		qaService.preserveTransKeys.isSubscribed = false;
		qaService.getObjectValue(testQuestion, 'faq.question1.title');
		// passes
		expect(qaService.getObjectValue).toHaveBeenCalled();

	});

	it('#PageSupportDetailComponent onNavigate', async () => {
		spyOn(component, 'onNavigate').and.callThrough();
		component.onNavigate();
		// passes
		expect(component.onNavigate).toHaveBeenCalled();

	});


});
