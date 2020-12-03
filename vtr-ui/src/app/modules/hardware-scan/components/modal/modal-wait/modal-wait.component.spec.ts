import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalWaitComponent } from './modal-wait.component';

xdescribe('ModalWait', () => {
	let component: ModalWaitComponent;
	let fixture: ComponentFixture<ModalWaitComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ModalWaitComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalWaitComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
