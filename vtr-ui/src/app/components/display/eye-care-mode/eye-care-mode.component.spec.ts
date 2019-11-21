import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import { EyeCareModeComponent } from './eye-care-mode.component';
import { TranslateModule } from "@ngx-translate/core";
import { ChangeContext, PointerType } from 'ng5-slider';
const eyeCareModeSettings =
	{
		'available': true,
		'current': 1,
		'maximum': 1,
		'minimum': 2,
		'status': true
	}
	const sunsetToSunriseStatus = {
		'available': true,
		'status': true
	}
	let pt:PointerType;
	const changeContext: ChangeContext = {
		value: 10,
		highValue: 12,
		pointerType: pt
	}
describe('EyeCareModeComponent', () => {
	let component: EyeCareModeComponent;
	let fixture: ComponentFixture<EyeCareModeComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			imports: [
				TranslateModule.forRoot(),
			],
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
		spyOn(component.resetTemparature,'emit').and.callThrough();
		component.onResetTemparature(new Event('click'));
		expect(component.resetTemparature.emit).toHaveBeenCalled();
	});

	it('should test onEyeCareTemparatureChange method', () => {
		spyOn(component.eyeCareTemparatureChange,'emit').and.callThrough();
		component.onEyeCareTemparatureChange(changeContext)
		expect(component.eyeCareTemparatureChange.emit).toHaveBeenCalled();
	});
	it('should test onEyeCareTemparatureValueChange method', () => {
		spyOn(component.eyeCareTemparatureValueChange,'emit').and.callThrough();
		component.onEyeCareTemparatureValueChange(changeContext);
		expect(component.eyeCareTemparatureValueChange.emit).toHaveBeenCalled();
	});
	it('should test onSunsetToSunrise method', () => {
		spyOn(component.sunsetToSunrise,'emit').and.callThrough();
		component.onSunsetToSunrise(new Event('click'));
		expect(component.sunsetToSunrise.emit).toHaveBeenCalled();
	});
	it('should test legendPosition method', () => {
		let x=component.legendPosition(1);
		expect(x).toEqual(0.5);
        let z=component.legendPosition(3);
		expect(z).toEqual(1);
		let y=component.legendPosition(2);
		expect(y).toEqual(0.7);

	});
it('should test sliderChange method', () => {
	component.sliderChange(1);
});

});
