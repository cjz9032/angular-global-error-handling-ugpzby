import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalAboutComponent } from './modal-about.component';

xdescribe('ModalAboutComponent', () => {
	let component: ModalAboutComponent;
	let fixture: ComponentFixture<ModalAboutComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ModalAboutComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalAboutComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
