import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, SimpleChange } from '@angular/core';
import { EyeCareModeComponent } from './eye-care-mode.component';
import { TranslateModule } from '@ngx-translate/core';
import { ChangeContext, PointerType } from 'ng5-slider';
import { HttpClientTestingModule } from '@angular/common/http/testing';
const eyeCareModeSettings = {
	available: true,
	current: 1,
	maximum: 1,
	minimum: 2,
	status: true
};
const sunsetToSunriseStatus = {
	available: true,
	status: true
};
let pt: PointerType;
const changeContext: ChangeContext = {
	value: 10,
	highValue: 12,
	pointerType: pt
};
describe('EyeCareModeComponent', () => {
	let component: EyeCareModeComponent;
	let fixture: ComponentFixture<EyeCareModeComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslateModule.forRoot(), HttpClientTestingModule],
			declarations: [EyeCareModeComponent]
		}).compileComponents();
		fixture = TestBed.createComponent(EyeCareModeComponent);
		component = fixture.componentInstance;
		component.eyeCareModeSettings = eyeCareModeSettings;
		component.sunsetToSunriseStatus = sunsetToSunriseStatus;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
	it('should test onResetTemparature method', () => {
		spyOn(component.resetTemperature, 'emit').and.callThrough();
		component.onResetTemperature(new Event('click'));
		expect(component.resetTemperature.emit).toHaveBeenCalled();
	});

	it('should test onEyeCareTemparatureChange method', () => {
		spyOn(component.eyeCareTemperatureChange, 'emit').and.callThrough();
		component.onEyeCareTemperatureChange(changeContext);
		expect(component.eyeCareTemperatureChange.emit).toHaveBeenCalled();
	});
	it('should test onEyeCareTemparatureValueChange method', () => {
		spyOn(
			component.eyeCareTemperatureValueChange,
			'emit'
		).and.callThrough();
		component.onEyeCareTemperatureValueChange(changeContext);
		expect(component.eyeCareTemperatureValueChange.emit).toHaveBeenCalled();
	});
	it('should test onSunsetToSunrise method', () => {
		spyOn(component.sunsetToSunrise, 'emit').and.callThrough();
		component.onSunsetToSunrise();
		expect(component.sunsetToSunrise.emit).toHaveBeenCalled();
	});

	it('should check sunsetToSunriseStatus in onChanges method', () => {
		const sunsetToSunriseStatus = {
			available: true,
			status: true,
			permission: true,
			sunriseTime: 'abc',
			sunsetTime: 'xyz'
		};

		component.ngOnChanges({
			sunsetToSunriseStatus: new SimpleChange(
				null,
				sunsetToSunriseStatus,
				false
			)
		});
		fixture.detectChanges();
		expect(component.sunriseToSunsetText).toBe('');
	});
	it('should check sunsetToSunriseStatus in onChanges method', () => {
		const sunsetToSunriseStatus = {
			available: true,
			status: true,
			permission: true,
			sunriseTime: 'abc',
			sunsetTime: 'xyz'
		};

		component.ngOnChanges({
			sunsetToSunriseStatus: new SimpleChange(
				null,
				sunsetToSunriseStatus,
				true
			)
		});
		fixture.detectChanges();
		expect(component.sunriseToSunsetText).toBe('');
	});

	it('should test legendPosition method', () => {
		expect(component.legendPosition(1)).toBe(0.5);
		expect(component.legendPosition(2)).toBe(0.7);
		expect(component.legendPosition(3)).toBe(1);
		expect(component.legendPosition(4)).toBe(undefined);
	});
	// it("should test sliderChange method", () => {
	// 	expect(component.sliderChange(1)).toEqual();
	// 	expect(component.sliderChange(2)).toEqual();
	// 	expect(component.sliderChange(3)).toEqual();
	// 	expect(component.sliderChange(4)).toEqual();
	// });
});
