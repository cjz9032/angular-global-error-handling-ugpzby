import { async, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, Component } from '@angular/core';
import { TranslateStore } from '@ngx-translate/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { SubpageDeviceSettingsPowerComponent } from './subpage-device-settings-power.component';
import { PowerService } from 'src/app/services/power/power.service';
import { CommonService } from 'src/app/services/common/common.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { MetricService } from '../../../../../services/metric/metric.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChargeThreshold } from 'src/app/data-models/device/charge-threshold.model';
import { BatteryChargeThresholdCapability } from 'src/app/data-models/device/battery-charge-threshold-capability.model';
const featureStatus = {
	available: true,
	status: true,
	permission: true,
	isLoading: true
};
const ChargeThresholdData= {
	batteryNum :1,
	isCapable : false,
	isEnabled : false,
	startValue : 40,
	stopValue : 45,
	checkboxValue : false
}

describe('SubpageDeviceSettingsPowerComponent', () => {
	let powerService: PowerService;
	let commonService: CommonService;
	let logger: LoggerService;
	let modalService: NgbModal;
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
		}
	];

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SubpageDeviceSettingsPowerComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslationModule, HttpClientModule, RouterTestingModule],
			providers: [TranslateStore]
		})
			.compileComponents();
	}));
	describe(':', () => {
		function setup() {
			const fixture = TestBed.createComponent(SubpageDeviceSettingsPowerComponent);
			const component = fixture.componentInstance;
			commonService = fixture.debugElement.injector.get(CommonService);
			powerService = fixture.debugElement.injector.get(PowerService);
			logger = fixture.debugElement.injector.get(LoggerService);
			modalService = fixture.debugElement.injector.get(NgbModal);
			return { fixture, component, commonService, logger, modalService, powerService };
		}

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
		it('#onAirplaneAutoModeStatusChange should call', () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			fixture.detectChanges();
			component.onAirplaneAutoModeStatusChange();
		});
		it('#toggleBCTSwitch should call', () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			fixture.detectChanges();
			component.thresholdInfo = thresholdInfo;
			component.toggleBCTSwitch(true);
		});

		it('#getGaugeResetCapability should call', () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			spyOn(powerService, 'getGaugeResetCapability').and.returnValue(Promise.resolve(true));
			fixture.detectChanges();
			component.getGaugeResetCapability();
			expect(powerService.getGaugeResetCapability).toHaveBeenCalled();
		});
		it('#setChargeThresholdValues should call', () => {
			const { fixture, component, powerService, commonService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			spyOn(commonService, 'sendNotification').and.returnValue();
			fixture.detectChanges();
			component.onBCTInfoChange(thresholdInfo[0], batteryNum);
			expect(commonService.sendNotification).toHaveBeenCalled();
		});
		it('#changeBatteryMode should call', async () => {
			const { fixture, component, powerService } = setup();
			const myPrivateSpy = spyOn<any>(component, 'setConservationModeStatusIdeaNoteBook').and.callThrough();
			const myPrivateSpyObj = spyOn<any>(component, 'setRapidChargeModeStatusIdeaNoteBook').and.callThrough();
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
			const myPrivateSpy = spyOn<any>(component, 'setConservationModeStatusIdeaNoteBook').and.callThrough();
			const myPrivateSpyObj = spyOn<any>(component, 'setRapidChargeModeStatusIdeaNoteBook').and.callThrough();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			mode = 'conservationMode';
			fixture.detectChanges();
			component.conservationModeStatus.status = false;
			component.changeBatteryMode(mode);
		});
		it('#onUsbChargingStatusChange should call', async () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			spyOn(component, 'updatePowerMode');
			fixture.detectChanges();
			await component.onUsbChargingStatusChange();
			expect(component.updatePowerMode).toHaveBeenCalled();
		});

		it('#getBatteryAndPowerSettings should call', async () => {
			const { fixture, component, powerService } = setup();
			spyOn(component, 'getBatteryAndPowerSettings');
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			const myPrivateSpy = spyOn<any>(component, 'getEasyResumeCapabilityThinkPad').and.callThrough();
			fixture.detectChanges();
			component.machineType = machineType;
			await component.getBatteryAndPowerSettings();
			expect(component.getBatteryAndPowerSettings).toHaveBeenCalled();
			myPrivateSpy.call(component);
		});
		it('#getAirplaneModeThinkPad should call', async () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			spyOn(powerService, 'getAirplaneModeThinkPad').and.returnValue(Promise.resolve(true));
			const myPrivateSpy = spyOn<any>(component, 'getAirplaneModeThinkPad').and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
			expect(powerService.getAirplaneModeThinkPad).toHaveBeenCalled();

		});
		it('#updatePowerMode should call', async () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			const myPrivateSpy = spyOn<any>(component, 'setAlwaysOnUSBStatusThinkPad').and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
			component.machineType = 1;
			component.updatePowerMode();
			expect(myPrivateSpy).toHaveBeenCalled();
		});
		it('#getAlwaysOnUSBCapabilityThinkPad should call', async () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			spyOn(powerService, 'getAlwaysOnUSBCapabilityThinkPad').and.returnValue(Promise.resolve(true));
			const myPrivateSpy = spyOn<any>(component, 'getAlwaysOnUSBCapabilityThinkPad').and.callThrough();
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
		// it('#getBatteryStatusEvent should call', async () => {
		// 	const { fixture, component, powerService } = setup();
		// 	spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
		// 	const myPrivateSpy = spyOn<any>(component, 'getBatteryStatusEvent').and.callThrough();
		// 	fixture.detectChanges();
		// 	myPrivateSpy.call(component);
		// 	await component.getBatteryThresholdInformation();
		// });
		it('#setAlwaysOnUSBStatusThinkPad should call', async () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			spyOn(powerService, 'setAlwaysOnUSBStatusThinkPad').and.returnValue(Promise.resolve(true));
			const myPrivateSpy = spyOn<any>(component, 'setAlwaysOnUSBStatusThinkPad').and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
			expect(powerService.setAlwaysOnUSBStatusThinkPad).toHaveBeenCalled();
		});
		it('#getAirplaneModeCapabilityThinkPad should call', async () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			spyOn(powerService, 'getAirplaneModeCapabilityThinkPad').and.returnValue(Promise.resolve(true));
			const myPrivateSpy = spyOn<any>(component, 'getAirplaneModeCapabilityThinkPad').and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
			expect(powerService.getAirplaneModeCapabilityThinkPad).toHaveBeenCalled();
		});
		it('#getAirplaneModeAutoDetectionOnThinkPad should call', async () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			spyOn(powerService, 'getAirplaneModeAutoDetectionOnThinkPad').and.returnValue(Promise.resolve(true));
			const myPrivateSpy = spyOn<any>(component, 'getAirplaneModeAutoDetectionOnThinkPad').and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
			expect(powerService.getAirplaneModeAutoDetectionOnThinkPad).toHaveBeenCalled();
		});
		it('#getUSBChargingInBatteryModeStatusIdeaNoteBook should call', async () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			spyOn(powerService, 'getUSBChargingInBatteryModeStatusIdeaNoteBook').and.returnValue(Promise.resolve(featureStatus));
			const myPrivateSpy = spyOn<any>(component, 'getUSBChargingInBatteryModeStatusIdeaNoteBook').and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
			expect(powerService.getUSBChargingInBatteryModeStatusIdeaNoteBook).toHaveBeenCalled();
		});
		it('#getAlwaysOnUSBStatusIdeaPad should call', async () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			spyOn(powerService, 'getAlwaysOnUSBStatusIdeaNoteBook').and.returnValue(Promise.resolve(featureStatus));
			const myPrivateSpy = spyOn<any>(component, 'getAlwaysOnUSBStatusIdeaPad').and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
			expect(powerService.getAlwaysOnUSBStatusIdeaNoteBook).toHaveBeenCalled();
		});
		it('#setUSBChargingInBatteryModeStatusIdeaNoteBook should call', async () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			spyOn(powerService, 'setUSBChargingInBatteryModeStatusIdeaNoteBook').and.returnValue(Promise.resolve(true));
			const myPrivateSpy = spyOn<any>(component, 'setUSBChargingInBatteryModeStatusIdeaNoteBook').and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
			expect(powerService.setUSBChargingInBatteryModeStatusIdeaNoteBook).toHaveBeenCalled();
		});
		it('#getRapidChargeModeStatusIdeaPad should call', async () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			spyOn(powerService, 'getRapidChargeModeStatusIdeaNoteBook').and.returnValue(Promise.resolve(featureStatus));
			const myPrivateSpy = spyOn<any>(component, 'getRapidChargeModeStatusIdeaPad').and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
			expect(powerService.getRapidChargeModeStatusIdeaNoteBook).toHaveBeenCalled();
		});
		it('#setConservationModeStatusIdeaNoteBook should call', async () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			spyOn(powerService, 'setConservationModeStatusIdeaNoteBook').and.returnValue(Promise.resolve(true));
			const myPrivateSpy = spyOn<any>(component, 'setConservationModeStatusIdeaNoteBook').and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
			expect(powerService.setConservationModeStatusIdeaNoteBook).toHaveBeenCalled();
		});
		it('#getConservationModeStatusIdeaPad should call', async () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			spyOn(powerService, 'getConservationModeStatusIdeaNoteBook').and.returnValue(Promise.resolve(featureStatus));
			const myPrivateSpy = spyOn<any>(component, 'getConservationModeStatusIdeaPad').and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
			expect(powerService.getConservationModeStatusIdeaNoteBook).toHaveBeenCalled();
		});

		it('#onNotification should call', async () => {
			const { fixture, component, powerService } = setup();
			const notification = {type: 'IsPowerDriverMissing', payload: true};
			spyOn(component, 'getBatteryAndPowerSettings');
			const myPrivateSpy = spyOn<any>(component, 'onNotification').and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);

		});

		it('#getAlwaysOnUSBStatusThinkPad should call', async () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			spyOn(powerService, 'getAlwaysOnUSBStatusThinkPad').and.returnValue(Promise.resolve(true));
			const myPrivateSpy = spyOn<any>(component, 'getAlwaysOnUSBStatusThinkPad').and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
            expect(powerService.getAlwaysOnUSBStatusThinkPad).toHaveBeenCalled();  
        });
        it('#getAlwaysOnUSBStatusThinkPad should call catch block', async () => {
            const { component } = setup();
            expect(component['getAlwaysOnUSBStatusThinkPad']).toThrow();
        });
        it('#getEasyResumeStatusThinkPad should call catch block', async () => {
            const { component} = setup();
            expect(component['getEasyResumeStatusThinkPad']).toThrow();
        });
        it('#initEnergyStarFromCache should call catch block', async () => {
            const { component} = setup();
            expect(component['initEnergyStarFromCache']).toThrow();
        });
        it('#initOtherSettingsFromCache should call catch block', async () => {
            const { component} = setup();
            expect(component['initOtherSettingsFromCache']).toThrow();
        });
        it('#initPowerSettingsFromCache should call catch block', async () => {
            const { component} = setup();
            expect(component['initPowerSettingsFromCache']).toThrow();
        });
        it('#initConservationModeFromCache should call catch block', async () => {
            const { component} = setup();
            expect(component['initConservationModeFromCache']).toThrow();
        });
       
        it('#initExpressChargingFromCache should call catch block', async () => {
            const { component} = setup();
            expect(component['initExpressChargingFromCache']).toThrow();
        });
        it('#initBatteryChargeThresholdFromCache should call catch block', async () => {
            const { component} = setup();
            expect(component['initBatteryChargeThresholdFromCache']).toThrow();
        });
        it('#initAirplanePowerFromCache should call catch block', async () => {
            const { component} = setup();
            expect(component['initAirplanePowerFromCache']).toThrow();
        });
        
        it('#initGaugeResetInfoFromCache should call catch block', async () => {
            const { component} = setup();
            expect(component['initGaugeResetInfoFromCache']).toThrow();
        });
		it('#getEasyResumeStatusThinkPad should call', async () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			spyOn(powerService, 'getEasyResumeStatusThinkPad').and.returnValue(Promise.resolve(true));
			const myPrivateSpy = spyOn<any>(component, 'getEasyResumeStatusThinkPad').and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
			expect(powerService.getEasyResumeStatusThinkPad).toHaveBeenCalled();
		});
		it('#setAlwaysOnUSBStatusIdeaPad should call', async () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			const myPrivateSpy = spyOn<any>(component, 'setAlwaysOnUSBStatusIdeaPad').and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
		});

		it('#setAirplaneModeThinkPad should call', async () => {
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			const myPrivateSpy = spyOn<any>(component, 'setAirplaneModeThinkPad').and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
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
			const { fixture, component, powerService } = setup();
			spyOn(powerService, 'startMonitor').and.returnValue(Promise.resolve(true));
			const myPrivateSpy = spyOn<any>(component, 'setAlwaysOnUSBStatusThinkPad').and.callThrough();
			fixture.detectChanges();
			component.machineType = 1;
			await component.onToggleOfAlwaysOnUsb(true);
			expect(myPrivateSpy).toHaveBeenCalled();
			component.machineType = 0;
			component.onToggleOfAlwaysOnUsb(true);
			expect(myPrivateSpy).toHaveBeenCalled();
		});
		it('should call getBatteryAndPowerSettings', (() => {
			const { component, fixture } = setup();
			component.machineType = 0;
			component.getBatteryAndPowerSettings();
			expect(component.showEasyResumeSection).toBe(false);
		}));

		it('should call getBatteryAndPowerSettings', (() => {
			const { component, fixture } = setup();
			component.machineType = 1;
			component.getBatteryAndPowerSettings();
		}));

		it('onSetSmatStandbyCapability else case', () => {
			const { component } = setup();
			const booleanEvent = true;
			const spy = spyOn(commonService, 'isPresent').and.returnValue(true);
			component.onSetSmartStandbyCapability(booleanEvent);
			expect(spy).toHaveBeenCalledWith(component.headerMenuItems, 'smartStandby');
		});

		it('onSetSmatStandbyCapability else case - 2', () => {
			const { component } = setup();
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
            component.thresholdInfo=thresholdInfo;
            component.isThresholdWarningMsgShown();
            expect(component.thresholdInfo.length).toEqual(1);
    
        });
        it('onAutoCheckChange', () => {
			const { component } = setup();
            component.thresholdInfo=thresholdInfo;
            component.onAutoCheckChange(ChargeThresholdData,0);
        });
        it('onToggleOfFlipToBoot', () => {
			const { component,powerService } = setup();
            const spy = spyOn(component, 'onToggleOfFlipToBoot').and.callThrough();
			component.onToggleOfFlipToBoot(true);
            expect(spy).toHaveBeenCalled();
        });
        it('#onToggleOfFlipToBoot catch block should call', () => {
			const { fixture, component, powerService } = setup();
            let spy =spyOn(powerService, 'setFlipToBootSettings').and.returnValue(Promise.reject());
			 component.onToggleOfFlipToBoot(true);
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
			const { fixture, component, powerService } = setup();
            let spy =spyOn(powerService, 'startMonitor').and.returnValue(Promise.reject());
			 component.startMonitor();
			 expect(spy).toHaveBeenCalled();
        });
        it('#getGaugeResetCapability catch block should call', () => {
			const { fixture, component, powerService } = setup();
            let spy =spyOn(powerService, 'getGaugeResetCapability').and.returnValue(Promise.reject());
			 component.getGaugeResetCapability();
			 expect(spy).toHaveBeenCalled();
        });
        it('#initPowerSmartSettingFromCache catch block should call', () => {
			const { fixture, component, powerService } = setup();
            let spy =spyOn(commonService, 'getLocalStorageValue').and.returnValue(Promise.reject());
			 component.initPowerSmartSettingFromCache();
			 expect(spy).toHaveBeenCalled();
        });
        it('#getVantageToolBarStatus catch block should call', () => {
			const { fixture, component, powerService } = setup();
            let spy =spyOn(powerService, 'getVantageToolBarStatus').and.returnValue(Promise.reject());
			 component.getVantageToolBarStatus();
			 expect(spy).toHaveBeenCalled();
        });
        it('#getEnergyStarCapability catch block should call', () => {
			const { fixture, component, powerService } = setup();
            let spy =spyOn(powerService, 'getEnergyStarCapability').and.returnValue(Promise.reject());
			 component.getEnergyStarCapability();
			 expect(spy).toHaveBeenCalled();
        });
        it('#setEasyResumeThinkPad catch block should call', () => {
			const { fixture, component, powerService } = setup();
            let spy =spyOn(powerService, 'setEasyResumeThinkPad').and.returnValue(Promise.reject());
            const myPrivateSpy = spyOn<any>(component, 'setEasyResumeThinkPad').and.callThrough();
			myPrivateSpy.call(component);
			 expect(spy).toHaveBeenCalled();
        });
        it('#setRapidChargeModeStatusIdeaNoteBook catch block should call', () => {
			const { fixture, component, powerService } = setup();
            let spy =spyOn(powerService, 'setRapidChargeModeStatusIdeaNoteBook').and.returnValue(Promise.reject());
            const myPrivateSpy = spyOn<any>(component, 'setRapidChargeModeStatusIdeaNoteBook').and.callThrough();
			myPrivateSpy.call(component);
			 expect(spy).toHaveBeenCalled();
        });
        it('#setAlwaysOnUSBStatusThinkPad catch block should call', () => {
			const { fixture, component, powerService } = setup();
            let spy =spyOn(powerService, 'setAlwaysOnUSBStatusThinkPad').and.returnValue(Promise.reject());
            const myPrivateSpy = spyOn<any>(component, 'setAlwaysOnUSBStatusThinkPad').and.callThrough();
			myPrivateSpy.call(component);
			 expect(spy).toHaveBeenCalled();
        });
        it('#onBCTInfoChange catch block should call', () => {
			const { fixture, component, powerService } = setup();
            let spy =spyOn(powerService, 'setChargeThresholdValue').and.returnValue(Promise.reject());
			component.onBCTInfoChange(thresholdInfo[0], batteryNum);
			expect(spy).toHaveBeenCalled();

        });
        it('#onBCTInfoChange should call', () => {
			const { fixture, component, powerService } = setup();
            let spy =spyOn(powerService, 'setChargeThresholdValue').and.returnValue(Promise.resolve(0));
            component.chargeThresholdStatus=true;
			component.onBCTInfoChange(thresholdInfo[0], batteryNum);
			expect(spy).toHaveBeenCalled();

        });
        it('#getAlwaysOnUSBCapabilityThinkPad catch block should call', () => {
			const { fixture, component, powerService } = setup();
            let spy =spyOn(powerService, 'getAlwaysOnUSBCapabilityThinkPad').and.returnValue(Promise.reject());
			const myPrivateSpy = spyOn<any>(component, 'getAlwaysOnUSBCapabilityThinkPad').and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
			expect(spy).toHaveBeenCalled();

        });
        it('#setAirplaneModeAutoDetectionOnThinkPad catch block should call', () => {
			const { fixture, component, powerService } = setup();
            let spy =spyOn(powerService, 'setAirplaneModeAutoDetectionOnThinkPad').and.returnValue(Promise.reject());
			const myPrivateSpy = spyOn<any>(component, 'setAirplaneModeAutoDetectionOnThinkPad').and.callThrough();
			myPrivateSpy.call(component);
			expect(spy).toHaveBeenCalled();

        });
        // it('#getBatteryThresholdInformation catch block should call', () => {
		// 	const { fixture, component, powerService } = setup();
        //     let spy =spyOn(powerService, 'getChargeThresholdInfo').and.returnValue(Promise.reject());
		// 	component.getBatteryThresholdInformation();
		// 	expect(spy).toHaveBeenCalled();
		// });
		
        it('#setUSBChargingInBatteryModeStatusIdeaNoteBook catch block should call', () => {
			const { fixture, component, powerService } = setup();
            let spy =spyOn(powerService, 'setUSBChargingInBatteryModeStatusIdeaNoteBook').and.returnValue(Promise.reject());
			const myPrivateSpy = spyOn<any>(component, 'setUSBChargingInBatteryModeStatusIdeaNoteBook').and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
			expect(spy).toHaveBeenCalled();
        });
        it('#setAlwaysOnUSBStatusIdeaPad catch block should call', () => {
			const { fixture, component, powerService } = setup();
            let spy =spyOn(powerService, 'setAlwaysOnUSBStatusIdeaNoteBook').and.returnValue(Promise.reject());
			const myPrivateSpy = spyOn<any>(component, 'setAlwaysOnUSBStatusIdeaPad').and.callThrough();
			fixture.detectChanges();
			myPrivateSpy.call(component);
			expect(spy).toHaveBeenCalled();
        });
        it('#getRapidChargeModeStatusIdeaPad catch block should call', () => {
			const { fixture, component, powerService } = setup();
            let spy =spyOn(powerService, 'getRapidChargeModeStatusIdeaNoteBook').and.returnValue(Promise.reject());
			const myPrivateSpy = spyOn<any>(component, 'getRapidChargeModeStatusIdeaPad').and.callThrough();
			myPrivateSpy.call(component);
			expect(spy).toHaveBeenCalled();

        });
        it('#setAirplaneModeThinkPad catch block should call', () => {
			const { fixture, component, powerService } = setup();
            let spy =spyOn(powerService, 'setAirplaneModeThinkPad').and.returnValue(Promise.reject());
			const myPrivateSpy = spyOn<any>(component, 'setAirplaneModeThinkPad').and.callThrough();
			myPrivateSpy.call(component);
			expect(spy).toHaveBeenCalled();

        });
        it('#setConservationModeStatusIdeaNoteBook catch block should call', () => {
			const { fixture, component, powerService } = setup();
            let spy =spyOn(powerService, 'setConservationModeStatusIdeaNoteBook').and.returnValue(Promise.reject());
			const myPrivateSpy = spyOn<any>(component, 'setConservationModeStatusIdeaNoteBook').and.callThrough();
			myPrivateSpy.call(component);
			expect(spy).toHaveBeenCalled();

        });
        it('#getConservationModeStatusIdeaPad catch block should call', () => {
			const { fixture, component, powerService } = setup();
            let spy =spyOn(powerService, 'getConservationModeStatusIdeaNoteBook').and.returnValue(Promise.reject());
			const myPrivateSpy = spyOn<any>(component, 'getConservationModeStatusIdeaPad').and.callThrough();
			myPrivateSpy.call(component);
			expect(spy).toHaveBeenCalled();
        });
        it('#getFlipToBootCapability catch block should call', () => {
			const { fixture, component, powerService } = setup();
            let spy =spyOn(powerService, 'getFlipToBootCapability').and.returnValue(Promise.reject());
			const myPrivateSpy = spyOn<any>(component, 'getFlipToBootCapability').and.callThrough();
			myPrivateSpy.call(component);
			expect(spy).toHaveBeenCalled();
        });
        it('#setBCTToggleOff catch block should call', () => {
			const { fixture, component, powerService } = setup();
            let spy =spyOn(powerService, 'setToggleOff').and.returnValue(Promise.reject());
            component.thresholdInfo=[];
			component.setBCTToggleOff(true);
			expect(spy).toHaveBeenCalled();

        });
        it('#setBCTToggleOff  should call', () => {
			const { fixture, component, powerService } = setup();
            let spy =spyOn(powerService, 'setToggleOff').and.returnValue(Promise.resolve(0));
            spyOn(commonService, 'sendNotification').and.returnValue();
            component.thresholdInfo=[];
			component.setBCTToggleOff(true);
            expect(spy).toHaveBeenCalled();
        });

	});
});
