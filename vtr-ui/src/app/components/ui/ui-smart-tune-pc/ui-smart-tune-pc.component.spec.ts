import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSmartTunePcComponent } from './ui-smart-tune-pc.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

fdescribe('UiSmartTunePcComponent', () => {
	let component: UiSmartTunePcComponent;
	let fixture: ComponentFixture < UiSmartTunePcComponent > ;

	beforeEach(async (() => {
		TestBed.configureTestingModule({
				declarations: [UiSmartTunePcComponent],
				schemas: [NO_ERRORS_SCHEMA],
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiSmartTunePcComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
