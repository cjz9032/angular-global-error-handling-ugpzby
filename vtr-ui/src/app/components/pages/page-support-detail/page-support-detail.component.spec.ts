import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSupportDetailComponent } from './page-support-detail.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpLoaderFactory, TranslationModule } from 'src/app/modules/translation.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { QaService } from 'src/app/services/qa/qa.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Observable } from 'rxjs';

xdescribe('PageSupportDetailComponent', () => {
	let component: PageSupportDetailComponent;
	let fixture: ComponentFixture<PageSupportDetailComponent>;
	let qaService: QaService;
	let translateService: TranslateService;
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PageSupportDetailComponent],
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
			providers: [TranslateService, QaService, {
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
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PageSupportDetailComponent);
		// translateService.use('en');
		component = fixture.componentInstance;
		qaService = TestBed.get(QaService);
		translateService = TestBed.get(TranslateService);

		fixture.detectChanges();
	});

	it('should create', () => {

		// spyOn(translateService, 'instant').and.callThrough();
		// spyOn(qaService, 'getById').and.callThrough();
		expect(qaService).toBeTruthy();
		expect(component).toBeTruthy();
	});


});
