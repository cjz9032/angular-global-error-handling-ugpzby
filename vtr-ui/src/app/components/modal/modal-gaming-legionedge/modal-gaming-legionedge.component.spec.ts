import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGamingLegionedgeComponent } from './modal-gaming-legionedge.component';

xdescribe('ModalGamingLegionedgeComponent', () => {
	let component: ModalGamingLegionedgeComponent;
	let fixture: ComponentFixture<ModalGamingLegionedgeComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ModalGamingLegionedgeComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalGamingLegionedgeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
