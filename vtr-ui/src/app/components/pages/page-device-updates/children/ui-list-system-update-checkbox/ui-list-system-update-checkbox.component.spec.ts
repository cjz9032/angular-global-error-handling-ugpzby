import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiListSystemUpdateCheckboxComponent } from './ui-list-system-update-checkbox.component';

xdescribe('UiListSystemUpdateCheckboxComponent', () => {
	let component: UiListSystemUpdateCheckboxComponent;
	let fixture: ComponentFixture<UiListSystemUpdateCheckboxComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UiListSystemUpdateCheckboxComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiListSystemUpdateCheckboxComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
