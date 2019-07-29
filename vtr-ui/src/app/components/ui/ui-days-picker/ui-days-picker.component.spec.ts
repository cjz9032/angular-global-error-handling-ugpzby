import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiDaysPickerComponent } from './ui-days-picker.component';

xdescribe('UiDaysPickerComponent', () => {
	let component: UiDaysPickerComponent;
	let fixture: ComponentFixture<UiDaysPickerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiDaysPickerComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiDaysPickerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
