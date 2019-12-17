import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BatteryCardComponent } from './battery-card.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateStore } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonService } from 'src/app/services/common/common.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslationModule } from 'src/app/modules/translation.module';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';
import { ChargeThresholdInformation } from 'src/app/enums/battery-information.enum';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { BatteryConditionModel } from 'src/app/data-models/battery/battery-conditions.model';
import { BatteryStatus } from 'src/app/enums/battery-conditions.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

describe('BatteryCardComponent', () => {
	// let component: BatteryCardComponent;
	// let fixture: ComponentFixture<BatteryCardComponent>;
	let commonService: CommonService;
	let debugElement;
	let batteryService;
	let modalService;

	const info = {
		batteryInformation: [{
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
			remainingPercent: 75,
			remainingTime: 204,
			temperature: 34,
			voltage: 10.843,
			wattage: 9
		}],
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

	const conditions: BatteryConditionModel[] = [
		{
			condition: 0, conditionStatus: 0,
			getBatteryConditionTip() {
				return 'device.deviceSettings.batteryGauge.condition.Normal';
			}
		},
		{
			condition: 16, conditionStatus: 3,
			getBatteryConditionTip() {
				return 'device.deviceSettings.batteryGauge.condition.LimitedACAdapterSupport';
			}
		},
		{
			condition: 11, conditionStatus: 1,
			getBatteryConditionTip() {
				return 'device.deviceSettings.batteryGauge.condition.UnsupportedBattery';
			}
		},
		{
			condition: 11, conditionStatus: 1,
			getBatteryConditionTip() {
				return 'device.deviceSettings.batteryGauge.condition.NonThinkPadBattery';
			}
		}
	];

	const thresholdNotification: AppNotification = {
		type: ChargeThresholdInformation.ChargeThresholdInfo,
		payload: true
	};

	const airplaneModeNotification: AppNotification = {
		type: 'AirplaneModeStatus',
		payload: true
	};




	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BatteryCardComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslationModule, HttpClientModule, RouterTestingModule],
			providers: [TranslateStore]
		});
	}));

	describe(':', () => {

		function setup() {
			const fixture = TestBed.createComponent(BatteryCardComponent);
			const component = fixture.componentInstance;
			commonService = fixture.debugElement.injector.get(CommonService);
			batteryService = fixture.debugElement.injector.get(BatteryDetailService);
			modalService = fixture.debugElement.injector.get(NgbModal);

			return { fixture, component, commonService, batteryService, modalService };
		}

		afterEach(() => {
			const { component } = setup();
			component.isLoading = false;
		});

		it('should create app', () => {
			const { component } = setup();
			expect(component).toBeTruthy();
		});

		it('#ngOnInit should call getBatteryDetailOnCard', () => {
			const { fixture, component } = setup();
			spyOn(component, 'getBatteryDetailOnCard');
			fixture.detectChanges();
			component.ngOnInit();
			expect(component.getBatteryDetailOnCard).toHaveBeenCalled();
		});

		it('#onPowerSupplyStatusEvent should set batteryInfo, batteryGauge and call updateBatteryDetails', () => {
			const { component } = setup();
			spyOn(component, 'updateBatteryDetails');
			component.onPowerSupplyStatusEvent(info);
			expect(component.batteryInfo).toEqual(info.batteryInformation);
			expect(component.batteryGauge).toEqual(info.batteryIndicatorInfo);
			expect(component.updateBatteryDetails).toHaveBeenCalled();
		});

		it('#onRemainingPercentageEvent should set batteryInfo, batteryGauge and call updateBatteryDetails', () => {
			const { component } = setup();
			spyOn(component, 'updateBatteryDetails');
			component.onRemainingPercentageEvent(info);
			expect(component.batteryInfo).toEqual(info.batteryInformation);
			expect(component.batteryGauge).toEqual(info.batteryIndicatorInfo);
			expect(component.updateBatteryDetails).toHaveBeenCalled();
		});

		it('#onRemainingTimeEvent should set batteryInfo, batteryGauge and call updateBatteryDetails', () => {
			const { component } = setup();
			spyOn(component, 'updateBatteryDetails');
			component.onRemainingTimeEvent(info);
			expect(component.batteryInfo).toEqual(info.batteryInformation);
			expect(component.batteryGauge).toEqual(info.batteryIndicatorInfo);
			expect(component.updateBatteryDetails).toHaveBeenCalled();
		});

		it('#getBatteryDetails should get battery information', async () => {
			const { fixture, component, batteryService } = setup();
			spyOn(batteryService, 'getBatteryDetail').and.returnValue(Promise.resolve(info));
			await component.getBatteryDetails(false);
			fixture.detectChanges();
			expect(batteryService.getBatteryDetail).toHaveBeenCalled();
			expect(component.batteryInfo).toEqual(info.batteryInformation);
			expect(component.batteryGauge).toEqual(info.batteryIndicatorInfo);
		});

		it('#onNotification should show threshold warning note and call sendThresholdWarning', () => {
			const { fixture, component } = setup();
			fixture.detectChanges();
			const notification = thresholdNotification;
			component.onNotification(notification);
			expect(component.batteryIndicator.isChargeThresholdOn).toEqual(notification.payload);
		});

		it('#onNotification should show Airplane mode Icon inside battery', () => {
			const { component } = setup();
			const notification = airplaneModeNotification;
			component.onNotification(notification);
			expect(component.batteryIndicator.isAirplaneMode).toEqual(notification.payload);
		});

		it('#initBatteryInformation should set undefined battery properties to default values', () => {
			const { component } = setup();
			component.batteryGauge = info.batteryIndicatorInfo;
			component.batteryInfo = info.batteryInformation;

			component.batteryGauge.isExpressCharging = undefined;
			component.batteryGauge.percentage = undefined;
			component.batteryInfo[0].batteryCondition = [];

			component.initBatteryInformation();
			expect(component.batteryGauge.isExpressCharging).toBeFalsy();
			expect(component.batteryGauge.percentage).toEqual(0);
			expect(component.batteryInfo[0].batteryCondition).toEqual(['Normal']);
		});

		it('#updateBatteryDetails should call initBatteryInformation, initialize batteryIndicator and call getBatteryCondition', () => {
			const { fixture, component } = setup();
			component.batteryGauge = info.batteryIndicatorInfo;
			component.batteryInfo = info.batteryInformation;

			spyOn(component, 'initBatteryInformation');
			spyOn(component, 'getBatteryCondition');
			spyOn(component, 'updateBatteryDetails').and.callThrough();
			fixture.detectChanges();

			component.updateBatteryDetails();

			expect(component.initBatteryInformation).toHaveBeenCalled();

			expect(component.remainingPercentages).toEqual([component.batteryInfo[0].remainingPercent]);
			expect(component.batteryHealth).toEqual(component.batteryInfo[0].batteryHealth);
			expect(component.batteryIndicator.batteryNotDetected).toBeFalsy();
			expect(component.batteryIndicator.percent).toEqual(component.batteryGauge.percentage);
			expect(component.batteryIndicator.charging).toBeFalsy();
			expect(component.batteryIndicator.timeText).toEqual('timeRemaining');
			expect(component.batteryIndicator.expressCharging).toBeFalsy();

			expect(component.getBatteryCondition).toHaveBeenCalled();
		});


		it('#showDetailModal should call modalService open method', () => {
			const { fixture, component, modalService } = setup();
			spyOn(modalService, 'open').and.returnValue({ result: Promise.resolve() });
			fixture.detectChanges();
			component.showDetailModal(component.batteryModal);
			expect(modalService.open).toHaveBeenCalledWith(component.batteryModal, {
				backdrop: 'static',
				size: 'lg',
				windowClass: 'battery-modal-size'
			});
		});

		it('#showDetailTip should set shortAcErrNote to false', () => {
			const { component } = setup();
			const condition: BatteryConditionModel = {
				condition: 16,
				conditionStatus: 3,
				getBatteryConditionTip() {
					return 'device.deviceSettings.batteryGauge.condition.LimitedACAdapterSupport';
				}
			};
			component.batteryConditionNotes = [condition.getBatteryConditionTip(condition.condition)];
			component.batteryConditions = [condition];
			component.showDetailTip(0);
			expect(component.shortAcErrNote).toBeFalsy();
		});

		it('#getConditionState should return 0', () => {
			const { component } = setup();
			expect(component.getConditionState(0)).toEqual(BatteryStatus[0]);
		});

		it('#getConditionState should return 1', () => {
			const { component } = setup();
			expect(component.getConditionState(1)).toEqual(BatteryStatus[1]);
			expect(component.getConditionState(3)).toEqual(BatteryStatus[1]);
		});

		it('#getConditionState should return 2', () => {
			const { component } = setup();
			expect(component.getConditionState(2)).toBe(BatteryStatus[2]);
			expect(component.getConditionState(4)).toBe(BatteryStatus[2]);
			expect(component.getConditionState(5)).toBe(BatteryStatus[2]);
		});

		it('#reInitValue should set flag to false', () => {
			const { component } = setup();
			component.reInitValue();
			expect(component.flag).toBeFalsy();
		});

		it('#getBatteryCondition should set conditions and call setConditionTips', () => {
			const { fixture, component, commonService } = setup();
			// Normal condition
			component.batteryInfo = info.batteryInformation;
			component.batteryGauge = info.batteryIndicatorInfo;
			spyOn(commonService, 'getLocalStorageValue').and.returnValue(1);
			spyOn(component, 'setConditionTips');
			fixture.detectChanges();

			component.getBatteryCondition();
			expect(commonService.getLocalStorageValue).toHaveBeenCalledWith(LocalStorageKey.MachineType);
			expect(component.batteryConditions).toEqual([new BatteryConditionModel(0, 0)]);
			expect(component.setConditionTips).toHaveBeenCalled();

			component.batteryHealth = 1;
			component.getBatteryCondition();
			// 	expect(component.batteryConditions).toEqual([new BatteryConditionModel(17, 1)]);

			// Limited AC adapter status
			component.batteryHealth = 0;
			component.batteryGauge.acAdapterStatus = 'Limited';
			component.getBatteryCondition();
			// expect(component.batteryConditions).toEqual([new BatteryConditionModel(16, 3), new BatteryConditionModel(0, 0)]);
			expect(component.batteryConditions).toEqual([new BatteryConditionModel(0, 0), new BatteryConditionModel(16, 3)]);

			// Not Supported AC adapter status
			component.batteryGauge.acAdapterStatus = 'NotSupported';
			component.getBatteryCondition();
			// expect(component.batteryConditions).toEqual([new BatteryConditionModel(15, 3), new BatteryConditionModel(0, 0)]);
			expect(component.batteryConditions).toEqual([new BatteryConditionModel(0, 0), new BatteryConditionModel(15, 3)]);

			// all thinkPad conditions
			component.batteryGauge.acAdapterStatus = 'Supported';
			component.batteryInfo[0].batteryCondition = ['HardwareAuthenticationError', 'HighTemperature', 'TrickleCharge', 'OverheatedBattery', 'PermanentError'];
			component.getBatteryCondition();
			expect(component.batteryConditions.length).toEqual(5);

			// power driver missing
			component.batteryInfo = undefined;
			component.batteryGauge.isPowerDriverMissing = true;
			component.batteryIndicator.batteryNotDetected = false;
			component.getBatteryCondition();
			expect(component.batteryConditions).toEqual([new BatteryConditionModel(14, 2)]);
		});

		it('#setConditionTips should get condition tips array ', () => {
			const { component } = setup();
			component.batteryConditions = conditions;
			component.setConditionTips();

			expect(component.batteryConditionNotes.length).toBe(3);
		});

	});


	// beforeEach(async(() => {
	// 	TestBed.configureTestingModule({
	// 		declarations: [BatteryCardComponent],
	// 		schemas: [NO_ERRORS_SCHEMA],
	// 		imports: [TranslationModule, HttpClientModule, RouterTestingModule],
	// 		providers: [TranslateStore]
	// 	}).compileComponents();
	// }));
	// afterEach(() => {
	// 	component.isLoading = false;
	// });

	// beforeEach(() => {
	// 	fixture = TestBed.createComponent(BatteryCardComponent);
	// 	debugElement = fixture.debugElement;
	// 	commonService = debugElement.injector.get(CommonService);
	// 	batteryService = debugElement.injector.get(BatteryDetailService);
	// 	modalService = debugElement.injector.get(NgbModal);
	// 	component = fixture.componentInstance;
	// 	fixture.detectChanges();
	// });

	// it('should create', () => {
	// 	expect(component).toBeTruthy();
	// });

	// it('#ngOnInit should call getBatteryDetailOnCard', () => {
	// 	spyOn(component, 'getBatteryDetailOnCard');
	// 	component.ngOnInit();
	// 	expect(component.getBatteryDetailOnCard).toHaveBeenCalled();
	// });

	// it('#onPowerSupplyStatusEvent should set batteryInfo, batteryGauge and call updateBatteryDetails', () => {
	// 	spyOn(component, 'updateBatteryDetails');
	// 	component.onPowerSupplyStatusEvent(info);
	// 	expect(component.batteryInfo).toEqual(info.batteryInformation);
	// 	expect(component.batteryGauge).toEqual(info.batteryIndicatorInfo);
	// 	expect(component.updateBatteryDetails).toHaveBeenCalled();
	// });

	// it('#onRemainingPercentageEvent should set batteryInfo, batteryGauge and call updateBatteryDetails', () => {
	// 	spyOn(component, 'updateBatteryDetails');
	// 	component.onRemainingPercentageEvent(info);
	// 	expect(component.batteryInfo).toEqual(info.batteryInformation);
	// 	expect(component.batteryGauge).toEqual(info.batteryIndicatorInfo);
	// 	expect(component.updateBatteryDetails).toHaveBeenCalled();
	// });

	// it('#onRemainingTimeEvent should set batteryInfo, batteryGauge and call updateBatteryDetails', () => {
	// 	spyOn(component, 'updateBatteryDetails');
	// 	component.onRemainingTimeEvent(info);
	// 	expect(component.batteryInfo).toEqual(info.batteryInformation);
	// 	expect(component.batteryGauge).toEqual(info.batteryIndicatorInfo);
	// 	expect(component.updateBatteryDetails).toHaveBeenCalled();
	// });

	// it('#getBatteryDetails should get battery information', async () => {
	// 	spyOn(batteryService, 'getBatteryDetail').and.returnValue(Promise.resolve(info));
	// 	await component.getBatteryDetails();
	// 	expect(batteryService.getBatteryDetail).toHaveBeenCalled();
	// 	expect(component.batteryInfo).toEqual(info.batteryInformation);
	// 	expect(component.batteryGauge).toEqual(info.batteryIndicatorInfo);
	// });

	// it('#onNotification should show threshold warning note and call sendThresholdWarning', () => {
	// 	spyOn(component, 'sendThresholdWarning');
	// 	const notification = thresholdNotification;
	// 	component.onNotification(notification);
	// 	expect(component.chargeThresholdInfo).toEqual(notification.payload);
	// 	// TODO
	// 	// expect(component.param1).toEqual({ value: component.chargeThresholdInfo.stopValue1 });
	// 	expect(component.sendThresholdWarning).toHaveBeenCalled();
	// });

	// it('#onNotification should show Airplane mode Icon inside battery', () => {
	// 	const notification = airplaneModeNotification;
	// 	component.onNotification(notification);
	// 	expect(component.batteryIndicator.isAirplaneMode).toEqual(notification.payload);
	// });

	// it('#initBatteryInformation should set undefined battery properties to default values', () => {
	// 	component.batteryGauge = info.batteryIndicatorInfo;
	// 	component.batteryInfo = info.batteryInformation;

	// 	component.batteryGauge.isExpressCharging = undefined;
	// 	component.batteryGauge.percentage = undefined;
	// 	component.batteryInfo[0].batteryCondition = [];

	// 	component.initBatteryInformation();
	// 	expect(component.batteryGauge.isExpressCharging).toBeFalsy();
	// 	expect(component.batteryGauge.percentage).toEqual(0);
	// 	expect(component.batteryInfo[0].batteryCondition).toEqual(['Normal']);
	// });

	// it('#updateBatteryDetails should call initBatteryInformation, initialize batteryIndicator, send remaining percentages to threshold and call getBatteryCondition', () => {
	// 	component.batteryGauge = info.batteryIndicatorInfo;
	// 	component.batteryInfo = info.batteryInformation;

	// 	spyOn(component, 'initBatteryInformation');
	// 	spyOn(component, 'sendThresholdWarning');
	// 	spyOn(component, 'getBatteryCondition');
	// 	spyOn(component, 'updateBatteryDetails').and.callThrough();
	// 	component.updateBatteryDetails();

	// 	expect(component.initBatteryInformation).toHaveBeenCalled();

	// 	expect(component.remainingPercentages).toEqual([component.batteryInfo[0].remainingPercent]);
	// 	expect(component.sendThresholdWarning).toHaveBeenCalled();
	// 	expect(component.batteryHealth).toEqual(component.batteryInfo[0].batteryHealth);
	// 	expect(component.batteryIndicator.batteryNotDetected).toBeFalsy();
	// 	expect(component.batteryIndicator.percent).toEqual(component.batteryGauge.percentage);
	// 	expect(component.batteryIndicator.charging).toBeFalsy();
	// 	expect(component.batteryIndicator.timeText).toEqual('timeRemaining');
	// 	expect(component.batteryIndicator.expressCharging).toBeFalsy();

	// 	expect(component.getBatteryCondition).toHaveBeenCalled();
	// });

	// it('#sendThresholdWarning should call commonService sendNotification with false', () => {
	// 	component.remainingPercentages = [65];
	// 	component.chargeThresholdInfo = thresholdNotification.payload;
	// 	spyOn(commonService, 'sendNotification');
	// 	component.sendThresholdWarning();
	// 	expect(commonService.sendNotification).toHaveBeenCalledWith('ThresholdWarningNote', false);
	// });

	// it('#sendThresholdWarning should call commonService sendNotification with true', () => {
	// 	component.remainingPercentages = [85];
	// 	component.chargeThresholdInfo = thresholdNotification.payload;
	// 	spyOn(commonService, 'sendNotification');
	// 	component.sendThresholdWarning();
	// 	expect(commonService.sendNotification).toHaveBeenCalledWith('ThresholdWarningNote', true);
	// });

	// it('#showDetailModal should call modalService open method', () => {
	// 	spyOn(modalService, 'open').and.returnValue({ result: Promise.resolve() });
	// 	component.showDetailModal(component.batteryModal);
	// 	expect(modalService.open).toHaveBeenCalledWith(component.batteryModal, {
	// 		backdrop: 'static',
	// 		size: 'lg',
	// 		windowClass: 'battery-modal-size'
	// 	});
	// });

	// it('#showDetailTip should set shortAcErrNote to false', () => {
	// 	const condition: BatteryConditionModel = {
	// 		condition: 16,
	// 		conditionStatus: 3,
	// 		getBatteryConditionTip() {
	// 			return 'device.deviceSettings.batteryGauge.condition.LimitedACAdapterSupport';
	// 		}
	// 	};
	// 	component.batteryConditionNotes = [condition.getBatteryConditionTip(condition.condition)];
	// 	component.batteryConditions = [condition];
	// 	component.showDetailTip(0);
	// 	expect(component.shortAcErrNote).toBeFalsy();
	// });

	// it('#getConditionState should return 0', () => {
	// 	expect(component.getConditionState(0)).toEqual(BatteryQuality[0]);
	// });

	// it('#getConditionState should return 1', () => {
	// 	expect(component.getConditionState(1)).toEqual(BatteryQuality[1]);
	//     expect(component.getConditionState(3)).toEqual(BatteryQuality[1]);
	// });

	// it('#getConditionState should return 2', () => {
	// 	expect(component.getConditionState(2)).toBe(BatteryQuality[2]);
	// 	expect(component.getConditionState(4)).toBe(BatteryQuality[2]);
	// 	expect(component.getConditionState(5)).toBe(BatteryQuality[2]);
	// });

	// it('#reInitValue should set flag to false', () => {
	// 	component.reInitValue();
	// 	expect(component.flag).toBeFalsy();
	// });

	// it('#getBatteryCondition should set conditions and call setConditionTips', () => {
	// 	// Normal condition
	// 	component.batteryInfo = info.batteryInformation;
	// 	component.batteryGauge = info.batteryIndicatorInfo;
	// 	spyOn(commonService, 'getLocalStorageValue').and.returnValue(1);
	// 	spyOn(component, 'setConditionTips');
	// 	component.getBatteryCondition();
	// 	expect(commonService.getLocalStorageValue).toHaveBeenCalledWith(LocalStorageKey.MachineType);
	// 	expect(component.batteryConditions).toEqual([new BatteryConditionModel(0, 0)]);
	// 	expect(component.setConditionTips).toHaveBeenCalled();

	// 	component.batteryHealth = 1;
	// 	component.getBatteryCondition();
	// //	expect(component.batteryConditions).toEqual([new BatteryConditionModel(17, 1)]);

	// 	// Limited AC adapter status
	// 	component.batteryHealth = 0;
	// 	component.batteryGauge.acAdapterStatus = 'Limited';
	// 	component.getBatteryCondition();
	// 	expect(component.batteryConditions).toEqual([new BatteryConditionModel(16, 3), new BatteryConditionModel(0, 0)]);

	// 	// Not Supported AC adapter status
	// 	component.batteryGauge.acAdapterStatus = 'NotSupported';
	// 	component.getBatteryCondition();
	// 	expect(component.batteryConditions).toEqual([new BatteryConditionModel(15, 3), new BatteryConditionModel(0, 0)]);

	// 	// all thinkPad conditions
	// 	component.batteryGauge.acAdapterStatus = 'Supported';
	// 	component.batteryInfo[0].batteryCondition = ['HardwareAuthenticationError', 'HighTemperature', 'TrickleCharge', 'OverheatedBattery', 'PermanentError'];
	// 	component.getBatteryCondition();
	// 	expect(component.batteryConditions.length).toEqual(5);

	// 	// power driver missing
	// 	component.batteryInfo = undefined;
	// 	component.batteryGauge.isPowerDriverMissing = true;
	// 	component.batteryIndicator.batteryNotDetected = false;
	// 	component.getBatteryCondition();
	// 	expect(component.batteryConditions).toEqual([new BatteryConditionModel(14, 2)]);
	// });

	// it('#setConditionTips should get condition tips array ', () => {
	// 	component.batteryConditions = conditions;
	// 	component.setConditionTips();

	// 	expect(component.batteryConditionNotes.length).toBe(3);
	// });
});
