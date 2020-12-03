import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalCommonConfirmationComponent } from './modal-common-confirmation.component';

xdescribe('ModalCommonConfirmationComponent', () => {
	let component: ModalCommonConfirmationComponent;
	let fixture: ComponentFixture<ModalCommonConfirmationComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ModalCommonConfirmationComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalCommonConfirmationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
