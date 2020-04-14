import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalStoreRatingComponent } from './modal-store-rating.component';

describe('ModalStoreRatingComponent', () => {
	let component: ModalStoreRatingComponent;
	let fixture: ComponentFixture<ModalStoreRatingComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ModalStoreRatingComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalStoreRatingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
