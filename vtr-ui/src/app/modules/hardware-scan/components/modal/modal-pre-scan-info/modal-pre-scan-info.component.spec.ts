import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalPreScanInfoComponent } from './modal-pre-scan-info.component';

xdescribe('ModalPreScanInfoComponent', () => {
	let component: ModalPreScanInfoComponent;
	let fixture: ComponentFixture<ModalPreScanInfoComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ModalPreScanInfoComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalPreScanInfoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
