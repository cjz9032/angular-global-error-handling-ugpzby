import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLicenseComponent } from './modal-license.component';

xdescribe('ModalLicenseComponent', () => {
	let component: ModalLicenseComponent;
	let fixture: ComponentFixture<ModalLicenseComponent>;

	beforeEach(async(() => {
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
