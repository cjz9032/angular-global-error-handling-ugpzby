import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalScanFailureComponent } from './modal-scan-failure.component';

xdescribe('ModalEticketComponent', () => {
	let component: ModalScanFailureComponent;
	let fixture: ComponentFixture<ModalScanFailureComponent>;

	beforeEach(async(() => {
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
