import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetSysupdateComponent } from './widget-sysupdate.component';

describe('WidgetSysupdateComponent', () => {
	let component: WidgetSysupdateComponent;
	let fixture: ComponentFixture<WidgetSysupdateComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetSysupdateComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetSysupdateComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
