import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetSwitchIconComponent } from './widget-switch-icon.component';

xdescribe('WidgetSwitchIconComponent', () => {
	let component: WidgetSwitchIconComponent;
	let fixture: ComponentFixture<WidgetSwitchIconComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetSwitchIconComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetSwitchIconComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
