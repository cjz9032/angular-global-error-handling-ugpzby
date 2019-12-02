import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA,Pipe} from '@angular/core';
import { TranslateStore } from '@ngx-translate/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { PowerService } from './power.service';
import { VantageShellService } from '../vantage-shell/vantage-shell-mock.service';
describe('PowerService', () => {
    let shellService: VantageShellService;
    const batteryThresholdInfo: any = [
        {
            batteryNumber: 1,
            checkBoxValue: false,
            isCapable: true,
            isOn: false,
            startValue: 75,
            stopValue: 80
        },
        {
            batteryNumber: 2,
            checkBoxValue: false,
            isCapable: true,
            isOn: false,
            startValue: 75,
            stopValue: 80
        }
    ];
    beforeEach(() => TestBed.configureTestingModule({
		providers: [PowerService,VantageShellService, TranslateStore],
        imports: [TranslationModule.forChild()]
       
	}));
    describe(':', () => {
        function setup() {
            const powerService = TestBed.get(PowerService);
            const shellService = TestBed.get(VantageShellService);
			return { powerService,shellService };
		}
        it('should be created', () => {
            const {powerService} = setup();	
            expect(powerService).toBeTruthy();
          });
          it('should call getLegacyAutoModeState', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerItsIntelligentCooling.intelligentCooling,'getLegacyAutoModeState').and.callThrough();
                powerService.getLegacyAutoModeState();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerItsIntelligentCooling=false
                powerService.getLegacyAutoModeState()
            });
            it('should call getITSModeForICIdeapad', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerIdeaNoteBook.intelligentCoolingForIdeaPad,'getITSSettings').and.callThrough();
                powerService.getITSModeForICIdeapad();
                myobj.call(powerService.devicePowerIdeaNoteBook.intelligentCoolingForIdeaPad.getITSSettings);
            });
            it('should call setITSModeForICIdeapad', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerIdeaNoteBook.intelligentCoolingForIdeaPad,'setITSSettings').and.callThrough();
                powerService.setITSModeForICIdeapad();
                myobj.call(powerService.devicePowerIdeaNoteBook.intelligentCoolingForIdeaPad.setITSSettings);
            });
            it('should call startMonitorForICIdeapad', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerIdeaNoteBook.intelligentCoolingForIdeaPad,'startMonitor').and.callThrough();
                powerService.startMonitorForICIdeapad();
                myobj.call(powerService.devicePowerIdeaNoteBook.intelligentCoolingForIdeaPad.startMonitor);
            });
            it('should call stopMonitorForICIdeapad', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerIdeaNoteBook.intelligentCoolingForIdeaPad,'stopMonitor').and.callThrough();
                powerService.stopMonitorForICIdeapad();
                myobj.call(powerService.devicePowerIdeaNoteBook.intelligentCoolingForIdeaPad.stopMonitor);
            });
          it('should call stopMonitor', () => {
            const { powerService } = setup();
            spyOn(powerService.devicePower,'stopMonitor').and.callThrough();
            powerService.stopMonitor();
            expect(powerService.devicePower.stopMonitor).toHaveBeenCalled();   
            });
            it('should call getAlwaysOnUSBStatusIdeaNoteBook', () => {
                const { powerService } = setup();
               var myobj= spyOn(powerService.devicePowerIdeaNoteBook.alwaysOnUSB,'getUSBChargingInBatteryModeStatus').and.callThrough();
                powerService.getAlwaysOnUSBStatusIdeaNoteBook();
                powerService.devicePowerIdeaNoteBook.alwaysOnUSB.getUSBChargingInBatteryModeStatus();
                powerService.devicePowerIdeaNoteBook = false;
                powerService.getAlwaysOnUSBStatusIdeaNoteBook();
            });
            it('should call getRapidChargeModeStatusIdeaNoteBook', () => {
                const { powerService } = setup();
               var myobj= spyOn(powerService.devicePowerIdeaNoteBook.rapidChargeMode,'getRapidChargeModeStatus').and.callThrough();
                powerService.getRapidChargeModeStatusIdeaNoteBook();
                expect(myobj).toHaveBeenCalled();
                powerService.devicePowerIdeaNoteBook = false;
                powerService.getRapidChargeModeStatusIdeaNoteBook();
            });
            it('should call setRapidChargeModeStatusIdeaNoteBook', () => {
                const { powerService } = setup();
               var myobj= spyOn(powerService.devicePowerIdeaNoteBook.rapidChargeMode,'setRapidChargeModeStatus').and.callThrough();
                powerService.setRapidChargeModeStatusIdeaNoteBook();
                expect(myobj).toHaveBeenCalled();
                powerService.devicePowerIdeaNoteBook = false;
                powerService.setRapidChargeModeStatusIdeaNoteBook();
            });
            it('should call getFlipToBootCapability', () => {
                const { powerService } = setup();
               var myobj= spyOn(powerService.devicePowerIdeaNoteBook.flipToBoot,'getFlipToBootCapability').and.callThrough();
                powerService.getFlipToBootCapability();
                expect(myobj).toHaveBeenCalled();
                powerService.devicePowerIdeaNoteBook = false;
                powerService.getFlipToBootCapability();

            });
            it('should call setFlipToBootSettings', () => {
                const { powerService } = setup();
               var myobj= spyOn(powerService.devicePowerIdeaNoteBook.flipToBoot,'setFlipToBootSettings').and.callThrough();
                powerService.setFlipToBootSettings();
                expect(myobj).toHaveBeenCalled();
                powerService.devicePowerIdeaNoteBook = false;
                powerService.setFlipToBootSettings();
            });
            it('should call getEasyResumeCapabilityThinkPad', () => {
                const { powerService } = setup();
               var myobj= spyOn(powerService.devicePowerThinkPad.sectionEasyResume,'getEasyResumeCapability').and.callThrough();
                powerService.getEasyResumeCapabilityThinkPad();
                expect(myobj).toHaveBeenCalled();
                powerService.devicePowerThinkPad=false
                powerService.getEasyResumeCapabilityThinkPad();

            });
            it('should call getAlwaysOnUSBCapabilityThinkPad', () => {
                const { powerService } = setup();
               var myobj= spyOn(powerService.devicePowerThinkPad.sectionAlwaysOnUsb,'getAlwaysOnUsbCapability').and.callThrough();
                powerService.getAlwaysOnUSBCapabilityThinkPad();
                expect(myobj).toHaveBeenCalled();
                powerService.devicePowerThinkPad=false;
                powerService.getAlwaysOnUSBCapabilityThinkPad();

            });
            it('should call getAlwaysOnUSBStatusThinkPad', () => {
                const { powerService } = setup();
               var myobj= spyOn(powerService.devicePowerThinkPad.sectionAlwaysOnUsb,'getAlwaysOnUsb').and.callThrough();
                powerService.getAlwaysOnUSBStatusThinkPad();
                expect(myobj).toHaveBeenCalled();
                powerService.devicePowerThinkPad=false;
                powerService.getAlwaysOnUSBStatusThinkPad();
            });
            it('should call setAlwaysOnUSBStatusThinkPad', () => {
                const { powerService } = setup();
               var myobj= spyOn(powerService.devicePowerThinkPad.sectionAlwaysOnUsb,'setAlwaysOnUsb').and.callThrough();
                powerService.setAlwaysOnUSBStatusThinkPad();
                expect(myobj).toHaveBeenCalled();
                powerService.devicePowerThinkPad=false;
                powerService.setAlwaysOnUSBStatusThinkPad();
            });
            it('should call getAirplaneModeCapabilityThinkPad', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerThinkPad.sectionAirplaneMode,'getAirplaneModeCapability').and.callThrough();
                powerService.getAirplaneModeCapabilityThinkPad();
                expect(myobj).toHaveBeenCalled();
                powerService.devicePowerThinkPad=false
                powerService.getAirplaneModeCapabilityThinkPad();
            });
            it('should call getAirplaneModeThinkPad', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerThinkPad.sectionAirplaneMode,'getAirplaneMode').and.callThrough();
                powerService.getAirplaneModeThinkPad();
                expect(myobj).toHaveBeenCalled();
                powerService.devicePowerThinkPad=false
                powerService.getAirplaneModeThinkPad();
            });
            it('should call setAirplaneModeThinkPad', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerThinkPad.sectionAirplaneMode,'setAirplaneMode').and.callThrough();
                powerService.setAirplaneModeThinkPad();
                expect(myobj).toHaveBeenCalled();
                powerService.devicePowerThinkPad=false
                powerService.setAirplaneModeThinkPad();
            });
            it('should call setAirplaneModeAutoDetectionOnThinkPad', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerThinkPad.sectionAirplaneMode,'setAirplaneModeAutoDetection').and.callThrough();
                powerService.setAirplaneModeAutoDetectionOnThinkPad();
                expect(myobj).toHaveBeenCalled();
                powerService.devicePowerThinkPad=false
                powerService.setAirplaneModeAutoDetectionOnThinkPad();
            });
            it('should call getAirplaneModeAutoDetectionOnThinkPad', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerThinkPad.sectionAirplaneMode,'getAirplaneModeAutoDetection').and.callThrough();
                powerService.getAirplaneModeAutoDetectionOnThinkPad();
                expect(myobj).toHaveBeenCalled();
                powerService.devicePowerThinkPad=false
                powerService.getAirplaneModeAutoDetectionOnThinkPad();
            });

            it('should call getVantageToolBarStatus', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePower,'getVantageToolBarStatus').and.callThrough();
                powerService.getVantageToolBarStatus();
                expect(myobj).toHaveBeenCalled();
                powerService.devicePower=false;
                powerService.getVantageToolBarStatus();

            });
            it('should call setVantageToolBarStatus', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePower,'setVantageToolBarStatus').and.callThrough();
                powerService.setVantageToolBarStatus();
                expect(myobj).toHaveBeenCalled();
                powerService.devicePower=false;
                powerService.setVantageToolBarStatus();
            });
            it('should call startMonitor', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePower,'startMonitor').and.callThrough();
                powerService.startMonitor();
                expect(myobj).toHaveBeenCalled();
            });
            it('should call getChargeThresholdInfo', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerThinkPad.sectionChargeThreshold,'getChargeThresholdInfo').and.callThrough();
                powerService.getChargeThresholdInfo();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerThinkPad=false
                powerService.getChargeThresholdInfo();
            });
            
            it('should call getEasyResumeStatusThinkPad', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerThinkPad.sectionEasyResume,'getEasyResume').and.callThrough();
                powerService.getEasyResumeStatusThinkPad();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerThinkPad=false
                powerService.getEasyResumeStatusThinkPad();
            });
            it('should call setEasyResumeThinkPad', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerThinkPad.sectionEasyResume,'setEasyResume').and.callThrough();
                powerService.setEasyResumeThinkPad();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerThinkPad=false
                powerService.setEasyResumeThinkPad();
            });
            it('should call setChargeThresholdValue', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerThinkPad.sectionChargeThreshold,'setChargeThresholdValue').and.callThrough();
                powerService.setChargeThresholdValue(batteryThresholdInfo);
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerThinkPad=false
                powerService.setChargeThresholdValue(batteryThresholdInfo);
            });
            it('should call setCtAutoCheckbox', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerThinkPad.sectionChargeThreshold,'setCtAutoCheckbox').and.callThrough();
                powerService.setCtAutoCheckbox(batteryThresholdInfo);
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerThinkPad=false
                powerService.setCtAutoCheckbox(batteryThresholdInfo);
            });
            it('should call setToggleOff', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerThinkPad.sectionChargeThreshold,'setToggleOff').and.callThrough();
                powerService.setToggleOff();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerThinkPad=false
                powerService.setToggleOff();
            });
            it('should call getEnergyStarCapability', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.imcHelper,'getIsEnergyStarCapability').and.callThrough();
                powerService.getEnergyStarCapability();
                expect(myobj).toHaveBeenCalled()
                powerService.isShellAvailable=false
                powerService.getEnergyStarCapability();
            });
            it('should call getSmartStandbyCapability', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerThinkPad.sectionSmartStandby,'getSmartStandbyCapability').and.callThrough();
                powerService.getSmartStandbyCapability();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerThinkPad=false
                powerService.getSmartStandbyCapability();
            });
            it('should call getSmartStandbyIsAutonomic', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerThinkPad.sectionSmartStandby,'getSmartStandbyIsAutonomic').and.callThrough();
                powerService.getSmartStandbyIsAutonomic();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerThinkPad=false
                powerService.getSmartStandbyIsAutonomic();
            });
            it('should call GetSmartStandbyActiveHours', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerThinkPad.sectionSmartStandby,'getSmartStandbyActiveHours').and.callThrough();
                powerService.GetSmartStandbyActiveHours();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerThinkPad=false
                powerService.GetSmartStandbyActiveHours();
            });
            it('should call getSmartStandbyPresenceData', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerThinkPad.sectionSmartStandby,'getSmartStandbyPresenceData').and.callThrough();
                powerService.getSmartStandbyPresenceData();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerThinkPad=false
                powerService.getSmartStandbyPresenceData();
            });
            it('should call setSmartStandbyIsAutonomic', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerThinkPad.sectionSmartStandby,'setSmartStandbyIsAutonomic').and.callThrough();
                powerService.setSmartStandbyIsAutonomic();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerThinkPad=false
                powerService.setSmartStandbyIsAutonomic();
            });
            it('should call getIsAutonomicCapability', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerThinkPad.sectionSmartStandby,'getIsAutonomicCapability').and.callThrough();
                powerService.getIsAutonomicCapability();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerThinkPad=false
                powerService.getIsAutonomicCapability();
            });
            it('should call getSmartStandbyActiveStartEnd', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerThinkPad.sectionSmartStandby,'getSmartStandbyActiveStartEnd').and.callThrough();
                powerService.getSmartStandbyActiveStartEnd();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerThinkPad=false
                powerService.getSmartStandbyActiveStartEnd();
            });
            it('should call startBatteryGaugeReset', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerThinkPad.sectionBatteryGaugeReset,'startBatteryGaugeReset').and.callThrough();
                powerService.startBatteryGaugeReset();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerThinkPad=false
                powerService.startBatteryGaugeReset();
            });
            it('should call getGaugeResetCapability', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerThinkPad.sectionBatteryGaugeReset,'getGaugeResetCapability').and.callThrough();
                powerService.getGaugeResetCapability();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerThinkPad=false
                powerService.getGaugeResetCapability();
            });
            it('should call stopBatteryGaugeReset', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerThinkPad.sectionBatteryGaugeReset,'stopBatteryGaugeReset').and.callThrough();
                powerService.stopBatteryGaugeReset();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerThinkPad=false
                powerService.stopBatteryGaugeReset();
            });
            it('should call setSmartStandbyDaysOfWeekOff', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerThinkPad.sectionSmartStandby,'setSmartStandbyDaysOfWeekOff').and.callThrough();
                powerService.setSmartStandbyDaysOfWeekOff();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerThinkPad=false
                powerService.setSmartStandbyDaysOfWeekOff();
            });
            it('should call setSmartStandbyActiveStartEnd', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerThinkPad.sectionSmartStandby,'setSmartStandbyActiveStartEnd').and.callThrough();
                powerService.setSmartStandbyActiveStartEnd();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerThinkPad=false
                powerService.setSmartStandbyActiveStartEnd();
            });
            it('should call setSmartStandbyEnabled', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerThinkPad.sectionSmartStandby,'setSmartStandbyEnabled').and.callThrough();
                powerService.setSmartStandbyEnabled();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerThinkPad=false
                powerService.setSmartStandbyEnabled();
            });
            it('should call getSmartStandbyDaysOfWeekOff', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerThinkPad.sectionSmartStandby,'getSmartStandbyDaysOfWeekOff').and.callThrough();
                powerService.getSmartStandbyDaysOfWeekOff();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerThinkPad=false
                powerService.getSmartStandbyDaysOfWeekOff();
            });
            it('should call getSmartStandbyEnabled', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerThinkPad.sectionSmartStandby,'getSmartStandbyEnabled').and.callThrough();
                powerService.getSmartStandbyEnabled();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerThinkPad=false
                powerService.getSmartStandbyEnabled();
            });
            it('should call getPMDriverStatus', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerItsIntelligentCooling.intelligentCooling,'getPMDriverStatus').and.callThrough();
                powerService.getPMDriverStatus();
                expect(myobj).toHaveBeenCalled();
                powerService.devicePowerItsIntelligentCooling=false
                powerService.getPMDriverStatus();
            });
            it('should call getITSServiceStatus', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerItsIntelligentCooling.intelligentCooling,'getITSServiceStatus').and.callThrough();
                powerService.getITSServiceStatus();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerItsIntelligentCooling=false
                powerService.getITSServiceStatus();
            });
            it('should call getDYTCRevision', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerItsIntelligentCooling.intelligentCooling,'getDYTCRevision').and.callThrough();
                powerService.getDYTCRevision();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerItsIntelligentCooling=false
                powerService.getDYTCRevision();
            });
            it('should call getCQLCapability', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerItsIntelligentCooling.intelligentCooling,'getCQLCapability').and.callThrough();
                powerService.getCQLCapability();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerItsIntelligentCooling=false
                powerService.getCQLCapability();
            });
            it('should call getTIOCapability', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerItsIntelligentCooling.intelligentCooling,'getTIOCapability').and.callThrough();
                powerService.getTIOCapability();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerItsIntelligentCooling=false
                powerService.getTIOCapability();
            });
            it('should call setManualModeSetting', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerItsIntelligentCooling.intelligentCooling,'setManualModeSetting').and.callThrough();
                powerService.setManualModeSetting();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerItsIntelligentCooling=false
                powerService.setManualModeSetting();
            });
            it('should call getManualModeSetting', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerItsIntelligentCooling.intelligentCooling,'getManualModeSetting').and.callThrough();
                powerService.getManualModeSetting();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerItsIntelligentCooling=false
                powerService.getManualModeSetting();
            });
            it('should call getAPSState', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerItsIntelligentCooling.intelligentCooling,'getAPSState').and.callThrough();
                powerService.getAPSState();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerItsIntelligentCooling=false
                powerService.getAPSState();
            });
            it('should call getLegacyCQLCapability', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerItsIntelligentCooling.intelligentCooling,'getLegacyCQLCapability').and.callThrough();
                powerService.getLegacyCQLCapability();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerItsIntelligentCooling=false
                powerService.getLegacyCQLCapability();
            });
            it('should call getLegacyTIOCapability', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerItsIntelligentCooling.intelligentCooling,'getLegacyTIOCapability').and.callThrough();
                powerService.getLegacyTIOCapability();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerItsIntelligentCooling=false
                powerService.getLegacyTIOCapability();
            });
            it('should call getLegacyManualModeCapability', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerItsIntelligentCooling.intelligentCooling,'getLegacyManualModeCapability').and.callThrough();
                powerService.getLegacyManualModeCapability();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerItsIntelligentCooling=false
                powerService.getLegacyManualModeCapability();
            });
            
            it('should call setLegacyAutoModeState', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerItsIntelligentCooling.intelligentCooling,'setLegacyAutoModeState').and.callThrough();
                powerService.setLegacyAutoModeState();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerItsIntelligentCooling=false
                powerService.setLegacyAutoModeState();
            });
            it('should call setLegacyManualModeState', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerItsIntelligentCooling.intelligentCooling,'setLegacyManualModeState').and.callThrough();
                powerService.setLegacyManualModeState();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerItsIntelligentCooling=false
                powerService.setLegacyManualModeState();
            });
            
            it('should call getLegacyManualModeState', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerItsIntelligentCooling.intelligentCooling,'getLegacyManualModeState').and.callThrough();
                powerService.getLegacyManualModeState();
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerItsIntelligentCooling=false
                powerService.getLegacyManualModeState();
            });
            it('should call setAutoModeSetting', () => {
                const { powerService } = setup();
                var myobj=spyOn(powerService.devicePowerItsIntelligentCooling.intelligentCooling,'setAutoModeSetting').and.callThrough();
                powerService.setAutoModeSetting(true);
                expect(myobj).toHaveBeenCalled()
                powerService.devicePowerItsIntelligentCooling=false
                powerService.setAutoModeSetting();
            });

                it('should call getUSBChargingInBatteryModeStatusIdeaNoteBook', () => {
                    const { powerService } = setup();
                    var myobj=spyOn(powerService.devicePowerIdeaNoteBook.alwaysOnUSB,'getUSBChargingInBatteryModeStatus').and.callThrough();
                    powerService.getUSBChargingInBatteryModeStatusIdeaNoteBook();
                    expect(myobj).toHaveBeenCalled();
                    powerService.devicePowerIdeaNoteBook=false;
                    powerService.getUSBChargingInBatteryModeStatusIdeaNoteBook();
                    });
                    it('should call setAlwaysOnUSBStatusIdeaNoteBook', () => {
                        const { powerService } = setup();
                        var myobj=spyOn(powerService.devicePowerIdeaNoteBook.alwaysOnUSB,'setAlwaysOnUSBStatus').and.callThrough();
                        powerService.setAlwaysOnUSBStatusIdeaNoteBook();
                        expect(myobj).toHaveBeenCalled();
                        powerService.devicePowerIdeaNoteBook=false;
                        powerService.setAlwaysOnUSBStatusIdeaNoteBook();
                        });
                        it('should call setUSBChargingInBatteryModeStatusIdeaNoteBook', () => {
                            const { powerService } = setup();
                            var myobj=spyOn(powerService.devicePowerIdeaNoteBook.alwaysOnUSB,'setUSBChargingInBatteryModeStatus').and.callThrough();
                            powerService.setUSBChargingInBatteryModeStatusIdeaNoteBook();
                            expect(myobj).toHaveBeenCalled();
                            powerService.devicePowerIdeaNoteBook=false;
                            powerService.setUSBChargingInBatteryModeStatusIdeaNoteBook();
                            });
                    it('should call getConservationModeStatusIdeaNoteBook', () => {
                        const { powerService } = setup();
                        var myobj=spyOn(powerService.devicePowerIdeaNoteBook.conservationMode,'getConservationModeStatus').and.callThrough();
                        powerService.getConservationModeStatusIdeaNoteBook();
                        expect(myobj).toHaveBeenCalled();
                        powerService.devicePowerIdeaNoteBook=false;
                        powerService.getConservationModeStatusIdeaNoteBook();
                        });    
                        it('should call setConservationModeStatusIdeaNoteBook', () => {
                            const { powerService } = setup();
                            var myobj=spyOn(powerService.devicePowerIdeaNoteBook.conservationMode,'setConservationModeStatus').and.callThrough();
                            powerService.setConservationModeStatusIdeaNoteBook();
                            expect(myobj).toHaveBeenCalled();
                            powerService.devicePowerIdeaNoteBook=false;
                            powerService.setConservationModeStatusIdeaNoteBook();
                            });  
    });
});
