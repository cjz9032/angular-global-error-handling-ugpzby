import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiRectangleRadioComponent } from './ui-rectangle-radio.component';

xdescribe('UiRectangleRadioComponent', () => {
	let component: UiRectangleRadioComponent;
	let fixture: ComponentFixture<UiRectangleRadioComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UiRectangleRadioComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiRectangleRadioComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
