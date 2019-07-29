import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiListCheckboxComponent } from './ui-list-checkbox.component';

xdescribe('UiListCheckboxComponent', () => {
	let component: UiListCheckboxComponent;
	let fixture: ComponentFixture<UiListCheckboxComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiListCheckboxComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiListCheckboxComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
