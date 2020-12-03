import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalLicenseComponent } from './modal-license.component';

xdescribe('ModalLicenseComponent', () => {
	let component: ModalLicenseComponent;
	let fixture: ComponentFixture<ModalLicenseComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ModalLicenseComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalLicenseComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
