import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalDccDetailComponent } from './modal-dcc-detail.component';

xdescribe('ModalDccDetailComponent', () => {
	let component: ModalDccDetailComponent;
	let fixture: ComponentFixture<ModalDccDetailComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ModalDccDetailComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalDccDetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
