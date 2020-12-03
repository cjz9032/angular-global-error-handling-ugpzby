import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiHardwareListTestComponent } from './ui-hardware-list-test.component';

xdescribe('UiHardwareListTestComponent', () => {
	let component: UiHardwareListTestComponent;
	let fixture: ComponentFixture<UiHardwareListTestComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UiHardwareListTestComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiHardwareListTestComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
