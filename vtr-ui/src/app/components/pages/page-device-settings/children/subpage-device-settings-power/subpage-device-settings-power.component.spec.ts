import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { discardPeriodicTasks, fakeAsync, TestBed, tick, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateStore } from '@ngx-translate/core';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { AlwaysOnUSBCapability } from 'src/app/data-models/device/always-on-usb.model';
import { ChargeThreshold } from 'src/app/data-models/device/charge-threshold.model';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { TranslationModule } from 'src/app/modules/translation.module';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';
import { CommonMetricsService } from 'src/app/services/common-metrics/common-metrics.service';
import { CommonService } from 'src/app/services/common/common.service';
import { DevService } from 'src/app/services/dev/dev.service';
import { HypothesisService } from 'src/app/services/hypothesis/hypothesis.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { PowerService } from 'src/app/services/power/power.service';
import { SubpageDeviceSettingsPowerComponent } from './subpage-device-settings-power.component';
import { of as observableOf } from 'rxjs';

const featureStatus = {
	available: true,
	status: true,
	permission: true,
	isLoading: true,
};
const ChargeThresholdData = {
	batteryNum: 1,
	isCapable: false,
	isEnabled: false,
	startValue: 40,
	stopValue: 45,
	checkboxValue: false,
};

const alwaysOnUSBCapability = {
	toggleState: featureStatus,
	checkbox: featureStatus,
};

const easyResumeCache = {
	available: true,
	status: true,
	permission: true,
	isLoading: true,
};

const airplanePowerCache = {
	toggleState: featureStatus,
	checkbox: featureStatus,
};

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe('SubpageDeviceSettingsPowerComponent', () => {
	let mode = 'expressCharging';
	const batteryNum = 1;
	const machineType = 1;
	const thresholdInfo: ChargeThreshold[] = [
		{
			batteryNum: 1,
			isCapable: false,
			isEnabled: false,
			startValue: 40,
			stopValue: 45,
			checkboxValue: false,
		},
	];
	beforeEach(waitForAsync(() => {
		const localCacheServiceMock: Partial<LocalCacheService> = {
			getLocalCacheValue: (key, value) => Promise.resolve(),
			setLocalCacheValue: (key, value) => Promise.resolve(),
		};
		const loggerServiceMock: Partial<LoggerService> = {
			error: (message, data) => {},
			info: (message, data) => {},
			debug: (message, data) => {},
		};
		TestBed.configureTestingModule({
			declarations: [SubpageDeviceSettingsPowerComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslationModule, HttpClientModule, RouterTestingModule],
			providers: [
				DevService,
				MetricService,
				CommonMetricsService,
				HypothesisService,
				TranslateStore,
				{
					provide: LocalCacheService,
					useValue: localCacheServiceMock,
				},
				{
					provide: LoggerService,
					useValue: loggerServiceMock,
				},
			],
		}).compileComponents();
	}));

	describe(':', () => {
		const setup = () => {
			const fixture = TestBed.createComponent(SubpageDeviceSettingsPowerComponent);
			const component = fixture.componentInstance;
			const commonService = TestBed.inject(CommonService);
			const powerService = TestBed.inject(PowerService);
			const modalService = TestBed.inject(NgbModal);
			const localCacheService = TestBed.inject(LocalCacheService);
			const loggerService = TestBed.inject(LoggerService);

			component.alwaysOnUSBCache = new AlwaysOnUSBCapability();
			component.easyResumeCache = new FeatureStatus(true, true);
			component.airplanePowerCache = new AlwaysOnUSBCapability();

			return {
				fixture,
				component,
				commonService,
				modalService,
				powerService,
				localCacheService,
				loggerService,
			};
		};

		it('should create', () => {
			const { component } = setup();
			expect(component).toBeTruthy();
		});
		it('#startMonitor should call', () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			fixture.detectChanges();
			component.startMonitor();
			expect(powerService.startMonitor).toHaveBeenCalled();
		});
		it('#getStartMonitorCallBack should call', () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			fixture.detectChanges();
			component.getStartMonitorCallBack(featureStatus);
		});
		it('#onVantageToolBarStatusToggle should call', () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			spyOn(powerService, 'setVantageToolBarStatus').and.returnValue(Promise.resolve(true));
			fixture.detectChanges();
			component.onVantageToolBarStatusToggle(true);
			expect(powerService.setVantageToolBarStatus).toHaveBeenCalled();
		});

		it('#toggleBCTSwitch should call', () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			fixture.detectChanges();
			component.thresholdInfo = thresholdInfo;
			component.toggleBCTSwitch(true);
		});

		it('#getGaugeResetCapability should call', fakeAsync(() => {
			const { component, powerService, localCacheService } = setup();

			const getGaugeResetCapabilitySpy = spyOn(
				powerService,
				'getGaugeResetCapability'
			).and.returnValue(Promise.resolve(true));

			const setLocalCacheValueSpy = spyOn(
				localCacheService,
				'setLocalCacheValue'
			).and.returnValue(Promise.resolve());

			component.batteryService.gaugeResetInfo = [];

			component.getGaugeResetCapability();

			tick();

			expect(getGaugeResetCapabilitySpy).toHaveBeenCalled();
			expect(setLocalCacheValueSpy).toHaveBeenCalledWith(
				LocalStorageKey.GaugeResetCapability,
				true
			);
			discardPeriodicTasks();
		}));
		it('#setChargeThresholdValues should call', fakeAsync(() => {
			const { component, powerService, commonService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			spyOn(commonService, 'sendNotification').and.returnValue();

			component.chargeThresholdStatus = false;
			component.onBCTInfoChange(thresholdInfo[0], batteryNum);

			tick();

			expect(commonService.sendNotification).toHaveBeenCalled();

			discardPeriodicTasks();
		}));
		it('#changeBatteryMode should call', async () => {
			const { fixture, component, powerService } = setup();
			const myPrivateSpy = spyOn<any>(
				component,
				'setConservationModeStatusIdeaNoteBook'
			).and.callThrough();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			mode = 'expressCharging';
			fixture.detectChanges();
			await component.changeBatteryMode(mode);
			component.conservationModeStatus.status = true;
			component.changeBatteryMode(mode);
			expect(myPrivateSpy).toHaveBeenCalled();
		});

		it('#changeBatteryMode should call else', async () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			mode = 'conservationMode';
			fixture.detectChanges();
			component.conservationModeStatus.status = false;
			component.changeBatteryMode(mode);
		});

		it('#getBatteryAndPowerSettings should call', async () => {
			const { fixture, component, powerService } = setup();
			spyOn(component, 'getBatteryAndPowerSettings');
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			const myPrivateSpy = spyOn<any>(
				component,
				'getEasyResumeCapabilityThinkPad'
			).and.callThrough();
			fixture.detectChanges();
			component.machineType = machineType;
			await component.getBatteryAndPowerSettings();
			expect(component.getBatteryAndPowerSettings).toHaveBeenCalled();
			myPrivateSpy.call(component);
		});

		it('#getEasyResumeCapabilityThinkPad should call', fakeAsync(() => {
			const { component, powerService, localCacheService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			spyOn(powerService, 'getEasyResumeCapabilityThinkPad').and.returnValue(
				Promise.resolve(true)
			);
			const getEasyResumeCapabilityThinkPadSpy = spyOn<any>(
				component,
				'getEasyResumeCapabilityThinkPad'
			).and.callThrough();

			const setLocalCacheValueSpy = spyOn(localCacheService, 'setLocalCacheValue')
				.withArgs(LocalStorageKey.EasyResumeCapability, component.easyResumeCache)
				.and.returnValue(Promise.resolve());

			getEasyResumeCapabilityThinkPadSpy.call(component);

			tick(200);

			expect(powerService.getEasyResumeCapabilityThinkPad).toHaveBeenCalled();
			expect(setLocalCacheValueSpy).toHaveBeenCalled();

			discardPeriodicTasks();
		}));

		it('#updatePowerMode should call', async () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			const myPrivateSpy = spyOn<any>(
				component,
				'setAlwaysOnUSBStatusThinkPad'
			).and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
			component.machineType = 1;
			component.updatePowerMode();
			expect(myPrivateSpy).toHaveBeenCalled();
		});
		it('#getAlwaysOnUSBCapabilityThinkPad should call', async () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			spyOn(powerService, 'getAlwaysOnUSBCapabilityThinkPad').and.returnValue(
				Promise.resolve(true)
			);
			const myPrivateSpy = spyOn<any>(
				component,
				'getAlwaysOnUSBCapabilityThinkPad'
			).and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
			expect(powerService.getAlwaysOnUSBCapabilityThinkPad).toHaveBeenCalled();
		});
		it('#setEasyResumeThinkPad should call', async () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			const myPrivateSpy = spyOn<any>(component, 'setEasyResumeThinkPad').and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
		});

		it('#setAlwaysOnUSBStatusThinkPad should call', async () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			spyOn(powerService, 'setAlwaysOnUSBStatusThinkPad').and.returnValue(
				Promise.resolve(true)
			);
			const myPrivateSpy = spyOn<any>(
				component,
				'setAlwaysOnUSBStatusThinkPad'
			).and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
			expect(powerService.setAlwaysOnUSBStatusThinkPad).toHaveBeenCalled();
		});

		it('#getAirplaneModeAutoDetectionOnThinkPad should call', async () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			spyOn(powerService, 'getAirplaneModeAutoDetectionOnThinkPad').and.returnValue(
				Promise.resolve(true)
			);
			const myPrivateSpy = spyOn<any>(
				component,
				'getAirplaneModeAutoDetectionOnThinkPad'
			).and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
			expect(powerService.getAirplaneModeAutoDetectionOnThinkPad).toHaveBeenCalled();
		});
		it('#getUSBChargingInBatteryModeStatusIdeaNoteBook should call', fakeAsync(() => {
			const { component, powerService, localCacheService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			spyOn(powerService, 'getUSBChargingInBatteryModeStatusIdeaNoteBook').and.returnValue(
				Promise.resolve(featureStatus)
			);
			const getUSBChargingInBatteryModeStatusIdeaNoteBookSpy = spyOn<any>(
				component,
				'getUSBChargingInBatteryModeStatusIdeaNoteBook'
			).and.callThrough();

			const setLocalCacheValueSpy = spyOn(localCacheService, 'setLocalCacheValue')
				.withArgs(LocalStorageKey.AlwaysOnUSBCapability, alwaysOnUSBCapability)
				.and.returnValue(Promise.resolve());

			getUSBChargingInBatteryModeStatusIdeaNoteBookSpy.call(component);

			tick();

			expect(powerService.getUSBChargingInBatteryModeStatusIdeaNoteBook).toHaveBeenCalled();
			expect(setLocalCacheValueSpy).toHaveBeenCalled();

			discardPeriodicTasks();
		}));
		it('#getAlwaysOnUSBStatusIdeaPad should call', fakeAsync(() => {
			const { component, powerService, localCacheService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			spyOn(powerService, 'getAlwaysOnUSBStatusIdeaNoteBook').and.returnValue(
				Promise.resolve(featureStatus)
			);
			const getAlwaysOnUSBStatusIdeaPadSpy = spyOn<any>(
				component,
				'getAlwaysOnUSBStatusIdeaPad'
			).and.callThrough();

			const setLocalCacheValueSpy = spyOn(localCacheService, 'setLocalCacheValue')
				.withArgs(LocalStorageKey.AlwaysOnUSBCapability, alwaysOnUSBCapability)
				.and.returnValue(Promise.resolve());

			getAlwaysOnUSBStatusIdeaPadSpy.call(component);

			tick();

			expect(powerService.getAlwaysOnUSBStatusIdeaNoteBook).toHaveBeenCalled();
			expect(setLocalCacheValueSpy).toHaveBeenCalled();

			discardPeriodicTasks();
		}));
		it('#setUSBChargingInBatteryModeStatusIdeaNoteBook should call', async () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			spyOn(powerService, 'setUSBChargingInBatteryModeStatusIdeaNoteBook').and.returnValue(
				Promise.resolve(true)
			);
			const myPrivateSpy = spyOn<any>(
				component,
				'setUSBChargingInBatteryModeStatusIdeaNoteBook'
			).and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
			expect(powerService.setUSBChargingInBatteryModeStatusIdeaNoteBook).toHaveBeenCalled();
		});

		it('#setConservationModeStatusIdeaNoteBook should call', async () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			spyOn(powerService, 'setConservationModeStatusIdeaNoteBook').and.returnValue(
				Promise.resolve(true)
			);
			const myPrivateSpy = spyOn<any>(
				component,
				'setConservationModeStatusIdeaNoteBook'
			).and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
			expect(powerService.setConservationModeStatusIdeaNoteBook).toHaveBeenCalled();
		});
		it('#getConservationModeStatusIdeaPad should call', async () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			spyOn(powerService, 'getConservationModeStatusIdeaNoteBook').and.returnValue(
				Promise.resolve(featureStatus)
			);
			const myPrivateSpy = spyOn<any>(
				component,
				'getConservationModeStatusIdeaPad'
			).and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
			expect(powerService.getConservationModeStatusIdeaNoteBook).toHaveBeenCalled();
		});

		it('#onNotification should call', async () => {
			const { fixture, component } = setup();
			spyOn(component, 'getBatteryAndPowerSettings');
			const myPrivateSpy = spyOn<any>(component, 'onNotification').and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
		});

		it('#getAlwaysOnUSBStatusThinkPad should call', fakeAsync(() => {
			const { component, powerService, localCacheService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			spyOn(powerService, 'getAlwaysOnUSBStatusThinkPad').and.returnValue(
				Promise.resolve(true)
			);
			const getAlwaysOnUSBStatusThinkPadSpy = spyOn<any>(
				component,
				'getAlwaysOnUSBStatusThinkPad'
			).and.callThrough();

			const setLocalCacheValueSpy = spyOn(localCacheService, 'setLocalCacheValue')
				.withArgs(LocalStorageKey.AlwaysOnUSBCapability, alwaysOnUSBCapability)
				.and.returnValue(Promise.resolve());

			getAlwaysOnUSBStatusThinkPadSpy.call(component);

			tick(200);

			expect(powerService.getAlwaysOnUSBStatusThinkPad).toHaveBeenCalled();
			expect(setLocalCacheValueSpy).toHaveBeenCalled();

			discardPeriodicTasks();
		}));
		// it('#getAlwaysOnUSBStatusThinkPad should call catch block', async () => {
		// 	const { component } = setup();
		// 	expect(component['getAlwaysOnUSBStatusThinkPad']).toThrow();
		// });
		// it('#getEasyResumeStatusThinkPad should call catch block', async () => {
		// 	const { component } = setup();
		// 	expect(component['getEasyResumeStatusThinkPad']).toThrow();
		// });
		//
		// it('#initOtherSettingsFromCache should call catch block', async () => {
		// 	const { component } = setup();
		// 	expect(component['initOtherSettingsFromCache']).toThrow();
		// });
		// it('#initConservationModeFromCache should call catch block', async () => {
		// 	const { component } = setup();
		// 	expect(component['initConservationModeFromCache']).toThrow();
		// });
		//
		// it('#initExpressChargingFromCache should call catch block', async () => {
		// 	const { component } = setup();
		// 	expect(component['initExpressChargingFromCache']).toThrow();
		// });
		// it('#initBatteryChargeThresholdFromCache should call catch block', async () => {
		// 	const { component } = setup();
		// 	expect(component['initBatteryChargeThresholdFromCache']).toThrow();
		// });
		//
		// it('#initGaugeResetInfoFromCache should call catch block', async () => {
		// 	const { component } = setup();
		// 	expect(component['initGaugeResetInfoFromCache']).toThrow();
		// });
		it('#getEasyResumeStatusThinkPad should call', fakeAsync(() => {
			const { component, powerService, localCacheService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			spyOn(powerService, 'getEasyResumeStatusThinkPad').and.returnValue(
				Promise.resolve(true)
			);
			const getEasyResumeStatusThinkPadSpy = spyOn<any>(
				component,
				'getEasyResumeStatusThinkPad'
			).and.callThrough();

			const setLocalCacheValueSpy = spyOn(localCacheService, 'setLocalCacheValue')
				.withArgs(LocalStorageKey.EasyResumeCapability, component.easyResumeCache)
				.and.returnValue(Promise.resolve());

			getEasyResumeStatusThinkPadSpy.call(component);

			tick();

			expect(powerService.getEasyResumeStatusThinkPad).toHaveBeenCalled();
			expect(setLocalCacheValueSpy).toHaveBeenCalled();

			discardPeriodicTasks();
		}));
		it('#setAlwaysOnUSBStatusIdeaPad should call', async () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			const myPrivateSpy = spyOn<any>(
				component,
				'setAlwaysOnUSBStatusIdeaPad'
			).and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
		});

		it('#setAirplaneModeThinkPad should call', async () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			const myPrivateSpy = spyOn<any>(component, 'setAirplaneModeThinkPad').and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
			expect(myPrivateSpy).toHaveBeenCalled();
		});

		it('#onToggleOfEasyResume should call', () => {
			const { fixture, component, powerService } = setup();
			const myPrivateSpy = spyOn<any>(component, 'setEasyResumeThinkPad').and.callThrough();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			fixture.detectChanges();
			component.machineType = 1;
			component.onToggleOfEasyResume(true);
			expect(myPrivateSpy).toHaveBeenCalled();
			component.machineType = 0;
			component.onToggleOfEasyResume(true);
			expect(component.machineType).toBe(0);
		});
		it('#onToggleOfAirplanePowerMode should call', () => {
			const { fixture, component, powerService } = setup();
			const myPrivateSpy = spyOn<any>(component, 'setAirplaneModeThinkPad').and.callThrough();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			fixture.detectChanges();
			component.machineType = 1;
			component.onToggleOfAirplanePowerMode(true);
			expect(myPrivateSpy).toHaveBeenCalled();
			component.machineType = 0;
			component.onToggleOfAirplanePowerMode(true);
			expect(component.machineType).toBe(0);
		});

		it('#onToggleOfAlwaysOnUsb should call', async () => {
			const { component, powerService, localCacheService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			const setAlwaysOnUSBStatusThinkPadSpy = spyOn<any>(
				component,
				'setAlwaysOnUSBStatusThinkPad'
			).and.callThrough();

			const setLocalCacheValueSpy = spyOn(localCacheService, 'setLocalCacheValue')
				.withArgs(LocalStorageKey.AlwaysOnUSBCapability, component.alwaysOnUSBCache)
				.and.returnValue(Promise.resolve());

			component.machineType = 1;
			await component.onToggleOfAlwaysOnUsb(true);
			expect(setAlwaysOnUSBStatusThinkPadSpy).toHaveBeenCalled();

			component.machineType = 0;
			component.onToggleOfAlwaysOnUsb(true);
			expect(setAlwaysOnUSBStatusThinkPadSpy).toHaveBeenCalled();

			expect(setLocalCacheValueSpy).toHaveBeenCalled();
		});
		it('should call getBatteryAndPowerSettings', () => {
			const { component } = setup();
			component.machineType = 0;
			component.getBatteryAndPowerSettings();
			expect(component.showEasyResumeSection).toBe(false);
		});

		it('should call getBatteryAndPowerSettings', () => {
			const { component } = setup();
			component.machineType = 1;
			component.getBatteryAndPowerSettings();
		});

		it('onSetSmatStandbyCapability else case', () => {
			const { component, commonService } = setup();
			const booleanEvent = true;
			const spy = spyOn(commonService, 'isPresent').and.returnValue(true);
			component.onSetSmartStandbyCapability(booleanEvent);
			expect(spy).toHaveBeenCalledWith(component.headerMenuItems, 'smartStandby');
		});

		it('onSetSmatStandbyCapability else case - 2', () => {
			const { component, commonService } = setup();
			const booleanEvent = true;
			const spy = spyOn(commonService, 'isPresent').and.returnValue(false);
			component.onSetSmartStandbyCapability(booleanEvent);
			expect(spy).toHaveBeenCalledWith(component.headerMenuItems, 'smartStandby');
		});

		it('onSetSmartSettingsCapability ', () => {
			const { component } = setup();
			const booleanEvent = false;
			const spy = spyOn(component, 'onSetSmartSettingsCapability').and.callThrough();
			component.onSetSmartSettingsCapability(booleanEvent);
			expect(spy).toHaveBeenCalled();
		});

		it('isThresholdWarningMsgShown', () => {
			const { component } = setup();
			component.thresholdInfo = thresholdInfo;
			component.isThresholdWarningMsgShown();
			expect(component.thresholdInfo.length).toEqual(1);
		});
		it('onAutoCheckChange', () => {
			const { component } = setup();
			component.thresholdInfo = thresholdInfo;
			component.onAutoCheckChange(ChargeThresholdData, 0);
		});
		it('onToggleOfFlipToStart', () => {
			const { component } = setup();
			const spy = spyOn(component, 'onToggleOfFlipToStart').and.callThrough();
			component.onToggleOfFlipToStart(true);
			expect(spy).toHaveBeenCalled();
		});
		it('#onToggleOfFlipToStart catch block should call', () => {
			const { component, powerService } = setup();
			const spy = spyOn(powerService, 'setFlipToStartSettings').and.returnValue(
				Promise.reject()
			);
			component.onToggleOfFlipToStart(true);
			expect(spy).toHaveBeenCalled();
		});
		it('should call setChargeThresholdUI', () => {
			const { component } = setup();
			const bctInfo = thresholdInfo;
			bctInfo[0].isCapable = true;
			bctInfo[0].isEnabled = true;
			const spy = spyOn(component, 'isThresholdWarningMsgShown');
			component.setChargeThresholdUI(bctInfo);
			expect(spy).toHaveBeenCalled();
		});
		it('#startMonitor catch block should call', () => {
			const { component, powerService } = setup();
			const spy = spyOn(powerService, 'startMonitor').and.returnValue(Promise.reject());
			component.startMonitor();
			expect(spy).toHaveBeenCalled();
		});
		it('#getGaugeResetCapability catch block should call', () => {
			const { component, powerService } = setup();
			const spy = spyOn(powerService, 'getGaugeResetCapability').and.returnValue(
				Promise.reject()
			);
			component.getGaugeResetCapability();
			expect(spy).toHaveBeenCalled();
		});

		it('#getVantageToolBarStatus catch block should call', () => {
			const { component, powerService } = setup();
			const spy = spyOn(powerService, 'getVantageToolBarStatus').and.returnValue(
				Promise.reject()
			);
			component.getVantageToolBarStatus();
			expect(spy).toHaveBeenCalled();
		});
		describe('#getEnergyStarCapability', () => {
			it('given getEnergyStarCapability result is reject then should go to catch block', () => {
				const { component, powerService } = setup();
				const spy = spyOn(powerService, 'getEnergyStarCapability').and.returnValue(
					Promise.reject()
				);
				component.getEnergyStarCapability();
				expect(spy).toHaveBeenCalled();
			});
			it('given getEnergyStarCapability is completed then should go to then block, set isEnergyStarProduct and call setLocalStorageValue', fakeAsync(() => {
				const { component, powerService, localCacheService } = setup();
				const getEnergyStarCapabilitySpy = spyOn(
					powerService,
					'getEnergyStarCapability'
				).and.returnValue(Promise.resolve(true));
				const setLocalCacheValueSpy = spyOn(localCacheService, 'setLocalCacheValue')
					.withArgs(LocalStorageKey.EnergyStarCapability, true)
					.and.returnValue(Promise.resolve());

				component.getEnergyStarCapability();

				tick();
				expect(getEnergyStarCapabilitySpy).toHaveBeenCalled();
				expect(component.isEnergyStarProduct).toBeTruthy();
				expect(setLocalCacheValueSpy).toHaveBeenCalled();
				discardPeriodicTasks();
			}));
		});
		it('#setEasyResumeThinkPad catch block should call', () => {
			const { component, powerService } = setup();
			const spy = spyOn(powerService, 'setEasyResumeThinkPad').and.returnValue(
				Promise.reject()
			);
			const myPrivateSpy = spyOn<any>(component, 'setEasyResumeThinkPad').and.callThrough();
			myPrivateSpy.call(component);
			expect(spy).toHaveBeenCalled();
		});
		it('#setRapidChargeModeStatusIdeaNoteBook catch block should call', () => {
			const { component, powerService } = setup();
			const spy = spyOn(powerService, 'setRapidChargeModeStatusIdeaNoteBook').and.returnValue(
				Promise.reject()
			);
			const myPrivateSpy = spyOn<any>(
				component,
				'setRapidChargeModeStatusIdeaNoteBook'
			).and.callThrough();
			myPrivateSpy.call(component);
			expect(spy).toHaveBeenCalled();
		});
		it('#setAlwaysOnUSBStatusThinkPad catch block should call', () => {
			const { component, powerService } = setup();
			const spy = spyOn(powerService, 'setAlwaysOnUSBStatusThinkPad').and.returnValue(
				Promise.reject()
			);
			const myPrivateSpy = spyOn<any>(
				component,
				'setAlwaysOnUSBStatusThinkPad'
			).and.callThrough();
			myPrivateSpy.call(component);
			expect(spy).toHaveBeenCalled();
		});
		it('#onBCTInfoChange catch block should call', () => {
			const { component, powerService } = setup();
			const spy = spyOn(powerService, 'setChargeThresholdValue').and.returnValue(
				Promise.reject()
			);
			component.onBCTInfoChange(thresholdInfo[0], batteryNum);
			expect(spy).toHaveBeenCalled();
		});
		it('#onBCTInfoChange should call', () => {
			const { component, powerService } = setup();
			const spy = spyOn(powerService, 'setChargeThresholdValue').and.returnValue(
				Promise.resolve(0)
			);
			component.chargeThresholdStatus = true;
			component.onBCTInfoChange(thresholdInfo[0], batteryNum);
			expect(spy).toHaveBeenCalled();
		});
		it('#getAlwaysOnUSBCapabilityThinkPad catch block should call', () => {
			const { fixture, component, powerService } = setup();
			const spy = spyOn(powerService, 'getAlwaysOnUSBCapabilityThinkPad').and.returnValue(
				Promise.reject()
			);
			const myPrivateSpy = spyOn<any>(
				component,
				'getAlwaysOnUSBCapabilityThinkPad'
			).and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
			expect(spy).toHaveBeenCalled();
		});
		it('#setAirplaneModeAutoDetectionOnThinkPad catch block should call', () => {
			const { component, powerService } = setup();
			const spy = spyOn(
				powerService,
				'setAirplaneModeAutoDetectionOnThinkPad'
			).and.returnValue(Promise.reject());
			const myPrivateSpy = spyOn<any>(
				component,
				'setAirplaneModeAutoDetectionOnThinkPad'
			).and.callThrough();
			myPrivateSpy.call(component);
			expect(spy).toHaveBeenCalled();
		});

		it('#setUSBChargingInBatteryModeStatusIdeaNoteBook catch block should call', () => {
			const { fixture, component, powerService } = setup();
			const spy = spyOn(
				powerService,
				'setUSBChargingInBatteryModeStatusIdeaNoteBook'
			).and.returnValue(Promise.reject());
			const myPrivateSpy = spyOn<any>(
				component,
				'setUSBChargingInBatteryModeStatusIdeaNoteBook'
			).and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
			expect(spy).toHaveBeenCalled();
		});
		it('#setAlwaysOnUSBStatusIdeaPad catch block should call', () => {
			const { fixture, component, powerService } = setup();
			const spy = spyOn(powerService, 'setAlwaysOnUSBStatusIdeaNoteBook').and.returnValue(
				Promise.reject()
			);
			const myPrivateSpy = spyOn<any>(
				component,
				'setAlwaysOnUSBStatusIdeaPad'
			).and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
			expect(spy).toHaveBeenCalled();
		});

		it('#setAirplaneModeThinkPad catch block should call', () => {
			const { component, powerService } = setup();
			const spy = spyOn(powerService, 'setAirplaneModeThinkPad').and.returnValue(
				Promise.reject()
			);
			const myPrivateSpy = spyOn<any>(component, 'setAirplaneModeThinkPad').and.callThrough();
			myPrivateSpy.call(component);
			expect(spy).toHaveBeenCalled();
		});
		it('#setConservationModeStatusIdeaNoteBook catch block should call', () => {
			const { component, powerService } = setup();
			const spy = spyOn(
				powerService,
				'setConservationModeStatusIdeaNoteBook'
			).and.returnValue(Promise.reject());
			const myPrivateSpy = spyOn<any>(
				component,
				'setConservationModeStatusIdeaNoteBook'
			).and.callThrough();
			myPrivateSpy.call(component);
			expect(spy).toHaveBeenCalled();
		});
		it('#getConservationModeStatusIdeaPad catch block should call', () => {
			const { component, powerService } = setup();
			const spy = spyOn(
				powerService,
				'getConservationModeStatusIdeaNoteBook'
			).and.returnValue(Promise.reject());
			const myPrivateSpy = spyOn<any>(
				component,
				'getConservationModeStatusIdeaPad'
			).and.callThrough();
			myPrivateSpy.call(component);
			expect(spy).toHaveBeenCalled();
		});
		it('#getFlipToStartCapability catch block should call', () => {
			const { component, powerService } = setup();
			const spy = spyOn(powerService, 'getFlipToStartCapability').and.returnValue(
				Promise.reject()
			);
			const myPrivateSpy = spyOn<any>(
				component,
				'getFlipToStartCapability'
			).and.callThrough();
			myPrivateSpy.call(component);
			expect(spy).toHaveBeenCalled();
		});
		it('#setBCTToggleOff catch block should call', () => {
			const { component, powerService } = setup();
			const spy = spyOn(powerService, 'setToggleOff').and.returnValue(Promise.reject());
			component.thresholdInfo = [];
			component.setBCTToggleOff(true);
			expect(spy).toHaveBeenCalled();
		});
		it('#setBCTToggleOff  should call', () => {
			const { component, powerService, commonService } = setup();
			const spy = spyOn(powerService, 'setToggleOff').and.returnValue(Promise.resolve(0));
			spyOn(commonService, 'sendNotification').and.returnValue();
			component.thresholdInfo = [];
			component.setBCTToggleOff(true);
			expect(spy).toHaveBeenCalled();
		});

		describe('#initEnergyStarFromCache - ', () => {
			it('given has some error the should catch throw', (done) => {
				const { component, localCacheService, loggerService } = setup();
				const spy = spyOn(loggerService, 'info');
				localCacheService.getLocalCacheValue = undefined;

				component.initEnergyStarFromCache();

				expect(spy).toHaveBeenCalled();
				done();
			});

			it('given has EnergyStarCapability and the value is true should call getLocalStorageValue from LocalCacheService and set isEnergyStarProduct', fakeAsync(() => {
				const { component } = setup();
				const localCacheService = TestBed.inject(LocalCacheService);
				const getLocalCacheValueSpy = spyOn(localCacheService, 'getLocalCacheValue')
					.withArgs(LocalStorageKey.EnergyStarCapability, undefined)
					.and.returnValue(Promise.resolve(true));

				component.initEnergyStarFromCache();

				tick(200);
				expect(getLocalCacheValueSpy).toHaveBeenCalled();
				expect(component.isEnergyStarProduct).toBeTruthy();
				discardPeriodicTasks();
			}));
		});

		describe('#checkIsPowerPageAvailable', () => {
			it('given it pass the value as true and new id then should add id to goto link and save IsPowerPageAvailable cache as true', () => {
				const someKey = 'someKey_1';
				const { component, localCacheService } = setup();
				const spy = spyOn(localCacheService, 'setLocalCacheValue')
					.withArgs(LocalStorageKey.IsPowerPageAvailable, true)
					.and.returnValue(Promise.resolve());

				component.gotoLinks = [];
				component.checkIsPowerPageAvailable(true, someKey);

				expect(component.gotoLinks.length).toBe(1);
				expect(component.gotoLinks).toContain(someKey);
				expect(spy).toHaveBeenCalled();
			});

			it('given it pass the value as false and existent id then should remove the id from goto link and save IsPowerPageAvailable cache as true', () => {
				const someKey = 'someKey_2';
				const otherKey = 'otherKey';
				const { component, localCacheService } = setup();
				const spy = spyOn(localCacheService, 'setLocalCacheValue')
					.withArgs(LocalStorageKey.IsPowerPageAvailable, true)
					.and.returnValue(Promise.resolve());

				component.gotoLinks = [someKey, otherKey];
				component.checkIsPowerPageAvailable(false, someKey);

				expect(component.gotoLinks.length).toBe(1);
				expect(component.gotoLinks).not.toContain(someKey);
				expect(component.gotoLinks).toContain(otherKey);
				expect(spy).toHaveBeenCalled();
			});

			it('given it pass the value as false and existent id and gotoLinks has only one id then should remove the id from goto link and save IsPowerPageAvailable cache as false', () => {
				const someKey = 'someKey_3';
				const { component, localCacheService } = setup();
				const spy = spyOn(localCacheService, 'setLocalCacheValue')
					.withArgs(LocalStorageKey.IsPowerPageAvailable, false)
					.and.returnValue(Promise.resolve());

				component.gotoLinks = [someKey];
				component.checkIsPowerPageAvailable(false, someKey);

				expect(component.gotoLinks.length).toBe(0);
				expect(component.gotoLinks).not.toContain(someKey);

				expect(spy).toHaveBeenCalled();
			});
		});

		describe('#initGaugeResetInfoFromCache - ', () => {
			it('given has some error the should catch throw', (done) => {
				const { component, localCacheService, loggerService } = setup();
				const spy = spyOn(loggerService, 'info');
				localCacheService.getLocalCacheValue = undefined;

				component.initGaugeResetInfoFromCache();

				expect(spy).toHaveBeenCalled();
				done();
			});
			it('should call getLocalStorageValue from LocalCacheService and set gaugeResetCapability', fakeAsync(() => {
				const { component, localCacheService } = setup();

				const getLocalCacheValueSpy = spyOn(localCacheService, 'getLocalCacheValue')
					.withArgs(LocalStorageKey.GaugeResetCapability, undefined)
					.and.returnValue(Promise.resolve(true));

				component.initGaugeResetInfoFromCache();

				tick(200);

				expect(getLocalCacheValueSpy).toHaveBeenCalled();
				expect(component.gaugeResetCapability).toBeTruthy();
				discardPeriodicTasks();
			}));
		});
		describe('#initPowerSettingsFromCache - ', () => {
			it('given has some error the should catch throw', (done) => {
				const { component, localCacheService, loggerService } = setup();
				const spy = spyOn(loggerService, 'info');
				localCacheService.getLocalCacheValue = undefined;

				component.initPowerSettingsFromCache();

				expect(spy).toHaveBeenCalled();
				done();
			});
			it('should call getLocalStorageValue from LocalCacheService and set alwaysOnUSBCache', fakeAsync(() => {
				const { component, localCacheService } = setup();

				const getLocalCacheValueFromAlwaysOnUSBCapabilitySpy = spyOn(
					localCacheService,
					'getLocalCacheValue'
				).and.returnValue(Promise.resolve(alwaysOnUSBCapability));

				component.getAlwaysOnUSBCacheFromCache();

				tick(200);

				expect(getLocalCacheValueFromAlwaysOnUSBCapabilitySpy).toHaveBeenCalledWith(
					LocalStorageKey.AlwaysOnUSBCapability,
					undefined
				);
				expect(component.alwaysOnUSBCache).toEqual(alwaysOnUSBCapability);

				discardPeriodicTasks();
			}));
			it('should call getLocalStorageValue from LocalCacheService and set easyResumeCache', fakeAsync(() => {
				const { component, localCacheService } = setup();

				const getLocalCacheValueFromEasyResumeCacheSpy = spyOn(
					localCacheService,
					'getLocalCacheValue'
				).and.returnValue(Promise.resolve(easyResumeCache));

				component.getEasyResumeCacheFromCache();

				tick(200);

				expect(getLocalCacheValueFromEasyResumeCacheSpy).toHaveBeenCalledWith(
					LocalStorageKey.EasyResumeCapability,
					undefined
				);
				expect(component.easyResumeCache).toEqual(easyResumeCache);

				discardPeriodicTasks();
			}));
		});
		describe('#initAirplanePowerFromCache - ', () => {
			it('given has some error the should catch throw', (done) => {
				const { component, localCacheService, loggerService } = setup();
				const spy = spyOn(loggerService, 'info');
				localCacheService.getLocalCacheValue = undefined;

				component.initAirplanePowerFromCache();

				expect(spy).toHaveBeenCalled();
				done();
			});
			it('should call getLocalStorageValue from LocalCacheService and set airplanePowerCache', fakeAsync(() => {
				const { component, localCacheService } = setup();

				const getLocalCacheValueSpy = spyOn(
					localCacheService,
					'getLocalCacheValue'
				).and.returnValue(Promise.resolve(airplanePowerCache));

				component.initAirplanePowerFromCache();

				tick(200);

				expect(getLocalCacheValueSpy).toHaveBeenCalledWith(
					LocalStorageKey.AirplanePowerModeCapability,
					undefined
				);
				expect(component.airplanePowerCache).toEqual(airplanePowerCache);

				discardPeriodicTasks();
			}));
		});
	});
});

describe('Airplane Power Mode', () => {
	let fixture: ComponentFixture<SubpageDeviceSettingsPowerComponent>;
	let component: SubpageDeviceSettingsPowerComponent;
	let localCacheServiceSpy: jasmine.Spy;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [SubpageDeviceSettingsPowerComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslationModule, HttpClientModule, RouterTestingModule],
			providers: [
				LocalCacheService,
				DevService,
				MetricService,
				CommonMetricsService,
				HypothesisService,
				TranslateStore,
			],
		}).compileComponents();

		fixture = TestBed.createComponent(SubpageDeviceSettingsPowerComponent);
		component = fixture.componentInstance;
		const batteryService = TestBed.inject(BatteryDetailService);
		const localCacheService = TestBed.inject(LocalCacheService);
		const airplaneStatus = new FeatureStatus(false, true);
		spyOn(batteryService, 'getAirplaneMode').and.returnValue(observableOf(airplaneStatus));
		localCacheServiceSpy = spyOn(localCacheService, 'setLocalCacheValue');
	});

	it('sets airplane mode capability to local cache on component init', () => {
		const expectedFeature = new AlwaysOnUSBCapability();
		expectedFeature.toggleState.status = true;
		expectedFeature.toggleState.available = false;

		component.ngOnInit();

		expect(component.airplanePowerCache).toEqual(expectedFeature);
		expect(localCacheServiceSpy).toHaveBeenCalledWith(
			LocalStorageKey.AirplanePowerModeCapability,
			expectedFeature
		);
	});
});

describe('Battery Charge Threshold', () => {
	let fixture: ComponentFixture<SubpageDeviceSettingsPowerComponent>;
	let component: SubpageDeviceSettingsPowerComponent;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [SubpageDeviceSettingsPowerComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslationModule, HttpClientModule, RouterTestingModule],
			providers: [
				LocalCacheService,
				DevService,
				MetricService,
				CommonMetricsService,
				HypothesisService,
				TranslateStore,
			],
		}).compileComponents();

		fixture = TestBed.createComponent(SubpageDeviceSettingsPowerComponent);
		component = fixture.componentInstance;
	});

	it('is set as status true when service returns threshold is enabled', () => {
		const batteryService = TestBed.inject(BatteryDetailService);
		const enabledChargeThreshold = new ChargeThreshold();
		enabledChargeThreshold.checkboxValue = true;
		const chargeThresholds = [enabledChargeThreshold];
		spyOn(batteryService, 'getChargeThresholdInfo').and.returnValue(
			observableOf(chargeThresholds)
		);

		component.ngOnInit();

		expect(component.thresholdInfo[0].checkboxValue).toEqual(true);
	});
});
