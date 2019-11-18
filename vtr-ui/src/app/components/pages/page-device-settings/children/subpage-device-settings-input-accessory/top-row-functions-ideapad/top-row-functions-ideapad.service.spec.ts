import { async, ComponentFixture, TestBed } from '@angular/core/testing';


import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TopRowFunctionsIdeapadService } from './top-row-functions-ideapad.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory, TranslationModule } from 'src/app/modules/translation.module';
import { HttpClientModule } from '@angular/common/http';

xdescribe('TopRowFunctionsIdeapadService', () => {
	let component: TopRowFunctionsIdeapadService;
	let fixture: ComponentFixture<TopRowFunctionsIdeapadService>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TopRowFunctionsIdeapadService],
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
		fixture = TestBed.createComponent(TopRowFunctionsIdeapadService);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
