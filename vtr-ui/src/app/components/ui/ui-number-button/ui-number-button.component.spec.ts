import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiNumberButtonComponent } from './ui-number-button.component';

xdescribe('UiNumberButtonComponent', () => {
	let component: UiNumberButtonComponent;
	let fixture: ComponentFixture<UiNumberButtonComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ UiNumberButtonComponent ]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(UiNumberButtonComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
