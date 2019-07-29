import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIntelligentCoolingModesComponent } from './modal-intelligent-cooling-modes.component';

xdescribe('ModalIntelligentCoolingModesComponent', () => {
	let component: ModalIntelligentCoolingModesComponent;
	let fixture: ComponentFixture<ModalIntelligentCoolingModesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ModalIntelligentCoolingModesComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalIntelligentCoolingModesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
