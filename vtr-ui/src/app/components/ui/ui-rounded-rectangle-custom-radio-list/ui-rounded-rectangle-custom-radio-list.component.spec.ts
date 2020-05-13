import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UiRoundedRectangleCustomRadioListComponent } from './ui-rounded-rectangle-custom-radio-list.component';


xdescribe('UiRoundedRectangleCustomRadioListComponent', () => {
	let component: UiRoundedRectangleCustomRadioListComponent;
	let fixture: ComponentFixture<UiRoundedRectangleCustomRadioListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiRoundedRectangleCustomRadioListComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiRoundedRectangleCustomRadioListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
