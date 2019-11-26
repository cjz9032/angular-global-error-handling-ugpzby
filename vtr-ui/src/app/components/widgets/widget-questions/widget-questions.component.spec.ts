import { async, ComponentFixture, TestBed } from '@angular/core/testing';


import { SecurityQaService } from 'src/app/services/security/securityQa.service';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpLoaderFactory, TranslationModule } from 'src/app/modules/translation.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { QaService } from 'src/app/services/qa/qa.service';
import { WidgetQuestionsComponent } from './widget-questions.component';
import { WidgetQaComponent } from '../widget-qa/widget-qa.component';

xdescribe('WidgetQuestionsComponent', () => {
	let component: WidgetQuestionsComponent;
	let fixture: ComponentFixture<WidgetQuestionsComponent>;
	let qaService: QaService;


	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetQuestionsComponent],
			imports: [HttpClientModule, TranslateModule.forRoot({
				loader: {
					provide: TranslateLoader,
					useFactory: HttpLoaderFactory,
					deps: [HttpClient]
				},
				isolate: false
			}),
				TranslationModule.forChild()
			],
			providers: [SecurityQaService, QaService, TranslateService],
			schemas: [NO_ERRORS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetQuestionsComponent);
		component = fixture.componentInstance;
		qaService = TestBed.get(QaService);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('qa service test case set items', () => {
		// spyOn(qaService, 'setCurrentLangTranslations');

		/* component.itemId = "'common.QAndA.itemid'| translate";
		component.description = "'common.qAndA.subtitle' | translate";
		component.items = qaService.qas;
		component.blockPosition = "r2";
		fixture.detectChanges(); */
		// expect(qaService.setCurrentLangTranslations()).toHaveBeenCalled()
		// expect(component).toBeTruthy();
	});

});
