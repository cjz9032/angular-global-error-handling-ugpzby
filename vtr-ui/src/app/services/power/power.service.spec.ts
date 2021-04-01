import { TestBed } from '@angular/core/testing';
import { TranslateStore } from '@ngx-translate/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { VantageShellService } from '../vantage-shell/vantage-shell-mock.service';
import { PowerService } from './power.service';
describe('PowerService', () => {
	// let shellService: VantageShellService;
	const batteryThresholdInfo: any = [
		{
			batteryNumber: 1,
			checkBoxValue: false,
			isCapable: true,
			isOn: false,
			startValue: 75,
			stopValue: 80,
		},
		{
			batteryNumber: 2,
			checkBoxValue: false,
			isCapable: true,
			isOn: false,
			startValue: 75,
			stopValue: 80,
		},
	];
	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [PowerService, VantageShellService, TranslateStore],
			imports: [TranslationModule.forChild()],
		})
	);
	describe(':', () => {
		const setup = () => {
			const powerService: any = TestBed.inject(PowerService);
			const shellService = TestBed.inject(VantageShellService);
			return { powerService, shellService };
		};
		it('should be created', () => {
			const { powerService } = setup();
			expect(powerService).toBeTruthy();
		});

		it('should call getLegacyAutoModeState', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerItsIntelligentCooling.intelligentCooling,
				'getLegacyAutoModeState'
			).and.callThrough();
			powerService.getLegacyAutoModeState();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerItsIntelligentCooling = false;
			powerService.getLegacyAutoModeState();

			expect(powerService.getLegacyAutoModeState).toThrow();
		});

		it('should call getITSModeForICIdeapad', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerIdeaNoteBook.intelligentCoolingForIdeaPad,
				'getITSSettings'
			).and.callThrough();
			powerService.getITSModeForICIdeapad();
			spy.call(
				powerService.devicePowerIdeaNoteBook.intelligentCoolingForIdeaPad.getITSSettings
			);

			(powerService as any).intelligentCoolingForIdeaPad = false;
			const returnValue = powerService.getITSModeForICIdeapad();
			expect(returnValue).toBe(undefined);

			expect(powerService.getITSModeForICIdeapad).toThrow();
		});

		it('should call setITSModeForICIdeapad', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerIdeaNoteBook.intelligentCoolingForIdeaPad,
				'setITSSettings'
			).and.callThrough();
			powerService.setITSModeForICIdeapad();
			spy.call(
				powerService.devicePowerIdeaNoteBook.intelligentCoolingForIdeaPad.setITSSettings
			);

			(powerService as any).intelligentCoolingForIdeaPad = false;
			const returnValue = powerService.setITSModeForICIdeapad();
			expect(returnValue).toBeUndefined();

			expect(powerService.setITSModeForICIdeapad).toThrow();
		});

		it('should call startMonitorForICIdeapad', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerIdeaNoteBook.intelligentCoolingForIdeaPad,
				'startMonitor'
			).and.callThrough();
			powerService.startMonitorForICIdeapad();
			spy.call(
				powerService.devicePowerIdeaNoteBook.intelligentCoolingForIdeaPad.startMonitor
			);

			(powerService as any).intelligentCoolingForIdeaPad = false;
			const returnValue = powerService.startMonitorForICIdeapad();
			expect(returnValue).toBe(undefined);

			expect(powerService.startMonitorForICIdeapad).toThrow();
		});

		it('should call stopMonitorForICIdeapad', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerIdeaNoteBook.intelligentCoolingForIdeaPad,
				'stopMonitor'
			).and.callThrough();
			powerService.stopMonitorForICIdeapad();
			spy.call(powerService.devicePowerIdeaNoteBook.intelligentCoolingForIdeaPad.stopMonitor);

			(powerService as any).intelligentCoolingForIdeaPad = false;
			const returnValue = powerService.stopMonitorForICIdeapad();
			expect(returnValue).toBe(undefined);

			expect(powerService.stopMonitorForICIdeapad).toThrow();
		});

		it('should call stopMonitor', () => {
			const { powerService } = setup();
			spyOn(powerService.devicePower, 'stopMonitor').and.callThrough();
			powerService.stopMonitor();
			expect(powerService.devicePower.stopMonitor).toHaveBeenCalled();

			// expect(powerService.stopMonitor).toThrow();
		});

		it('should call setAutoTransitionForICIdeapad', () => {
			const { powerService } = setup();
			(powerService as any).intelligentCoolingForIdeaPad = {
				setITSAutoTransitionSettings:(value) => {},
			};

			const spy = spyOn(
				powerService.intelligentCoolingForIdeaPad,
				'setITSAutoTransitionSettings'
			).and.callThrough();
			powerService.setAutoTransitionForICIdeapad(true);

			(powerService as any).intelligentCoolingForIdeaPad = false;
			const returnValue = powerService.setAutoTransitionForICIdeapad(true);
			expect(returnValue).toBe(undefined);
			powerService.setAutoTransitionForICIdeapad(true);

			// expect(powerService.setAutoTransitionForICIdeapad).toThrow();
		});

		it('should call getAMTCapability', () => {
			const { powerService } = setup();
			(powerService as any).devicePowerItsIntelligentCooling.intelligentCooling = {
				getAMTCapability:() => {},
			};

			const spy = spyOn(
				powerService.devicePowerItsIntelligentCooling.intelligentCooling,
				'getAMTCapability'
			).and.callThrough();
			powerService.getAMTCapability();

			(powerService as any).devicePowerItsIntelligentCooling = false;
			const returnValue = powerService.getAMTCapability();
			expect(returnValue).toBe(undefined);
			powerService.getAMTCapability();

			expect(powerService.getAMTCapability).toThrow();
		});

		it('should call getAMTSetting', () => {
			const { powerService } = setup();
			(powerService as any).devicePowerItsIntelligentCooling.intelligentCooling = {
				getAMTSetting:() => {},
			};

			const spy = spyOn(
				powerService.devicePowerItsIntelligentCooling.intelligentCooling,
				'getAMTSetting'
			).and.callThrough();
			powerService.getAMTSetting();

			(powerService as any).devicePowerItsIntelligentCooling = false;
			const returnValue = powerService.getAMTSetting();
			expect(returnValue).toBe(undefined);
			powerService.getAMTSetting();

			expect(powerService.getAMTSetting).toThrow();
		});

		it('should call isMobileWorkStation', () => {
			const { powerService } = setup();
			(powerService as any).devicePowerItsIntelligentCooling.intelligentCooling = {
				isMobileWorkStation:() => {},
			};

			const spy = spyOn(
				powerService.devicePowerItsIntelligentCooling.intelligentCooling,
				'isMobileWorkStation'
			).and.callThrough();
			powerService.isMobileWorkStation();

			(powerService as any).devicePowerItsIntelligentCooling = false;
			const returnValue = powerService.isMobileWorkStation();
			expect(returnValue).toBe(undefined);
			powerService.isMobileWorkStation();

			expect(powerService.isMobileWorkStation).toThrow();
		});

		it('should call getAlwaysOnUSBStatusIdeaNoteBook', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerIdeaNoteBook.alwaysOnUSB,
				'getUSBChargingInBatteryModeStatus'
			).and.callThrough();
			powerService.getAlwaysOnUSBStatusIdeaNoteBook();
			powerService.devicePowerIdeaNoteBook.alwaysOnUSB.getUSBChargingInBatteryModeStatus();
			powerService.devicePowerIdeaNoteBook = false;
			powerService.getAlwaysOnUSBStatusIdeaNoteBook();

			// expect(powerService.getAlwaysOnUSBStatusIdeaNoteBook).toThrow();
		});

		it('should call getRapidChargeModeStatusIdeaNoteBook', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerIdeaNoteBook.rapidChargeMode,
				'getRapidChargeModeStatus'
			).and.callThrough();
			powerService.getRapidChargeModeStatusIdeaNoteBook();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerIdeaNoteBook = false;
			powerService.getRapidChargeModeStatusIdeaNoteBook();

			expect(powerService.getRapidChargeModeStatusIdeaNoteBook).toThrow();
		});

		it('should call setRapidChargeModeStatusIdeaNoteBook', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerIdeaNoteBook.rapidChargeMode,
				'setRapidChargeModeStatus'
			).and.callThrough();
			powerService.setRapidChargeModeStatusIdeaNoteBook();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerIdeaNoteBook = false;
			powerService.setRapidChargeModeStatusIdeaNoteBook();

			expect(powerService.setRapidChargeModeStatusIdeaNoteBook).toThrow();
		});

		it('should call getFlipToStartCapability', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerIdeaNoteBook.flipToStart,
				'getFlipToStartCapability'
			).and.callThrough();
			powerService.getFlipToStartCapability();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerIdeaNoteBook = false;
			powerService.getFlipToStartCapability();

			expect(powerService.getFlipToStartCapability).toThrow();
		});

		it('should call setFlipToStartSettings', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerIdeaNoteBook.flipToStart,
				'setFlipToStartSettings'
			).and.callThrough();
			powerService.setFlipToStartSettings();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerIdeaNoteBook = false;
			powerService.setFlipToStartSettings();

			expect(powerService.setFlipToStartSettings).toThrow();
		});

		it('should call getEasyResumeCapabilityThinkPad', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerThinkPad.sectionEasyResume,
				'getEasyResumeCapability'
			).and.callThrough();
			powerService.getEasyResumeCapabilityThinkPad();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerThinkPad = false;
			powerService.getEasyResumeCapabilityThinkPad();

			expect(powerService.getEasyResumeCapabilityThinkPad).toThrow();
		});

		it('should call getAlwaysOnUSBCapabilityThinkPad', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerThinkPad.sectionAlwaysOnUsb,
				'getAlwaysOnUsbCapability'
			).and.callThrough();
			powerService.getAlwaysOnUSBCapabilityThinkPad();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerThinkPad = false;
			powerService.getAlwaysOnUSBCapabilityThinkPad();

			expect(powerService.getAlwaysOnUSBCapabilityThinkPad).toThrow();
		});

		it('should call getAlwaysOnUSBStatusThinkPad', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerThinkPad.sectionAlwaysOnUsb,
				'getAlwaysOnUsb'
			).and.callThrough();
			powerService.getAlwaysOnUSBStatusThinkPad();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerThinkPad = false;
			powerService.getAlwaysOnUSBStatusThinkPad();

			expect(powerService.getAlwaysOnUSBStatusThinkPad).toThrow();
		});

		it('should call setAlwaysOnUSBStatusThinkPad', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerThinkPad.sectionAlwaysOnUsb,
				'setAlwaysOnUsb'
			).and.callThrough();
			powerService.setAlwaysOnUSBStatusThinkPad();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerThinkPad = false;
			powerService.setAlwaysOnUSBStatusThinkPad();

			expect(powerService.setAlwaysOnUSBStatusThinkPad).toThrow();
		});

		it('should call getAirplaneModeCapabilityThinkPad', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerThinkPad.sectionAirplaneMode,
				'getAirplaneModeCapability'
			).and.callThrough();
			powerService.getAirplaneModeCapabilityThinkPad();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerThinkPad = false;
			powerService.getAirplaneModeCapabilityThinkPad();

			expect(powerService.getAirplaneModeCapabilityThinkPad).toThrow();
		});

		it('should call getAirplaneModeThinkPad', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerThinkPad.sectionAirplaneMode,
				'getAirplaneMode'
			).and.callThrough();
			powerService.getAirplaneModeThinkPad();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerThinkPad = false;
			powerService.getAirplaneModeThinkPad();

			expect(powerService.getAirplaneModeThinkPad).toThrow();
		});

		it('should call setAirplaneModeThinkPad', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerThinkPad.sectionAirplaneMode,
				'setAirplaneMode'
			).and.callThrough();
			powerService.setAirplaneModeThinkPad();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerThinkPad = false;
			powerService.setAirplaneModeThinkPad();

			expect(powerService.setAirplaneModeThinkPad).toThrow();
		});

		it('should call setAirplaneModeAutoDetectionOnThinkPad', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerThinkPad.sectionAirplaneMode,
				'setAirplaneModeAutoDetection'
			).and.callThrough();
			powerService.setAirplaneModeAutoDetectionOnThinkPad();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerThinkPad = false;
			powerService.setAirplaneModeAutoDetectionOnThinkPad();

			expect(powerService.setAirplaneModeAutoDetectionOnThinkPad).toThrow();
		});

		it('should call getAirplaneModeAutoDetectionOnThinkPad', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerThinkPad.sectionAirplaneMode,
				'getAirplaneModeAutoDetection'
			).and.callThrough();
			powerService.getAirplaneModeAutoDetectionOnThinkPad();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerThinkPad = false;
			powerService.getAirplaneModeAutoDetectionOnThinkPad();

			expect(powerService.getAirplaneModeAutoDetectionOnThinkPad).toThrow();
		});

		it('should call getVantageToolBarStatus', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePower,
				'getVantageToolBarStatus'
			).and.callThrough();
			powerService.getVantageToolBarStatus();
			expect(spy).toHaveBeenCalled();
			powerService.devicePower = false;
			powerService.getVantageToolBarStatus();

			expect(powerService.getVantageToolBarStatus).toThrow();
		});

		it('should call setVantageToolBarStatus', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePower,
				'setVantageToolBarStatus'
			).and.callThrough();
			powerService.setVantageToolBarStatus();
			expect(spy).toHaveBeenCalled();
			powerService.devicePower = false;
			powerService.setVantageToolBarStatus();

			expect(powerService.setVantageToolBarStatus).toThrow();
		});

		it('should call startMonitor', () => {
			const { powerService } = setup();
			const spy = spyOn(powerService.devicePower, 'startMonitor').and.callThrough();
			powerService.startMonitor();
			expect(spy).toHaveBeenCalled();

			powerService.isShellAvailable = false;
			const returnValue = powerService.startMonitor();
			expect(returnValue).toBe(undefined);

			expect(powerService.startMonitor).toThrow();
		});

		it('should call getChargeThresholdInfo', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerThinkPad.sectionChargeThreshold,
				'getChargeThresholdInfo'
			).and.callThrough();
			powerService.getChargeThresholdInfo();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerThinkPad = false;
			powerService.getChargeThresholdInfo();

			expect(powerService.getChargeThresholdInfo).toThrow();
		});

		it('should call getEasyResumeStatusThinkPad', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerThinkPad.sectionEasyResume,
				'getEasyResume'
			).and.callThrough();
			powerService.getEasyResumeStatusThinkPad();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerThinkPad = false;
			powerService.getEasyResumeStatusThinkPad();

			expect(powerService.getEasyResumeStatusThinkPad).toThrow();
		});

		it('should call setEasyResumeThinkPad', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerThinkPad.sectionEasyResume,
				'setEasyResume'
			).and.callThrough();
			powerService.setEasyResumeThinkPad();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerThinkPad = false;
			powerService.setEasyResumeThinkPad();

			expect(powerService.setEasyResumeThinkPad).toThrow();
		});

		it('should call setChargeThresholdValue', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerThinkPad.sectionChargeThreshold,
				'setChargeThresholdValue'
			).and.callThrough();
			powerService.setChargeThresholdValue(batteryThresholdInfo);
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerThinkPad = false;
			powerService.setChargeThresholdValue(batteryThresholdInfo);

			expect(powerService.setChargeThresholdValue).toThrow();
		});

		it('should call setCtAutoCheckbox', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerThinkPad.sectionChargeThreshold,
				'setCtAutoCheckbox'
			).and.callThrough();
			powerService.setCtAutoCheckbox(batteryThresholdInfo);
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerThinkPad = false;
			powerService.setCtAutoCheckbox(batteryThresholdInfo);

			expect(powerService.setCtAutoCheckbox).toThrow();
		});

		it('should call setToggleOff', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerThinkPad.sectionChargeThreshold,
				'setToggleOff'
			).and.callThrough();
			powerService.setToggleOff();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerThinkPad = false;
			powerService.setToggleOff();

			expect(powerService.setToggleOff).toThrow();
		});

		it('should call getEnergyStarCapability', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.imcHelper,
				'getIsEnergyStarCapability'
			).and.callThrough();
			powerService.getEnergyStarCapability();
			expect(spy).toHaveBeenCalled();
			powerService.isShellAvailable = false;
			powerService.getEnergyStarCapability();

			expect(powerService.getEnergyStarCapability).toThrow();
		});

		it('should call getSmartStandbyCapability', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerThinkPad.sectionSmartStandby,
				'getSmartStandbyCapability'
			).and.callThrough();
			powerService.getSmartStandbyCapability();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerThinkPad = false;
			powerService.getSmartStandbyCapability();

			expect(powerService.getSmartStandbyCapability).toThrow();
		});

		it('should call getSmartStandbyIsAutonomic', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerThinkPad.sectionSmartStandby,
				'getSmartStandbyIsAutonomic'
			).and.callThrough();
			powerService.getSmartStandbyIsAutonomic();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerThinkPad = false;
			powerService.getSmartStandbyIsAutonomic();

			expect(powerService.getSmartStandbyIsAutonomic).toThrow();
		});

		it('should call getSmartStandbyActiveHours', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerThinkPad.sectionSmartStandby,
				'getSmartStandbyActiveHours'
			).and.callThrough();
			powerService.GetSmartStandbyActiveHours();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerThinkPad = false;
			powerService.GetSmartStandbyActiveHours();

			expect(powerService.GetSmartStandbyActiveHours).toThrow();
		});

		it('should call getIsPresenceDataSufficient', () => {
			const { powerService } = setup();
			(powerService as any).devicePowerThinkPad.sectionSmartStandby = {
				getIsPresenceDataSufficient:() => {},
			};

			const spy = spyOn(
				powerService.devicePowerThinkPad.sectionSmartStandby,
				'getIsPresenceDataSufficient'
			).and.callThrough();
			powerService.getIsPresenceDataSufficient();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerThinkPad = false;
			powerService.getIsPresenceDataSufficient();
		});

		it('should call getSmartStandbyPresenceData', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerThinkPad.sectionSmartStandby,
				'getSmartStandbyPresenceData'
			).and.callThrough();
			powerService.getSmartStandbyPresenceData();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerThinkPad = false;
			powerService.getSmartStandbyPresenceData();

			expect(powerService.getSmartStandbyPresenceData).toThrow();
		});

		it('should call setSmartStandbyIsAutonomic', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerThinkPad.sectionSmartStandby,
				'setSmartStandbyIsAutonomic'
			).and.callThrough();
			powerService.setSmartStandbyIsAutonomic();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerThinkPad = false;
			powerService.setSmartStandbyIsAutonomic();

			expect(powerService.setSmartStandbyIsAutonomic).toThrow();
		});

		it('should call getIsAutonomicCapability', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerThinkPad.sectionSmartStandby,
				'getIsAutonomicCapability'
			).and.callThrough();
			powerService.getIsAutonomicCapability();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerThinkPad = false;
			powerService.getIsAutonomicCapability();

			expect(powerService.getIsAutonomicCapability).toThrow();
		});

		it('should call getSmartStandbyActiveStartEnd', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerThinkPad.sectionSmartStandby,
				'getSmartStandbyActiveStartEnd'
			).and.callThrough();
			powerService.getSmartStandbyActiveStartEnd();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerThinkPad = false;
			powerService.getSmartStandbyActiveStartEnd();

			expect(powerService.getSmartStandbyActiveStartEnd).toThrow();
		});

		it('should call startBatteryGaugeReset', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerThinkPad.sectionBatteryGaugeReset,
				'startBatteryGaugeReset'
			).and.callThrough();
			powerService.startBatteryGaugeReset();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerThinkPad = false;
			powerService.startBatteryGaugeReset();

			expect(powerService.startBatteryGaugeReset).toThrow();
		});

		it('should call getGaugeResetCapability', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerThinkPad.sectionBatteryGaugeReset,
				'getGaugeResetCapability'
			).and.callThrough();
			powerService.getGaugeResetCapability();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerThinkPad = false;
			powerService.getGaugeResetCapability();
		});

		it('should call stopBatteryGaugeReset', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerThinkPad.sectionBatteryGaugeReset,
				'stopBatteryGaugeReset'
			).and.callThrough();
			powerService.stopBatteryGaugeReset();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerThinkPad = false;
			powerService.stopBatteryGaugeReset();

			expect(powerService.stopBatteryGaugeReset).toThrow();
		});

		it('should call setSmartStandbyDaysOfWeekOff', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerThinkPad.sectionSmartStandby,
				'setSmartStandbyDaysOfWeekOff'
			).and.callThrough();
			powerService.setSmartStandbyDaysOfWeekOff();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerThinkPad = false;
			powerService.setSmartStandbyDaysOfWeekOff();

			expect(powerService.setSmartStandbyDaysOfWeekOff).toThrow();
		});

		it('should call setSmartStandbyActiveStartEnd', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerThinkPad.sectionSmartStandby,
				'setSmartStandbyActiveStartEnd'
			).and.callThrough();
			powerService.setSmartStandbyActiveStartEnd();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerThinkPad = false;
			powerService.setSmartStandbyActiveStartEnd();

			expect(powerService.setSmartStandbyActiveStartEnd).toThrow();
		});

		it('should call setSmartStandbyEnabled', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerThinkPad.sectionSmartStandby,
				'setSmartStandbyEnabled'
			).and.callThrough();
			powerService.setSmartStandbyEnabled();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerThinkPad = false;
			powerService.setSmartStandbyEnabled();

			expect(powerService.setSmartStandbyEnabled).toThrow();
		});

		it('should call getSmartStandbyDaysOfWeekOff', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerThinkPad.sectionSmartStandby,
				'getSmartStandbyDaysOfWeekOff'
			).and.callThrough();
			powerService.getSmartStandbyDaysOfWeekOff();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerThinkPad = false;
			powerService.getSmartStandbyDaysOfWeekOff();

			expect(powerService.getSmartStandbyDaysOfWeekOff).toThrow();
		});

		it('should call getSmartStandbyEnabled', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerThinkPad.sectionSmartStandby,
				'getSmartStandbyEnabled'
			).and.callThrough();
			powerService.getSmartStandbyEnabled();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerThinkPad = false;
			powerService.getSmartStandbyEnabled();

			expect(powerService.getSmartStandbyEnabled).toThrow();
		});

		it('should call getPMDriverStatus', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerItsIntelligentCooling.intelligentCooling,
				'getPMDriverStatus'
			).and.callThrough();
			powerService.getPMDriverStatus();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerItsIntelligentCooling = false;
			powerService.getPMDriverStatus();

			expect(powerService.getPMDriverStatus).toThrow();
		});

		it('should call getEMDriverStatus', () => {
			const { powerService } = setup();
			(powerService as any).devicePowerItsIntelligentCooling.intelligentCooling = {
				getEMDriverStatus:() => {},
			};

			const spy = spyOn(
				powerService.devicePowerItsIntelligentCooling.intelligentCooling,
				'getEMDriverStatus'
			).and.callThrough();
			powerService.getEMDriverStatus();
			expect(spy).toHaveBeenCalled();

			(powerService as any).devicePowerItsIntelligentCooling = undefined;
			const returnValue = powerService.getEMDriverStatus();
			expect(returnValue).toBe(undefined);

			expect(powerService.getEMDriverStatus).toThrow();
		});

		it('should call getITSServiceStatus', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerItsIntelligentCooling.intelligentCooling,
				'getITSServiceStatus'
			).and.callThrough();
			powerService.getITSServiceStatus();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerItsIntelligentCooling = false;
			powerService.getITSServiceStatus();

			expect(powerService.getITSServiceStatus).toThrow();
		});

		it('should call getDYTCRevision', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerItsIntelligentCooling.intelligentCooling,
				'getDYTCRevision'
			).and.callThrough();
			powerService.getDYTCRevision();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerItsIntelligentCooling = false;
			powerService.getDYTCRevision();

			expect(powerService.getDYTCRevision).toThrow();
		});

		it('should call getCQLCapability', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerItsIntelligentCooling.intelligentCooling,
				'getCQLCapability'
			).and.callThrough();
			powerService.getCQLCapability();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerItsIntelligentCooling = false;
			powerService.getCQLCapability();

			expect(powerService.getCQLCapability).toThrow();
		});

		it('should call getTIOCapability', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerItsIntelligentCooling.intelligentCooling,
				'getTIOCapability'
			).and.callThrough();
			powerService.getTIOCapability();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerItsIntelligentCooling = false;
			powerService.getTIOCapability();

			expect(powerService.getTIOCapability).toThrow();
		});

		it('should call setManualModeSetting', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerItsIntelligentCooling.intelligentCooling,
				'setManualModeSetting'
			).and.callThrough();
			powerService.setManualModeSetting();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerItsIntelligentCooling = false;
			powerService.setManualModeSetting();

			expect(powerService.setManualModeSetting).toThrow();
		});

		it('should call getManualModeSetting', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerItsIntelligentCooling.intelligentCooling,
				'getManualModeSetting'
			).and.callThrough();
			powerService.getManualModeSetting();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerItsIntelligentCooling = false;
			powerService.getManualModeSetting();

			expect(powerService.getManualModeSetting).toThrow();
		});

		it('should call getAPSState', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerItsIntelligentCooling.intelligentCooling,
				'getAPSState'
			).and.callThrough();
			powerService.getAPSState();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerItsIntelligentCooling = false;
			powerService.getAPSState();

			expect(powerService.getAPSState).toThrow();
		});

		it('should call getLegacyCQLCapability', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerItsIntelligentCooling.intelligentCooling,
				'getLegacyCQLCapability'
			).and.callThrough();
			powerService.getLegacyCQLCapability();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerItsIntelligentCooling = false;
			powerService.getLegacyCQLCapability();

			expect(powerService.getLegacyCQLCapability).toThrow();
		});

		it('should call getLegacyTIOCapability', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerItsIntelligentCooling.intelligentCooling,
				'getLegacyTIOCapability'
			).and.callThrough();
			powerService.getLegacyTIOCapability();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerItsIntelligentCooling = false;
			powerService.getLegacyTIOCapability();

			expect(powerService.getLegacyTIOCapability).toThrow();
		});

		it('should call getLegacyManualModeCapability', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerItsIntelligentCooling.intelligentCooling,
				'getLegacyManualModeCapability'
			).and.callThrough();
			powerService.getLegacyManualModeCapability();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerItsIntelligentCooling = false;
			powerService.getLegacyManualModeCapability();

			expect(powerService.getLegacyManualModeCapability).toThrow();
		});

		it('should call setLegacyAutoModeState', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerItsIntelligentCooling.intelligentCooling,
				'setLegacyAutoModeState'
			).and.callThrough();
			powerService.setLegacyAutoModeState();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerItsIntelligentCooling = false;
			powerService.setLegacyAutoModeState();

			expect(powerService.setLegacyAutoModeState).toThrow();
		});

		it('should call setLegacyManualModeState', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerItsIntelligentCooling.intelligentCooling,
				'setLegacyManualModeState'
			).and.callThrough();
			powerService.setLegacyManualModeState();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerItsIntelligentCooling = false;
			powerService.setLegacyManualModeState();

			expect(powerService.setLegacyManualModeState).toThrow();
		});

		it('should call getLegacyManualModeState', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerItsIntelligentCooling.intelligentCooling,
				'getLegacyManualModeState'
			).and.callThrough();
			powerService.getLegacyManualModeState();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerItsIntelligentCooling = false;
			powerService.getLegacyManualModeState();

			expect(powerService.getLegacyManualModeState).toThrow();
		});

		it('should call setAutoModeSetting', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerItsIntelligentCooling.intelligentCooling,
				'setAutoModeSetting'
			).and.callThrough();
			powerService.setAutoModeSetting(true);
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerItsIntelligentCooling = false;
			powerService.setAutoModeSetting();

			expect(powerService.setAutoModeSetting).toThrow();
		});

		it('should call getUSBChargingInBatteryModeStatusIdeaNoteBook', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerIdeaNoteBook.alwaysOnUSB,
				'getUSBChargingInBatteryModeStatus'
			).and.callThrough();
			powerService.getUSBChargingInBatteryModeStatusIdeaNoteBook();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerIdeaNoteBook = false;
			powerService.getUSBChargingInBatteryModeStatusIdeaNoteBook();

			expect(powerService.getUSBChargingInBatteryModeStatusIdeaNoteBook).toThrow();
		});

		it('should call setAlwaysOnUSBStatusIdeaNoteBook', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerIdeaNoteBook.alwaysOnUSB,
				'setAlwaysOnUSBStatus'
			).and.callThrough();
			powerService.setAlwaysOnUSBStatusIdeaNoteBook();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerIdeaNoteBook = false;
			powerService.setAlwaysOnUSBStatusIdeaNoteBook();

			expect(powerService.setAlwaysOnUSBStatusIdeaNoteBook).toThrow();
		});

		it('should call setUSBChargingInBatteryModeStatusIdeaNoteBook', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerIdeaNoteBook.alwaysOnUSB,
				'setUSBChargingInBatteryModeStatus'
			).and.callThrough();
			powerService.setUSBChargingInBatteryModeStatusIdeaNoteBook();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerIdeaNoteBook = false;
			powerService.setUSBChargingInBatteryModeStatusIdeaNoteBook();

			expect(powerService.setUSBChargingInBatteryModeStatusIdeaNoteBook).toThrow();
		});

		it('should call getConservationModeStatusIdeaNoteBook', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerIdeaNoteBook.conservationMode,
				'getConservationModeStatus'
			).and.callThrough();
			powerService.getConservationModeStatusIdeaNoteBook();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerIdeaNoteBook = false;
			powerService.getConservationModeStatusIdeaNoteBook();

			expect(powerService.getConservationModeStatusIdeaNoteBook).toThrow();
		});

		it('should call setConservationModeStatusIdeaNoteBook', () => {
			const { powerService } = setup();
			const spy = spyOn(
				powerService.devicePowerIdeaNoteBook.conservationMode,
				'setConservationModeStatus'
			).and.callThrough();
			powerService.setConservationModeStatusIdeaNoteBook();
			expect(spy).toHaveBeenCalled();
			powerService.devicePowerIdeaNoteBook = false;
			powerService.setConservationModeStatusIdeaNoteBook();

			expect(powerService.setConservationModeStatusIdeaNoteBook).toThrow();
		});
	});
});
