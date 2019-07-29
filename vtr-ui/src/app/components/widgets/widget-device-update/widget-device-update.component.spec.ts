import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetDeviceUpdateComponent } from './widget-device-update.component';

xdescribe('WidgetDeviceUpdateComponent', () => {
	let component: WidgetDeviceUpdateComponent;
	let fixture: ComponentFixture<WidgetDeviceUpdateComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetDeviceUpdateComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetDeviceUpdateComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
