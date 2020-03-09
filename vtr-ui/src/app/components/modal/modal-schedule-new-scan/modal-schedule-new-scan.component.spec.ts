import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalScheduleNewScanComponent } from './modal-schedule-new-scan.component';

xdescribe('ModalScheduleNewScanComponent', () => {
	let component: ModalScheduleNewScanComponent;
	let fixture: ComponentFixture<ModalScheduleNewScanComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ModalScheduleNewScanComponent],
		})
			.compileComponents();
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
