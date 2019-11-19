import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetQaComponent } from './widget-qa.component';
import { SecurityQaService } from 'src/app/services/security/securityQa.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpLoaderFactory, TranslationModule } from 'src/app/modules/translation.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';

describe('WidgetQaComponent', () => {
	let component: WidgetQaComponent;
	let fixture: ComponentFixture<WidgetQaComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetQaComponent],
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
			providers: [SecurityQaService],
			schemas: [NO_ERRORS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetQaComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
