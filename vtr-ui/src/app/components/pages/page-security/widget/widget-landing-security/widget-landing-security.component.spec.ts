import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetLandingSecurityComponent } from './widget-landing-security.component';

describe('WidgetLandingSecurityComponent', () => {
	let component: WidgetLandingSecurityComponent;
	let fixture: ComponentFixture<WidgetLandingSecurityComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetLandingSecurityComponent]
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
