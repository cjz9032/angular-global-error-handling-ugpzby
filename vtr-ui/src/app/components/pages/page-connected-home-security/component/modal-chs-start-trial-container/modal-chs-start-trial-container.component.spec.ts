import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalChsStartTrialContainerComponent } from './modal-chs-start-trial-container.component';

xdescribe('ModalChsStartTrialContainerComponent', () => {
	let component: ModalChsStartTrialContainerComponent;
	let fixture: ComponentFixture<ModalChsStartTrialContainerComponent>;

	beforeEach(async(() => {
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
