import { TestBed, waitForAsync } from '@angular/core/testing';
import { ModalWarrantyCartComponent } from './modal-warranty-cart.component';

describe('ModalWarrantyCartComponent', () => {
	let component: ModalWarrantyCartComponent;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ModalWarrantyCartComponent],
		}).compileComponents();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
