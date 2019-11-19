import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopRowFunctionsComponent } from './top-row-functions.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslationModule } from 'src/app/modules/translation.module';
import { TranslateStore } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TopRowFunctionsComponent', () => {
	let component: TopRowFunctionsComponent;
	let fixture: ComponentFixture<TopRowFunctionsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TopRowFunctionsComponent],
			imports:[FontAwesomeModule,TranslationModule.forChild()],
			schemas:[NO_ERRORS_SCHEMA],
			providers:[TranslateStore]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TopRowFunctionsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
