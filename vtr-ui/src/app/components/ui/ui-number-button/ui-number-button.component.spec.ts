import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiNumberButtonComponent } from './ui-number-button.component';

describe('UiNumberButtonComponent', () => {
	let component: UiNumberButtonComponent;
	let fixture: ComponentFixture<UiNumberButtonComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiNumberButtonComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiNumberButtonComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should Update when number clicked', () => {
		component.recordingStatus = true;
		component.numberClicked(1);
		expect(component.numberClicked(1)).toBeUndefined();
		component.recordingStatus = false;
		component.isShowingPopup = false;
		component.selectedNumber = 1;
		component.selectedNumber = { key: 2 };
		component.numberClicked({ key: 3 });
		expect(component.selectedNumber).toEqual({ key: 3 });
	});
});
