import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalScheduleNewScanComponent } from './modal-schedule-new-scan.component';

xdescribe('ModalScheduleNewScanComponent', () => {
	let component: ModalScheduleNewScanComponent;
	let fixture: ComponentFixture<ModalScheduleNewScanComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ModalScheduleNewScanComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalScheduleNewScanComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
