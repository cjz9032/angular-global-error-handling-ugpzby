import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EyeCareModeComponent } from './eye-care-mode.component';
import { UiRangeSliderComponent } from '../../ui/ui-range-slider/ui-range-slider.component';
import { Ng5SliderModule } from 'ng5-slider';

describe('EyeCareModeComponent', () => {
	let component: EyeCareModeComponent;
	let fixture: ComponentFixture<EyeCareModeComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				Ng5SliderModule
			],
			declarations: [
				EyeCareModeComponent,
				UiRangeSliderComponent
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(EyeCareModeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
