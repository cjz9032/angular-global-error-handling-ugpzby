import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatteryIndicatorComponent } from './battery-indicator.component';
import { TranslationModule } from 'src/app/modules/translation.module';
import { TranslateStore } from '@ngx-translate/core';

describe('BatteryIndicatorComponent', () => {
	let component: BatteryIndicatorComponent;
	let fixture: ComponentFixture<BatteryIndicatorComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BatteryIndicatorComponent],
			imports: [TranslationModule],
			providers: [TranslateStore]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BatteryIndicatorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('#ngOnInit should call getCssDeclaration, refreshLevel, checkRemainingTimeIsZero', () => {
		spyOn(component, 'getCssDeclaration');
		spyOn(component, 'refreshLevel');
		spyOn(component, 'checkRemainingTimeIsZero');
		component.ngOnInit();
		expect(component.getCssDeclaration).toHaveBeenCalled();
		expect(component.refreshLevel).toHaveBeenCalled();
		expect(component.checkRemainingTimeIsZero).toHaveBeenCalled();
	});

	it('#refreshLevel should set battery percentage to  50', () => {
		component.percentage = 50;
		component.batteryNotDetected = false;
		spyOn(component, 'getLevelCssValues').and.returnValues(
			{
				borderColor: ' rgba(49, 228, 182, 0.4)',
				borderShadowColor: ' rgba(49, 228, 182, 0.4)',
				fillColor: ' linear-gradient( 315deg, #35e6b9 0%, #2ecc71 100% )'

			});
		component.refreshLevel();
		expect(component.getLevelCssValues).toHaveBeenCalledWith(component.percentage);
		// expect(component.batteryIndicator.nativeElement.style.cssText).toBe('--border-shadow-color: rgba(49, 228, 182, 0.4); --border-color: rgba(49, 228, 182, 0.4); --acid-fill-gradient: linear-gradient( 315deg, #35e6b9 0%, #2ecc71 100% ); --acid-width:calc(50% - 0.85rem)');
	});

	it('#refreshLevel should set battery percentage to  22', () => {
		component.percentage = 22;
		component.batteryNotDetected = false;
		spyOn(component, 'getLevelCssValues').and.returnValues(
			{
				borderColor: ' rgba(255, 165, 0, 0.4)',
				borderShadowColor: ' rgba(255, 165, 0, 0.4)',
				fillColor: ' linear-gradient( 315deg, #fad961 0%, #ffaf00 100% );'
			});
		component.refreshLevel();
		expect(component.getLevelCssValues).toHaveBeenCalledWith(component.percentage);
		// expect(component.batteryIndicator.nativeElement.style.cssText).toEqual('--border-shadow-color: rgba(255, 165, 0, 0.4); --border-color: rgba(255, 165, 0, 0.4); --acid-fill-gradient: linear-gradient( 315deg, #fad961 0%, #ffaf00 100% ); --acid-width:calc(22% - 0.85rem);');
	});

	it('#refreshLevel should set battery percentage to  11', () => {
		component.percentage = 11;
		component.batteryNotDetected = false;
		spyOn(component, 'getLevelCssValues').and.returnValues(
			{
				borderColor: ' rgba(217, 72, 57, 0.4)',
				borderShadowColor: ' rgba(217, 72, 57, 0.4)',
				fillColor: ' linear-gradient( 315deg, #f17f14 0%, #ed4e04 100% )'
			});
		component.refreshLevel();
		expect(component.getLevelCssValues).toHaveBeenCalledWith(component.percentage);
		// expect(component.batteryIndicator.nativeElement.style.cssText).toEqual('--border-shadow-color: rgba(217, 72, 57, 0.4); --border-color: rgba(217, 72, 57, 0.4); --acid-fill-gradient: linear-gradient( 315deg, #f17f14 0%, #ed4e04 100% ); --acid-width:calc(11% - 0.85rem);');

	});

	it('#getLevelCssValues should should set values green', () => {
		const {
			borderColor,
			borderShadowColor,
			fillColor
		} = component.getLevelCssValues(50);
		expect(borderColor).toEqual(' rgba(49, 228, 182, 0.4)');
		expect(borderShadowColor).toEqual(' rgba(49, 228, 182, 0.4)');
		expect(fillColor).toEqual(' linear-gradient( 315deg, #35e6b9 0%, #2ecc71 100% )');
	});

	it('#getLevelCssValues should should set values red', () => {
		const {
			borderColor,
			borderShadowColor,
			fillColor
		} = component.getLevelCssValues(10);
		expect(borderColor).toEqual(' rgba(217, 72, 57, 0.4)');
		expect(borderShadowColor).toEqual(' rgba(217, 72, 57, 0.4)');
		expect(fillColor).toEqual(' linear-gradient( 315deg, #f17f14 0%, #ed4e04 100% )');
	});

	it('#getLevelCssValues should should set values orange', () => {
		const {
			borderColor,
			borderShadowColor,
			fillColor
		} = component.getLevelCssValues(20);
		expect(borderColor).toEqual(' rgba(255, 165, 0, 0.4)');
		expect(borderShadowColor).toEqual(' rgba(255, 165, 0, 0.4)');
		expect(fillColor).toEqual(' linear-gradient( 315deg, #fad961 0%, #ffaf00 100% )');
	});

	// it('#getTimeRemaining should set remaining time to 3 hour 12 minutes', () => {
	// 	component.remainingHour = 3;
	// 	component.remainingMinutes = 12;
	// 	spyOn(component, 'checkRemainingTimeIsZero');
	// 	const hoursText = ' device.deviceSettings.batteryGauge.hours ';
	// 	const minuteText = ' device.deviceSettings.batteryGauge.minutes';
	// 	const a = component.getTimeRemaining();
		
	// 	expect(component.checkRemainingTimeIsZero).toHaveBeenCalled();
	// 	expect(component.getTimeRemaining()).toEqual(component.remainingHour + hoursText + component.remainingMinutes + minuteText);
	// });

	it('#checkRemainingTimeIsZero should show remaining text', () => {
		component.remainingHour = 3;
		component.remainingMinutes = 12;
		component.checkRemainingTimeIsZero();
		expect(component.hideRemainingTimeTxt).toBeFalsy();
	});

	it('#checkRemainingTimeIsZero should hide remaining text', () => {
		component.remainingHour = 0;
		component.remainingMinutes = 0;
		component.checkRemainingTimeIsZero();
		expect(component.hideRemainingTimeTxt).toBeTruthy();
	});
});
