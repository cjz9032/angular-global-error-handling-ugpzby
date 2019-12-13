import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewFeatureTipComponent } from './modal-new-feature-tip.component';

describe('ModalNewFeatureTipComponent', () => {
	let component: ModalNewFeatureTipComponent;
	let fixture: ComponentFixture<ModalNewFeatureTipComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ModalNewFeatureTipComponent]
		})
			.compileComponents();
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
