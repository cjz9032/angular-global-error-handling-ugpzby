import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatteryDetailComponent } from './battery-detail.component';
import { BatteryIndicatorComponent } from '../battery-indicator/battery-indicator.component';
import { TranslationModule } from 'src/app/modules/translation.module';
import { TranslateStore } from '@ngx-translate/core';
import { MinutesToHourminPipe } from 'src/app/pipe/minutes-to-hourmin.pipe';
import BatteryIndicator from 'src/app/data-models/battery/battery-indicator.model';
import BatteryDetail from 'src/app/data-models/battery/battery-detail.model';
import { BatteryConditionModel } from 'src/app/data-models/battery/battery-conditions.model';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { BatteryInformation } from 'src/app/enums/battery-information.enum';

describe('BatteryDetailComponent', () => {
	let component: BatteryDetailComponent;
	let fixture: ComponentFixture<BatteryDetailComponent>;
	let debugElement;
	// let commonService;
	const dataInfo: BatteryDetail[] = [{

		heading: '',
		chargeStatusString: 'device.deviceSettings.batteryGauge.details.chargeStatusString.charging',
		remainingTimeText: 'device.deviceSettings.batteryGauge.details.chargeCompletionTime',

		barCode: 'X2XP899J0N0',
		batteryCondition: ['Normal'],
		batteryHealth: 0,
		chargeStatus: 2,
		cycleCount: 138,
		designCapacity: 45.28,
		designVoltage: 11.1,
		deviceChemistry: 'Li-Polymer',
		firmwareVersion: '0005-0234-0100-0005',
		firstUseDate: new Date('12/21/2018'),
		fruPart: '01AV464',
		fullChargeCapacity: 46.74,
		manufactureDate: new Date('12/21/2018'),
		manufacturer: 'SMP',
		remainingCapacity: 11.74,
		remainingPercent: 25,
		remainingTime: 67,
		temperature: 34,
		voltage: 10.843,
		wattage: 9
	}];

	const dataIndicator: BatteryIndicator = {
		batteryNotDetected: false,
		charging: false,
		expressCharging: false,
		hours: 0,
		isAirplaneMode: false,
		isChargeThresholdOn: false,
		minutes: 31,
		percent: 14,
		timeText: 'timeRemaining',

		convertMin(totalMin: number) {
			this.hours = Math.trunc(totalMin / 60);
			this.minutes = Math.trunc(totalMin % 60);
		}
	};

	const dataConditions: BatteryConditionModel[] = [{
		condition: 0,
		conditionStatus: 0,

		getBatteryConditionTip(condition: number): string {
			return 'device.deviceSettings.batteryGauge.condition.Good';
		}
	}];

	const notification: AppNotification = {
		type: BatteryInformation.BatteryInfo,
		payload: { detail: dataInfo, indicator: dataIndicator, conditions: dataConditions }
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BatteryDetailComponent, BatteryIndicatorComponent, MinutesToHourminPipe],
			imports: [TranslationModule],
			providers: [TranslateStore]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BatteryDetailComponent);
		debugElement = fixture.debugElement;
		component = fixture.componentInstance;
		component.dataInfo = dataInfo;
		component.dataIndicator = dataIndicator;
		component.dataConditions = dataConditions;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('#ngOnInit should call preProcessBatteryDetailResponse', () => {
		spyOn(component, 'preProcessBatteryDetailResponse');
		component.ngOnInit();
		expect(component.preProcessBatteryDetailResponse).toHaveBeenCalledWith({ detail: dataInfo, indicator: dataIndicator, conditions: dataConditions });
	});

	it('#onNotification should call preProcessBatteryDetailResponse', () => {
		spyOn(component, 'preProcessBatteryDetailResponse');
		component.onNotification(notification);
		expect(component.preProcessBatteryDetailResponse).toHaveBeenCalledWith(notification.payload);
	});

	it('#isValid should return false', () => {
		expect(component.isValid(undefined)).toBeFalsy();
		expect(component.isValid(null)).toBeFalsy();
		expect(component.isValid('')).toBeFalsy();
		expect(component.isValid(0)).toBeFalsy();
	});
	it('#isValid should return true', () => {
		expect(component.isValid(23)).toBeTruthy();
		expect(component.isValid('Discharging')).toBeTruthy();
	});
});
