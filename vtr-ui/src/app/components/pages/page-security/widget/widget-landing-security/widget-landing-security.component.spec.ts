import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetLandingSecurityComponent } from './widget-landing-security.component';
import { UiButtonModule } from 'src/app/components/ui/ui-button/ui-button.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UiButtonComponent } from 'src/app/components/ui/ui-button/ui-button.component';

xdescribe('WidgetLandingSecurityComponent', () => {
	let component: WidgetLandingSecurityComponent;
	let fixture: ComponentFixture<WidgetLandingSecurityComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetLandingSecurityComponent, UiButtonComponent],
			schemas: [NO_ERRORS_SCHEMA]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetLandingSecurityComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
