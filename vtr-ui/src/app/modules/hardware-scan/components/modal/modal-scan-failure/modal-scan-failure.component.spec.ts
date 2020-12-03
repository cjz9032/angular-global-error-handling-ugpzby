import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalScanFailureComponent } from './modal-scan-failure.component';

xdescribe('ModalEticketComponent', () => {
	let component: ModalScanFailureComponent;
	let fixture: ComponentFixture<ModalScanFailureComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ModalScanFailureComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalScanFailureComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
