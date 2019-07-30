
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalServerSwitchComponent } from './modal-server-switch.component';

xdescribe('ModalServerSwitchComponent', () => {
	let component: ModalServerSwitchComponent;
	let fixture: ComponentFixture<ModalServerSwitchComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ModalServerSwitchComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalServerSwitchComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
