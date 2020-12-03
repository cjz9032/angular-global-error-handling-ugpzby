import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiRoundedRectangleRadioComponent } from './ui-rounded-rectangle-radio.component';

xdescribe('UiRoundedRectangleRadioComponent', () => {
	let component: UiRoundedRectangleRadioComponent;
	let fixture: ComponentFixture<UiRoundedRectangleRadioComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UiRoundedRectangleRadioComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiRoundedRectangleRadioComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
