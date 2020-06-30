import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetLocationStatusComponent } from './widget-location-status.component';

describe('WidgetLocationStatusComponent', () => {
	let component: WidgetLocationStatusComponent;
	let fixture: ComponentFixture<WidgetLocationStatusComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetLocationStatusComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetLocationStatusComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
