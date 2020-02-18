import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayColorTempComponent } from './display-color-temp.component';
import { EyeCareMode } from 'src/app/data-models/camera/eyeCareMode.model';
import { ChangeContext, Ng5SliderModule, PointerType } from 'ng5-slider';
import { UiRangeSliderComponent } from '../../ui/ui-range-slider/ui-range-slider.component';
import { UiButtonComponent } from '../../ui/ui-button/ui-button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslationModule } from 'src/app/modules/translation.module';
import { FormsModule } from '@angular/forms';
import { TranslateStore } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DisplayColorTempComponent', () => {
	// let component: DisplayColorTempComponent;
	// let fixture: ComponentFixture<DisplayColorTempComponent>;
	const displayColorTempSettings: EyeCareMode = {
		available: true,
		current: 10,
		maximum: 100,
		minimum: 0,
		status: true
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DisplayColorTempComponent, UiRangeSliderComponent, UiButtonComponent],
			imports: [FontAwesomeModule, TranslationModule, FormsModule],
			providers: [TranslateStore],
			schemas: [NO_ERRORS_SCHEMA] // for derictives
		}).compileComponents();
	}));

	describe(':', () => {

		function setup() {
			const fixture = TestBed.createComponent(DisplayColorTempComponent);
			const component = fixture.debugElement.componentInstance;
			// const componentElement = fixture.debugElement.nativeElement;

			return { fixture, component };
		}

		it('should create the app', (() => {
			const { component } = setup();
			expect(component).toBeTruthy();
		}));

		it('ui-range-slider created', async(() => {
			const { fixture, component } = setup();
			component.displayColorTempSettings = displayColorTempSettings;
			component.enableSlider = true;
			fixture.detectChanges();

			const slider = fixture.debugElement.nativeElement.querySelector('vtr-ui-range-slider');
			expect(slider).not.toBeNull();

		}));

		it('displayColorTempChange emited', async(() => {
			const { fixture, component } = setup();
			spyOn(component.displayColorTempChange, 'emit').and.callThrough();

			component.displayColorTempSettings = displayColorTempSettings;
			fixture.detectChanges();

			let pt: PointerType;

			const changeContext: ChangeContext = {
				highValue: 100,
				pointerType : pt,
				value: displayColorTempSettings.current
			};

			component.onDisplayColorTemparatureChange(changeContext);
			fixture.whenStable().then(() => {
				expect(component.displayColorTempChange.emit).toHaveBeenCalled();
			});
		}));

		it('resetTemparature emited', async(() => {
			const { fixture, component } = setup();
			spyOn(component.resetTemparature, 'emit').and.callThrough();

			component.displayColorTempSettings = displayColorTempSettings;
			component.enableSlider = true;
			fixture.detectChanges();

			component.onResetTemparature(new Event('click'));
			fixture.whenStable().then(() => {
				expect(component.resetTemparature.emit).toHaveBeenCalled();
			});
		}));

		it('colorPreviewValue emited', async(() => {
			const { fixture, component } = setup();
			spyOn(component.colorPreviewValue, 'emit').and.callThrough();

			component.displayColorTempSettings = displayColorTempSettings;
			component.enableSlider = true;
			fixture.detectChanges();

			component.dragChangeValue(new Event('click'));
			fixture.whenStable().then(() => {
				expect(component.colorPreviewValue.emit).toHaveBeenCalled();
			});
		}));


	});
});
