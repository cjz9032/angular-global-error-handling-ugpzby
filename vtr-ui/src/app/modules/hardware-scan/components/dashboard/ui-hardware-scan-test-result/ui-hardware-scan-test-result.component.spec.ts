import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiHardwareScanTestResultComponent } from './ui-hardware-scan-test-result.component';

xdescribe('UiHardwareScanTestResultComponent', () => {
	let component: UiHardwareScanTestResultComponent;
	let fixture: ComponentFixture<UiHardwareScanTestResultComponent>;

	beforeEach(async(() => {
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
