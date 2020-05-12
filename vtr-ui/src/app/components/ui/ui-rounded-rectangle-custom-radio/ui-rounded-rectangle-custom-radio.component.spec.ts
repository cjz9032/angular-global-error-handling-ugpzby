import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UiRoundedRectangleCustomRadioComponent } from './ui-rounded-rectangle-custom-radio.component';

xdescribe('UiRoundedRectangleCustomRadioComponent', () => {
	let component: UiRoundedRectangleCustomRadioComponent;
	let fixture: ComponentFixture<UiRoundedRectangleCustomRadioComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiRoundedRectangleCustomRadioComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiRoundedRectangleCustomRadioComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
