import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UiCustomSliderComponent } from './ui-custom-slider.component';


xdescribe('UiCustomSliderComponent', () => {
	let component: UiCustomSliderComponent;
	let fixture: ComponentFixture<UiCustomSliderComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiCustomSliderComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiCustomSliderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
