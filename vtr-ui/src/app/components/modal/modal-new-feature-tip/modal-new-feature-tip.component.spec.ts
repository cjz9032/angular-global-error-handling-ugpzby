import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalNewFeatureTipComponent } from './modal-new-feature-tip.component';

xdescribe('ModalNewFeatureTipComponent', () => {
	let component: ModalNewFeatureTipComponent;
	let fixture: ComponentFixture<ModalNewFeatureTipComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ModalNewFeatureTipComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalNewFeatureTipComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
