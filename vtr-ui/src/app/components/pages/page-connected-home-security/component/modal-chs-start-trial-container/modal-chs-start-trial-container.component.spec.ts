import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalChsStartTrialContainerComponent } from './modal-chs-start-trial-container.component';

xdescribe('ModalChsStartTrialContainerComponent', () => {
	let component: ModalChsStartTrialContainerComponent;
	let fixture: ComponentFixture<ModalChsStartTrialContainerComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ModalChsStartTrialContainerComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalChsStartTrialContainerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
