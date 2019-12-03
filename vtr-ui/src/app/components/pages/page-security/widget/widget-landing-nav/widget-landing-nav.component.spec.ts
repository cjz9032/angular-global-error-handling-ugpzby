import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetLandingNavComponent } from './widget-landing-nav.component';
import { WidgetLandingSecurityComponent } from '../widget-landing-security/widget-landing-security.component';
import { StatusTransformPipe } from 'src/app/pipe/ui-security-statusbar/status-transform.pipe';
import { UiButtonModule } from 'src/app/components/ui/ui-button/ui-button.module';
import { UiButtonComponent } from 'src/app/components/ui/ui-button/ui-button.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

fdescribe('WidgetLandingNavComponent', () => {
	let component: WidgetLandingNavComponent;
	let fixture: ComponentFixture<WidgetLandingNavComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetLandingNavComponent, WidgetLandingSecurityComponent, StatusTransformPipe, UiButtonComponent],
			providers: [StatusTransformPipe],
			schemas: [NO_ERRORS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetLandingNavComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
