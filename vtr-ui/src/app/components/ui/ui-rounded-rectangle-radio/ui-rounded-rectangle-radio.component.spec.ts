import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiRoundedRectangleRadioComponent } from './ui-rounded-rectangle-radio.component';

xdescribe('UiRoundedRectangleRadioComponent', () => {
	let component: UiRoundedRectangleRadioComponent;
	let fixture: ComponentFixture<UiRoundedRectangleRadioComponent>;

	beforeEach(async(() => {
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
