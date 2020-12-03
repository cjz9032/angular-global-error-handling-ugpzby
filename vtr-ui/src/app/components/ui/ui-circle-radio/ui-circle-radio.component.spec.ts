import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiCircleRadioComponent } from './ui-circle-radio.component';

xdescribe('UiCircleRadioComponent', () => {
	let component: UiCircleRadioComponent;
	let fixture: ComponentFixture<UiCircleRadioComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UiCircleRadioComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiCircleRadioComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
