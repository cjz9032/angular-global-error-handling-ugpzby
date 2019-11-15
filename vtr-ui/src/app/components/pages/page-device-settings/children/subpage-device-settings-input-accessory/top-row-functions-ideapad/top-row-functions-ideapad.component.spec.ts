import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopRowFunctionsIdeapadComponent } from './top-row-functions-ideapad.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';

describe('TopRowFunctionsIdeapadComponent', () => {
	let component: TopRowFunctionsIdeapadComponent;
	let fixture: ComponentFixture<TopRowFunctionsIdeapadComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
            declarations: [TopRowFunctionsIdeapadComponent],
            imports:[FontAwesomeModule],
            schemas:[NO_ERRORS_SCHEMA]
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
