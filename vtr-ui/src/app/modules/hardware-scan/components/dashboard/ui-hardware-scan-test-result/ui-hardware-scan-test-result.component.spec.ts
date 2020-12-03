import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiHardwareScanTestResultComponent } from './ui-hardware-scan-test-result.component';

xdescribe('UiHardwareScanTestResultComponent', () => {
	let component: UiHardwareScanTestResultComponent;
	let fixture: ComponentFixture<UiHardwareScanTestResultComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UiHardwareScanTestResultComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiHardwareScanTestResultComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
