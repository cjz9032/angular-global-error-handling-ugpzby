import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { BatteryConditionModel } from 'src/app/data-models/battery/battery-conditions.model';
import BatteryIndicator from 'src/app/data-models/battery/battery-indicator.model';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { BatteryGaugeReset } from 'src/app/data-models/device/battery-gauge-reset.model';
import { BatteryConditionsEnum, BatteryStatus } from 'src/app/enums/battery-conditions.enum';
import { ChargeThresholdInformation } from 'src/app/enums/battery-information.enum';
import { HttpLoaderFactory } from 'src/app/modules/translation.module';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { BatteryCardComponent } from './battery-card.component';

// declare var Windows;

const info = {
	batteryInformation: [
		{
			heading: '',
			chargeStatusString:
				'device.deviceSettings.batteryGauge.details.chargeStatusString.charging',
			remainingTimeText: 'device.deviceSettings.batteryGauge.details.chargeCompletionTime',

			barCode: 'X2XP899J0N0',
			batteryCondition: [
				'Normal',
				'HighTemperature',
				'UnsupportedBattery',
				'TrickleCharge',
				'OverheatedBattery',
				'PermanentError',
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
			wattage: 9,
			isTemporaryChargeMode: false,
			isDlsPiCapable: false,
		},
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
		timeType: 'timeRemaining',
	},
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
	timeType: 'timeRemaining',
};

describe('BatteryCardComponent', () => {
	let component: BatteryCardComponent;
	let fixture: ComponentFixture<BatteryCardComponent>;
	let commonService: CommonService;
	let batteryDetailService: BatteryDetailService;
	let shellService: VantageShellService;
	let logger: LoggerService;
	// let translate: TranslateService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			imports: [
				TranslateModule.forRoot({
					loader: {
						provide: TranslateLoader,
						useFactory: HttpLoaderFactory,
						deps: [HttpClient],
					},
				}),
				HttpClientTestingModule,
				RouterTestingModule,
			],
			declarations: [BatteryCardComponent],
			providers: [
				CommonService,
				BatteryDetailService,
				VantageShellService,
				LoggerService,
				NgbModal,
			],
		}).compileComponents();

		fixture = TestBed.createComponent(BatteryCardComponent);
		component = fixture.componentInstance;
		commonService = TestBed.inject(CommonService);
		batteryDetailService = TestBed.inject(BatteryDetailService);
		shellService = TestBed.inject(VantageShellService);
		logger = TestBed.inject(LoggerService);
		component.isLoading = false;
	}));

	it('should create component', () => {
		fixture.detectChanges();
		expect(component).toBeDefined();
	});

	it('should call updateMainBatteryTime - status is 1', () => {
		const batteryInfo = {
			percentage: 75,
			remainingTime: 204,
			status: 1,
		};
		const spy = spyOn(component, 'getMainBatteryInfo').and.returnValue(batteryInfo);
		component.updateMainBatteryTime();
		expect(spy).toHaveBeenCalled();
	});

	it('should call updateMainBatteryTime - status is 1 else case', () => {
		const batteryInfo = {
			percentage: 95,
			remainingTime: 530000,
			status: 1,
		};
		const spy = spyOn(component, 'getMainBatteryInfo').and.returnValue(batteryInfo);
		component.updateMainBatteryTime();
		expect(spy).toHaveBeenCalled();
	});

	it('should call updateMainBatteryTime - status is 0', () => {
		const batteryInfo = {
			percentage: 75,
			remainingTime: 204,
			status: 0,
		};
		const spy = spyOn(component, 'getMainBatteryInfo').and.returnValue(batteryInfo);
		component.updateMainBatteryTime();
		expect(spy).toHaveBeenCalled();
	});

	it('should call onPowerSupplyStatusEvent', () => {
		const spy = spyOn(component, 'setBatteryCard');
		component.onPowerSupplyStatusEvent(info);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onRemainingPercentageEvent', () => {
		const spy = spyOn(component, 'setBatteryCard');
		component.onRemainingPercentageEvent(info);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onRemainingTimeEvent', () => {
		const spy = spyOn(component, 'setBatteryCard');
		component.onRemainingTimeEvent(info);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onPowerBatteryGaugeResetEvent', () => {
		const info: BatteryGaugeReset[] = [
			{
				barCode: 'X2XP899J0N0',
				batteryNum: 1,
				FCCAfter: 4,
				FCCBefore: 1,
				isResetRunning: false,
				lastResetTime: '',
				resetErrorLog: 'ERROR_UNEXPECTED',
				stage: 0,
				stageNum: 0,
				startTime: '',
			},
		];
		const spy = spyOn(commonService, 'cloneObj').and.returnValue(info);
		component.onPowerBatteryGaugeResetEvent(info);
		expect(spy).toHaveBeenCalled();
	});

	it('should call getBatteryDetailOnCard - else case', () => {
		const spy = spyOn(component, 'getBatteryDetails');
		component.batteryService.isShellAvailable = false;
		component.getBatteryDetailOnCard();
		expect(spy).not.toHaveBeenCalled();
	});

	it('should throw error - getBatteryDetailOnCard', () => {
		expect(component.getBatteryDetailOnCard).toThrow();
	});

	it('should call onNotification - Case ChargeThresholdInformation', () => {
		const thresholdNotification: AppNotification = {
			type: ChargeThresholdInformation.ChargeThresholdInfo,
			payload: true,
		};
		component.batteryIndicator = new BatteryIndicator();
		component.onNotification(thresholdNotification);
		expect(component.batteryIndicator.isChargeThresholdOn).toEqual(true);
	});

	it('should call onNotification - Case AirplaneModeStatus', () => {
		const airplaneModeNotification: AppNotification = {
			type: 'AirplaneModeStatus',
			payload: { isCapable: true, isEnabled: true },
		};
		component.batteryIndicator = new BatteryIndicator();
		component.onNotification(airplaneModeNotification);
		expect(component.batteryIndicator.isAirplaneMode).toEqual(true);
	});

	it('should call onNotification - Case ExpressChargingStatus', () => {
		const expressChargingNotification: AppNotification = {
			type: 'ExpressChargingStatus',
			payload: { available: true, status: true },
		};
		component.batteryIndicator = new BatteryIndicator();
		component.onNotification(expressChargingNotification);
		expect(component.batteryIndicator.expressCharging).toEqual(true);
	});

	it('should call getBatteryCondition - isPowerDriverMissing is true', () => {
		component.batteryGauge = { ...batteryGuage };
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(1);
		component.getBatteryCondition();
		expect(component.batteryConditions).toContain(
			new BatteryConditionModel(BatteryConditionsEnum.MissingDriver, BatteryStatus.Poor)
		);
	});

	it('should call getBatteryCondition - Adapter connected', () => {
		component.isThinkPad = true;
		const tempBatteryGauge = { ...batteryGuage };
		const tempBatteryInfo = { ...info.batteryInformation };
		tempBatteryGauge.isAttached = true;
		tempBatteryGauge.acWattage = 60;
		tempBatteryGauge.isPowerDriverMissing = false;
		tempBatteryInfo[0].batteryHealth = 1;
		tempBatteryInfo[0].batteryCondition.splice(0, 1);
		component.batteryGauge = { ...tempBatteryGauge };
		component.batteryInfo = { ...tempBatteryInfo };
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(0);
		component.getBatteryCondition();
		expect(component.batteryConditions).toContain(
			new BatteryConditionModel(
				BatteryConditionsEnum.FullACAdapterSupport,
				BatteryStatus.AcAdapterStatus
			)
		);
	});

	it('should call reInitValue', () => {
		component.reInitValue();
		expect(component.flag).toEqual(false);
	});
});
