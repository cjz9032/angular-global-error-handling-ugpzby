import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiHeaderWarrantyComponent } from './ui-header-warranty.component';

xdescribe('UiHeaderWarrantyComponent', () => {
	let component: UiHeaderWarrantyComponent;
	let fixture: ComponentFixture<UiHeaderWarrantyComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiHeaderWarrantyComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiHeaderWarrantyComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
