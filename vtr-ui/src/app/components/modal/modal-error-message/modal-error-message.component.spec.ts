import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalErrorMessageComponent } from './modal-error-message.component';

xdescribe('ModalErrorMessageComponent', () => {
	let component: ModalErrorMessageComponent;
	let fixture: ComponentFixture<ModalErrorMessageComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ModalErrorMessageComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalErrorMessageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
