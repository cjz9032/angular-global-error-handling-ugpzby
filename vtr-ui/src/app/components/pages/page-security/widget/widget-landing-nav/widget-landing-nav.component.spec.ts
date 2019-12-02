import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetLandingNavComponent } from './widget-landing-nav.component';

describe('WidgetLandingNavComponent', () => {
	let component: WidgetLandingNavComponent;
	let fixture: ComponentFixture<WidgetLandingNavComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetLandingNavComponent]
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
