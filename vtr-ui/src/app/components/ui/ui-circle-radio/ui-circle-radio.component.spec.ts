import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCircleRadioComponent } from './ui-circle-radio.component';

xdescribe('UiCircleRadioComponent', () => {
	let component: UiCircleRadioComponent;
	let fixture: ComponentFixture<UiCircleRadioComponent>;

	beforeEach(async(() => {
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
