import { async, ComponentFixture, TestBed } from '@angular/core/testing';


import { SecurityQaService } from 'src/app/services/security/securityQa.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpLoaderFactory, TranslationModule } from 'src/app/modules/translation.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { QaService } from 'src/app/services/qa/qa.service';
import { WidgetQuestionsComponent } from './widget-questions.component';
import { WidgetQaComponent } from '../widget-qa/widget-qa.component';

describe('WidgetQuestionsComponent', () => {
	let component: WidgetQuestionsComponent;
	let fixture: ComponentFixture<WidgetQuestionsComponent>;

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
			providers: [SecurityQaService, QaService],
			schemas: [NO_ERRORS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetQuestionsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
