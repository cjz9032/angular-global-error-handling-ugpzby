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
import { BatteryConditionsEnum } from 'src/app/enums/battery-conditions.enum';

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

	const dataConditionsGood: BatteryConditionModel[] = [{
		condition: 0,
		conditionStatus: 0,

		getBatteryConditionTip(condition: number): string {
			return 'device.deviceSettings.batteryGauge.condition.Good';
		}
	}];

	const dataConditionsBad: BatteryConditionModel[] = [{
		condition: BatteryConditionsEnum.Bad,
		conditionStatus: 2,
		getBatteryConditionTip(condition: number): string {
			return 'device.deviceSettings.batteryGauge.condition.Bad';
		}
	}];

	/* {
		condition: BatteryConditionsEnum.Bad,
		conditionStatus: 0,

		getBatteryConditionTip(condition: number): string {
			return 'device.deviceSettings.batteryGauge.condition.Bad';
		}
	},
	{
		condition: BatteryConditionsEnum.Illegal,
		conditionStatus: 0,

		getBatteryConditionTip(condition: number): string {
			return 'device.deviceSettings.batteryGauge.condition.Illegal';
		}
	},
	{
		condition: BatteryConditionsEnum.Exhaustion,
		conditionStatus: 0,

		getBatteryConditionTip(condition: number): string {
			return 'device.deviceSettings.batteryGauge.condition.Exhaustion';
		}
	},
	{
		condition: BatteryConditionsEnum.NotDetected,
		conditionStatus: 0,

		getBatteryConditionTip(condition: number): string {
			return 'device.deviceSettings.batteryGauge.condition.NotDetected';
		}
	},
	{
		condition: BatteryConditionsEnum.MissingDriver,
		conditionStatus: 0,

		getBatteryConditionTip(condition: number): string {
			return 'device.deviceSettings.batteryGauge.condition.MissingDriver';
		}
	},
	{
		condition: BatteryConditionsEnum.NotSupportACAdapter,
		conditionStatus: 0,

		getBatteryConditionTip(condition: number): string {
			return 'device.deviceSettings.batteryGauge.condition.NotSupportACAdapter';
		}
	},
	{
		condition: BatteryConditionsEnum.FullACAdapterSupport,
		conditionStatus: 0,

		getBatteryConditionTip(condition: number): string {
			return 'device.deviceSettings.batteryGauge.condition.FullACAdapterSupport';
		}
	},
	{
		condition: BatteryConditionsEnum.LimitedACAdapterSupport,
		conditionStatus: 0,

		getBatteryConditionTip(condition: number): string {
			return 'device.deviceSettings.batteryGauge.condition.LimitedACAdapterSupport';
		}
	},
	{
		condition: BatteryConditionsEnum.StoreLimitation,
		conditionStatus: 0,

		getBatteryConditionTip(condition: number): string {
			return 'device.deviceSettings.batteryGauge.condition.StoreLimitation';
		}
	},
	{
		condition: BatteryConditionsEnum.HighTemperature,
		conditionStatus: 0,

		getBatteryConditionTip(condition: number): string {
			return 'device.deviceSettings.batteryGauge.condition.HighTemperature';
		}
	},
	{
		condition: BatteryConditionsEnum.OverheatedBattery,
		conditionStatus: 0,

		getBatteryConditionTip(condition: number): string {
			return 'device.deviceSettings.batteryGauge.condition.OverheatedBattery';
		}
	},
	{
		condition: BatteryConditionsEnum.TrickleCharge,
		conditionStatus: 0,

		getBatteryConditionTip(condition: number): string {
			return 'device.deviceSettings.batteryGauge.condition.TrickleCharge';
		}
	},
	{
		condition: BatteryConditionsEnum.PermanentError,
		conditionStatus: 0,

		getBatteryConditionTip(condition: number): string {
			return 'device.deviceSettings.batteryGauge.condition.PermanentError';
		}
	},
	{
		condition: BatteryConditionsEnum.UnsupportedBattery,
		conditionStatus: 0,

		getBatteryConditionTip(condition: number): string {
			return 'device.deviceSettings.batteryGauge.condition.Illegal';
		}
	} */

	const notification: AppNotification = {
		type: BatteryInformation.BatteryInfo,
		payload: { detail: dataInfo, indicator: dataIndicator, conditions: dataConditionsGood }
	};

	const notificationBad: AppNotification = {
		type: BatteryInformation.BatteryInfo,
		payload: { detail: dataInfo, indicator: dataIndicator, conditions: dataConditionsBad }
	};
	/*
		const notificationIllegal: AppNotification = {
			type: BatteryInformation.BatteryInfo,
			payload: { detail: dataInfo, indicator: dataIndicator, conditions: dataConditionsBad }
		}; */

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
		component.dataConditions = dataConditionsGood;
		fixture.detectChanges();

		component.batteryIndicator = new BatteryIndicator();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('#ngOnInit should call preProcessBatteryDetailResponse', () => {
		spyOn(component, 'preProcessBatteryDetailResponse');
		component.ngOnInit();
		expect(component.preProcessBatteryDetailResponse).toHaveBeenCalledWith({ detail: dataInfo, indicator: dataIndicator, conditions: dataConditionsGood });
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


	it('#onNotification should call preProcessBatteryDetailResponse with battery conditon good ', () => {
		spyOn(component, 'preProcessBatteryDetailResponse');
		// component.dataConditions = dataConditionsBad;
		// notification.payload.dataConditions = dataConditionsGood;
		component.onNotification(notification);
		expect(component.preProcessBatteryDetailResponse).toHaveBeenCalledWith(notification.payload);
	});

	it('#onNotification should call preProcessBatteryDetailResponse with battery conditon bad ', () => {
		spyOn(component, 'preProcessBatteryDetailResponse');
		component.dataConditions = dataConditionsBad;
		notification.payload.dataConditions = dataConditionsBad;
		component.onNotification(notificationBad);
		expect(component.preProcessBatteryDetailResponse).toHaveBeenCalledWith(notificationBad.payload);
	});




});
