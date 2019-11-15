import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopRowFunctionsIdeapadComponent } from './top-row-functions-ideapad.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory, TranslationModule } from 'src/app/modules/translation.module';
import { HttpClientModule } from '@angular/common/http';

describe('TopRowFunctionsIdeapadComponent', () => {
	let component: TopRowFunctionsIdeapadComponent;
	let fixture: ComponentFixture<TopRowFunctionsIdeapadComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TopRowFunctionsIdeapadComponent],
			imports: [FontAwesomeModule, TranslateModule.forRoot({
				loader: {
					provide: TranslateLoader,
					useFactory: HttpLoaderFactory,
					deps: [HttpClientModule]
				},
				isolate: false
			}),
				TranslationModule.forChild(), HttpClientModule],
			schemas: [NO_ERRORS_SCHEMA]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TopRowFunctionsIdeapadComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
