import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { BatteryCardComponent } from './battery-card.component';

import { CommonService } from 'src/app/services/common/common.service';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { LoggerService } from 'src/app/services/logger/logger.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
	TranslateModule,
	TranslateService,
	TranslateLoader
} from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/modules/translation.module';
import {
	BatteryStatus,
	BatteryConditionsEnum
} from 'src/app/enums/battery-conditions.enum';
import { BatteryConditionModel } from 'src/app/data-models/battery/battery-conditions.model';
import BatteryGaugeDetail from 'src/app/data-models/battery/battery-gauge-detail-model';
import { BatteryGaugeReset } from 'src/app/data-models/device/battery-gauge-reset.model';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import BatteryIndicator from 'src/app/data-models/battery/battery-indicator.model';

// declare var Windows;

const info = {
	batteryInformation: [
		{
			heading: '',
			chargeStatusString:
				'device.deviceSettings.batteryGauge.details.chargeStatusString.charging',
			remainingTimeText:
				'device.deviceSettings.batteryGauge.details.chargeCompletionTime',

			barCode: 'X2XP899J0N0',
			batteryCondition: [
				'Normal',
				'hightemperature',
				'tricklecharge',
				'overheatedbattery',
				'permanenterror',
				'unsupportedbattery'
			],
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
			remainingPercent: 75,
			remainingTime: 204,
			temperature: 34,
			voltage: 10.843,
			wattage: 9
		}
	],
	batteryIndicatorInfo: {
		acAdapterStatus: 'Supported',
		acAdapterType: 'Legacy',
		acWattage: 0,
		isAirplaneModeEnabled: false,
		isAttached: false,
		isExpressCharging: false,
		isPowerDriverMissing: false,
		percentage: 75,
		time: 204,
		timeType: 'timeRemaining'
	}
};

const batteryGuage = {
	acAdapterStatus: 'Supported',
	acAdapterType: 'Legacy',
	acWattage: 0,
	isAirplaneModeEnabled: false,
	isAttached: false,
	isExpressCharging: false,
	isPowerDriverMissing: true,
	percentage: 75,
	time: 204,
	timeType: 'timeRemaining'
};

describe('BatteryCardComponent', () => {
	let component: BatteryCardComponent;
	let fixture: ComponentFixture<BatteryCardComponent>;
	let commonService: CommonService;
	let batteryDetailService: BatteryDetailService;
	let shellService: VantageShellService;
	let logger: LoggerService;
	let translate: TranslateService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			imports: [
				TranslateModule.forRoot({
					loader: {
						provide: TranslateLoader,
						useFactory: HttpLoaderFactory,
						deps: [HttpClient]
					}
				}),
				HttpClientTestingModule,
				RouterTestingModule
			],
			declarations: [BatteryCardComponent],
			providers: [
				CommonService,
				BatteryDetailService,
				VantageShellService,
				LoggerService,
				NgbModal
			]
		}).compileComponents();

		fixture = TestBed.createComponent(BatteryCardComponent);
		component = fixture.componentInstance;
		commonService = TestBed.get(CommonService);
		batteryDetailService = TestBed.get(BatteryDetailService);
		shellService = TestBed.get(VantageShellService);
		logger = TestBed.get(LoggerService);
	}));

	it('should create component', () => {
		fixture.detectChanges();
		expect(component).toBeDefined();
	});

	it('should call updateMainBatteryTime - status is 1', () => {
		const batteryInfo = {
			percentage: 75,
			remainingTime: 204,
			status: 1
		};
		let spy = spyOn(component, 'getMainBatteryInfo').and.returnValue(
			batteryInfo
		);
		component.updateMainBatteryTime();
		expect(spy).toHaveBeenCalled();
	});

	it('should call updateMainBatteryTime - status is 1 else case', () => {
		const batteryInfo = {
			percentage: 95,
			remainingTime: 530000,
			status: 1
		};
		let spy = spyOn(component, 'getMainBatteryInfo').and.returnValue(
			batteryInfo
		);
		component.updateMainBatteryTime();
		expect(spy).toHaveBeenCalled();
	});

	it('should call updateMainBatteryTime - status is 0', () => {
		const batteryInfo = {
			percentage: 75,
			remainingTime: 204,
			status: 0
		};
		let spy = spyOn(component, 'getMainBatteryInfo').and.returnValue(
			batteryInfo
		);
		component.updateMainBatteryTime();
		expect(spy).toHaveBeenCalled();
	});

	it('should call onPowerSupplyStatusEvent', () => {
		let spy = spyOn(component, 'setBatteryCard');
		component.onPowerSupplyStatusEvent(info);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onRemainingPercentageEvent', () => {
		let spy = spyOn(component, 'setBatteryCard');
		component.onRemainingPercentageEvent(info);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onRemainingTimeEvent', () => {
		let spy = spyOn(component, 'setBatteryCard');
		component.onRemainingTimeEvent(info);
		expect(spy).toHaveBeenCalled();
	});

	// it('should call onPowerBatteryGaugeResetEvent', () => {
	// 	const info: BatteryGaugeReset[] = [
	// 		{
	// 			barCode: 'X2XP899J0N0',
	// 			batteryNum: 1,
	// 			FCCAfter: 4,
	// 			FCCBefore: 1,
	// 			isResetRunning: false,
	// 			lastResetTime: '',
	// 			resetErrorLog: 'ERROR_UNEXPECTED',
	// 			stage: 0,
	// 			stageNum: 0,
	// 			startTime: ''
	// 		}
	// 	];
	// 	let spy = spyOn(commonService, 'cloneObj').and.returnValue(info);
	// 	component.onPowerBatteryGaugeResetEvent(info);
	// 	expect(spy).toHaveBeenCalled();
	// });

	it('should call getBatteryDetailOnCard - else case', () => {
		let spy = spyOn(component, 'getBatteryDetails');
		component.batteryService.isShellAvailable = false;
		component.getBatteryDetailOnCard();
		expect(spy).not.toHaveBeenCalled();
	});

	it('should throw error - getBatteryDetailOnCard', () => {
		expect(component.getBatteryDetailOnCard).toThrow();
	});

	// it('should call onNotification - inner first if', () => {
	// 	const thresholdNotification: AppNotification = {
	// 		type: ChargeThresholdInformation.ChargeThresholdInfo,
	// 		payload: true
	// 	};
	// 	component.batteryIndicator = new BatteryIndicator();
	// 	component.onNotification(thresholdNotification);
	// 	expect(component.batteryIndicator.isChargeThresholdOn).toEqual(true);
	// });

	it('should call onNotification - inner if', () => {
		const airplaneModeNotification: AppNotification = {
			type: 'AirplaneModeStatus',
			payload: true
		};
		component.batteryIndicator = new BatteryIndicator();
		component.onNotification(airplaneModeNotification);
		expect(component.batteryIndicator.isAirplaneMode).toEqual(true);
	});

	it('should call getBatteryCondition - isPowerDriverMissing is true', () => {
		component.batteryGauge = { ...batteryGuage };
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(1);
		component.getBatteryCondition();
		expect(component.batteryConditions).toContain(
			new BatteryConditionModel(
				BatteryConditionsEnum.MissingDriver,
				BatteryStatus.Poor
			)
		);
	});

	// it('should call getBatteryCondition - batterHealth is 1', () => {
	// 	component.batteryGauge = { ...batteryGuage }
	// 	// component.batteryInfo = { ...info.batteryInformation }
	// 	// component.batteryInfo[0].batteryCondition = ['hightemperature']
	// 	spyOn(commonService, 'getLocalStorageValue').and.returnValue(1)
	// 	component.getBatteryCondition()
	// 	// expect(component.batteryConditions).toContain(new BatteryConditionModel(BatteryConditionsEnum.MissingDriver, BatteryStatus.Poor))
	// });

	it('should call showDetailTip', () => {
		const index = 1;
		component.batteryConditionNotes = [];
		component.showDetailTip(index);
		expect(component.shortAcErrNote).toEqual(false);
	});

	it('should call getConditionState - case 3', () => {
		const conditionState = 3;
		component.getConditionState(conditionState).toString();
		expect(component.batteryStatus).toEqual(BatteryStatus);
	});

	it('should call getConditionState case 4', () => {
		const conditionState = 4;
		component.getConditionState(conditionState).toString();
		expect(component.batteryStatus).toEqual(BatteryStatus);
	});

	it('should call getConditionState case 5', () => {
		const conditionState = 5;
		component.getConditionState(conditionState).toString();
		expect(component.batteryStatus).toEqual(BatteryStatus);
	});

	it('should call reInitValue', () => {
		component.reInitValue();
		expect(component.flag).toEqual(false);
	});
});
