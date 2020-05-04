import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiRoundedRectangleRadioListComponent } from './ui-rounded-rectangle-radio-list.component';

xdescribe('UiRoundedRectangleRadioListComponent', () => {
	let component: UiRoundedRectangleRadioListComponent;
	let fixture: ComponentFixture<UiRoundedRectangleRadioListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiRoundedRectangleRadioListComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiRoundedRectangleRadioListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
