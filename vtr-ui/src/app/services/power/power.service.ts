import { Injectable } from '@angular/core';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { ChargeThreshold } from 'src/app/data-models/device/charge-threshold.model';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import {
	FlipToStartErrorStatusInterface,
	FlipToStartInterface,
	FlipToStartSetStatus,
} from './flip-to-start.interface';
import { ConservationModeStatus } from 'src/app/data-models/battery/conservation-mode-response.model';
@Injectable({
	providedIn: 'root',
})
export class PowerService {
	isShellAvailable = false;
	intelligentCoolingForIdeaPad: any;
	private devicePower: any;
	private devicePowerIdeaNoteBook: any;
	private devicePowerThinkPad: any;
	private imcHelper: any;
	private devicePowerItsIntelligentCooling: any;

	constructor(shellService: VantageShellService) {
		this.devicePower = shellService.getVantageToolBar();
		if (this.devicePower) {
			this.isShellAvailable = true;
		}
		this.devicePowerIdeaNoteBook = shellService.getPowerIdeaNoteBook();
		if (this.devicePowerIdeaNoteBook) {
			this.isShellAvailable = true;
		}
		this.devicePowerThinkPad = shellService.getPowerThinkPad();
		if (this.devicePowerThinkPad) {
			this.isShellAvailable = true;
		}
		this.devicePowerItsIntelligentCooling = shellService.getPowerItsIntelligentCooling();
		if (this.devicePowerItsIntelligentCooling) {
			this.isShellAvailable = true;
		}
		this.intelligentCoolingForIdeaPad = shellService.getIntelligentCoolingForIdeaPad();
		if (this.intelligentCoolingForIdeaPad) {
			this.isShellAvailable = true;
		}

		this.imcHelper = shellService.getImcHelper();
	}
	// Start AlwaysOn USB ThinkPad
	getAlwaysOnUSBCapabilityThinkPad(): Promise<boolean> {
		try {
			if (this.devicePowerThinkPad) {
				return this.devicePowerThinkPad.sectionAlwaysOnUsb.getAlwaysOnUsbCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	getAlwaysOnUSBStatusThinkPad(): Promise<any> {
		if (this.devicePowerThinkPad) {
			return this.devicePowerThinkPad.sectionAlwaysOnUsb.getAlwaysOnUsb();
		}
		return undefined;
	}
	setAlwaysOnUSBStatusThinkPad(value: string, check: boolean): Promise<boolean> {
		try {
			if (this.devicePowerThinkPad) {
				return this.devicePowerThinkPad.sectionAlwaysOnUsb.setAlwaysOnUsb(value, check);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	// End AlwaysOn USB ThinkPad
	// Start AlwaysOn USB IdeaNoteBook
	getAlwaysOnUSBStatusIdeaNoteBook(): Promise<FeatureStatus> {
		if (this.devicePowerIdeaNoteBook) {
			return this.devicePowerIdeaNoteBook.alwaysOnUSB.getAlwaysOnUSBStatus();
		}
		return undefined;
	}
	setAlwaysOnUSBStatusIdeaNoteBook(value: boolean): Promise<boolean> {
		try {
			if (this.devicePowerIdeaNoteBook) {
				return this.devicePowerIdeaNoteBook.alwaysOnUSB.setAlwaysOnUSBStatus(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	getUSBChargingInBatteryModeStatusIdeaNoteBook(): Promise<FeatureStatus> {
		if (this.devicePowerIdeaNoteBook) {
			return this.devicePowerIdeaNoteBook.alwaysOnUSB.getUSBChargingInBatteryModeStatus();
		}
		return undefined;
	}
	setUSBChargingInBatteryModeStatusIdeaNoteBook(value: boolean): Promise<boolean> {
		try {
			if (this.devicePowerIdeaNoteBook) {
				return this.devicePowerIdeaNoteBook.alwaysOnUSB.setUSBChargingInBatteryModeStatus(
					value
				);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	// End AlwaysOn USB IdeaNoteBook
	// Conservation mode for IdeaNotebook
	getConservationModeStatusIdeaNoteBook(): Promise<ConservationModeStatus> {
		if (this.devicePowerIdeaNoteBook) {
			return this.devicePowerIdeaNoteBook.conservationMode.getConservationModeStatus();
		}
		return undefined;
	}
	setConservationModeStatusIdeaNoteBook(value: boolean): Promise<boolean> {
		try {
			if (this.devicePowerIdeaNoteBook) {
				return this.devicePowerIdeaNoteBook.conservationMode.setConservationModeStatus(
					value
				);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	// End Conservation mode for IdeaNoteBook
	// Express/Rapid Charging mode for IdeaNotebook
	getRapidChargeModeStatusIdeaNoteBook(): Promise<FeatureStatus> {
		try {
			if (this.devicePowerIdeaNoteBook) {
				return this.devicePowerIdeaNoteBook.rapidChargeMode.getRapidChargeModeStatus();
			}
			return undefined;
		} catch (err) {
			throw err;
		}
	}
	setRapidChargeModeStatusIdeaNoteBook(value: boolean): Promise<boolean> {
		try {
			if (this.devicePowerIdeaNoteBook) {
				return this.devicePowerIdeaNoteBook.rapidChargeMode.setRapidChargeModeStatus(value);
			}
			return undefined;
		} catch (error) {
			throw error;
		}
	}

	getFlipToStartCapability(): Promise<FlipToStartInterface> {
		if (this.devicePowerIdeaNoteBook) {
			return this.devicePowerIdeaNoteBook.flipToBoot.getFlipToBootCapability();
		}
		return undefined;
	}

	setFlipToStartSettings(
		status: FlipToStartSetStatus
	): Promise<FlipToStartErrorStatusInterface> {
		if (this.devicePowerIdeaNoteBook) {
			return this.devicePowerIdeaNoteBook.flipToBoot.setFlipToBootSettings(status);
		}
		return undefined;
	}

	// End Express/Rapid Charging mode for IdeaNoteBook
	// Start Easy Resume for ThinkPad
	getEasyResumeCapabilityThinkPad(): Promise<boolean> {
		if (this.devicePowerThinkPad) {
			return this.devicePowerThinkPad.sectionEasyResume.getEasyResumeCapability();
		}
		return undefined;
	}
	getEasyResumeStatusThinkPad(): Promise<any> {
		if (this.devicePowerThinkPad) {
			return this.devicePowerThinkPad.sectionEasyResume.getEasyResume();
		}
		return undefined;
	}
	setEasyResumeThinkPad(value: boolean): Promise<boolean> {
		try {
			if (this.devicePowerThinkPad) {
				return this.devicePowerThinkPad.sectionEasyResume.setEasyResume(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	// End Easy Resume for ThinkPad
	// Airplane Power mode Ideapad
	getAirplaneModeCapabilityThinkPad(): Promise<boolean> {
		if (this.devicePowerThinkPad) {
			return this.devicePowerThinkPad.sectionAirplaneMode.getAirplaneModeCapability();
		}
		return undefined;
	}
	getAirplaneModeThinkPad(): Promise<boolean> {
		if (this.devicePowerThinkPad) {
			return this.devicePowerThinkPad.sectionAirplaneMode.getAirplaneMode();
		}
		return undefined;
	}
	setAirplaneModeThinkPad(value: boolean): Promise<boolean> {
		try {
			if (this.devicePowerThinkPad) {
				return this.devicePowerThinkPad.sectionAirplaneMode.setAirplaneMode(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setAirplaneModeAutoDetectionOnThinkPad(value: boolean): Promise<boolean> {
		try {
			if (this.devicePowerThinkPad) {
				return this.devicePowerThinkPad.sectionAirplaneMode.setAirplaneModeAutoDetection(
					value
				);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getAirplaneModeAutoDetectionOnThinkPad(): Promise<boolean> {
		if (this.devicePowerThinkPad) {
			return this.devicePowerThinkPad.sectionAirplaneMode.getAirplaneModeAutoDetection();
		}
		return undefined;
	}
	// End Airplane Power mode thinkpad
	// Start Vantage ToolBar
	getVantageToolBarStatus(): Promise<FeatureStatus> {
		if (this.devicePower) {
			return this.devicePower.getVantageToolBarStatus();
		}
		return undefined;
	}
	setVantageToolBarStatus(value: boolean): Promise<boolean> {
		try {
			if (this.devicePower) {
				return this.devicePower.setVantageToolBarStatus(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	startMonitor(handler: any): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.devicePower.startMonitor(handler);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	stopMonitor() {
		if (this.isShellAvailable) {
			this.devicePower.stopMonitor((response: boolean) => {
				// this.commonService.sendNotification(DeviceMonitorStatus.MicrophoneStatus, response);
			});
		}
	}
	// End Vantage ToolBar

	// Power smart settings
	// ----------start ITC Capable
	getPMDriverStatus(): Promise<boolean> {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.getPMDriverStatus();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getEMDriverStatus(): Promise<boolean> {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.getEMDriverStatus();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getITSServiceStatus(): Promise<boolean> {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.getITSServiceStatus();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getDYTCRevision(): Promise<number> {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.getDYTCRevision();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	getCQLCapability(): Promise<boolean> {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.getCQLCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	getTIOCapability(): Promise<boolean> {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.getTIOCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	setAutoModeSetting(value: boolean): Promise<boolean> {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.setAutoModeSetting(
					value
				);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	setManualModeSetting(value: string): Promise<boolean> {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.setManualModeSetting(
					value
				);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	getManualModeSetting(): Promise<string> {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.getManualModeSetting();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	// ----------End ITC Capable
	// ----------Start Legacy Capable
	getAPSState(): Promise<boolean> {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.getAPSState();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getLegacyCQLCapability(): Promise<boolean> {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.getLegacyCQLCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getLegacyTIOCapability(): Promise<number> {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.getLegacyTIOCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getLegacyManualModeCapability(): Promise<boolean> {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.getLegacyManualModeCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getLegacyAutoModeState(): Promise<boolean> {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.getLegacyAutoModeState();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getLegacyManualModeState(): Promise<boolean> {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.getLegacyManualModeState();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setLegacyAutoModeState(value: boolean) {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.setLegacyAutoModeState(
					value
				);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setLegacyManualModeState(value: boolean) {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.setLegacyManualModeState(
					value
				);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	// ---------- End Legacy Capable

	// -------------Start IdeaPad
	getITSModeForICIdeapad() {
		try {
			if (this.intelligentCoolingForIdeaPad) {
				return this.intelligentCoolingForIdeaPad.getITSSettings();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setITSModeForICIdeapad(mode: string) {
		try {
			if (this.intelligentCoolingForIdeaPad) {
				return this.intelligentCoolingForIdeaPad.setITSSettings(mode);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	startMonitorForICIdeapad(handler: any) {
		try {
			if (this.intelligentCoolingForIdeaPad) {
				return this.intelligentCoolingForIdeaPad.startMonitor(handler);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	stopMonitorForICIdeapad() {
		try {
			if (this.intelligentCoolingForIdeaPad) {
				return this.intelligentCoolingForIdeaPad.stopMonitor();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setAutoTransitionForICIdeapad(mode: boolean) {
		if (this.intelligentCoolingForIdeaPad) {
			return this.intelligentCoolingForIdeaPad.setITSAutoTransitionSettings(mode);
		}
		return undefined;
	}
	// -------------End IdeaPad
	// ------------- Start DYTC 6.0 -------------------

	getAMTCapability(): Promise<boolean> {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.getAMTCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getAMTSetting(): Promise<boolean> {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.getAMTSetting();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	isMobileWorkStation(): Promise<boolean> {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.isMobileWorkStation();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	// ------------- End DYTC 6.0 -------------------

	// End Power smart settings

	// ---------- start battery threshold settings

	getChargeThresholdInfo(): Promise<any> {
		try {
			if (this.devicePowerThinkPad) {
				return this.devicePowerThinkPad.sectionChargeThreshold.getChargeThresholdInfo();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setChargeThresholdValue(value: ChargeThreshold): Promise<any> {
		try {
			if (this.devicePowerThinkPad) {
				return this.devicePowerThinkPad.sectionChargeThreshold.setChargeThresholdValue(
					value.batteryNum,
					value.startValue,
					value.stopValue,
					value.checkboxValue
				);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setCtAutoCheckbox(value: ChargeThreshold): Promise<any> {
		// console.log('auto check value here ----->', value);
		try {
			if (this.devicePowerThinkPad) {
				return this.devicePowerThinkPad.sectionChargeThreshold.setCtAutoCheckbox(
					value.batteryNum,
					value.startValue,
					value.stopValue,
					value.checkboxValue
				);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setToggleOff(value: any): Promise<any> {
		try {
			if (this.devicePowerThinkPad) {
				return this.devicePowerThinkPad.sectionChargeThreshold.setToggleOff(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	// End battery threshold settings

	getEnergyStarCapability(): Promise<any> {
		if (this.isShellAvailable) {
			return this.imcHelper.getIsEnergyStarCapability();
		}
		return undefined;
	}

	getSmartStandbyCapability(): Promise<boolean> {
		if (this.devicePowerThinkPad) {
			return this.devicePowerThinkPad.sectionSmartStandby.getSmartStandbyCapability();
		}
		return undefined;
	}
	getSmartStandbyEnabled(): Promise<boolean> {
		if (this.devicePowerThinkPad) {
			return this.devicePowerThinkPad.sectionSmartStandby.getSmartStandbyEnabled();
		}
		return undefined;
	}

	getSmartStandbyActiveStartEnd(): Promise<string> {
		if (this.devicePowerThinkPad) {
			return this.devicePowerThinkPad.sectionSmartStandby.getSmartStandbyActiveStartEnd();
		}
		return undefined;
	}

	getSmartStandbyDaysOfWeekOff(): Promise<string> {
		if (this.devicePowerThinkPad) {
			return this.devicePowerThinkPad.sectionSmartStandby.getSmartStandbyDaysOfWeekOff();
		}
		return undefined;
	}

	setSmartStandbyEnabled(value: boolean): Promise<any> {
		try {
			if (this.devicePowerThinkPad) {
				return this.devicePowerThinkPad.sectionSmartStandby.setSmartStandbyEnabled(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setSmartStandbyActiveStartEnd(value: string): Promise<any> {
		try {
			if (this.devicePowerThinkPad) {
				return this.devicePowerThinkPad.sectionSmartStandby.setSmartStandbyActiveStartEnd(
					value
				);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setSmartStandbyDaysOfWeekOff(value: string): Promise<any> {
		try {
			if (this.devicePowerThinkPad) {
				return this.devicePowerThinkPad.sectionSmartStandby.setSmartStandbyDaysOfWeekOff(
					value
				);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	getIsAutonomicCapability(): Promise<boolean> {
		try {
			if (this.devicePowerThinkPad) {
				return this.devicePowerThinkPad.sectionSmartStandby.getIsAutonomicCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	setSmartStandbyIsAutonomic(value: boolean): Promise<number> {
		try {
			if (this.devicePowerThinkPad) {
				return this.devicePowerThinkPad.sectionSmartStandby.setSmartStandbyIsAutonomic(
					value
				);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getSmartStandbyIsAutonomic(): Promise<boolean> {
		if (this.devicePowerThinkPad) {
			return this.devicePowerThinkPad.sectionSmartStandby.getSmartStandbyIsAutonomic();
		}
		return undefined;
	}
	getSmartStandbyPresenceData(): Promise<any> {
		if (this.devicePowerThinkPad) {
			return this.devicePowerThinkPad.sectionSmartStandby.getSmartStandbyPresenceData();
		}
		return undefined;
	}

	getSmartStandbyActiveHours(): Promise<any> {
		if (this.devicePowerThinkPad) {
			return this.devicePowerThinkPad.sectionSmartStandby.getSmartStandbyActiveHours();
		}
		return undefined;
	}

	getIsPresenceDataSufficient(): Promise<boolean> {
		if (this.devicePowerThinkPad) {
			return this.devicePowerThinkPad.sectionSmartStandby.getIsPresenceDataSufficient();
		}
		return undefined;
	}

	getGaugeResetCapability(): Promise<boolean> {
		try {
			if (this.devicePowerThinkPad) {
				return this.devicePowerThinkPad.sectionBatteryGaugeReset.getGaugeResetCapability();
			}
		} catch (error) {}
	}

	startBatteryGaugeReset(handler, barCode: string, batteryNumber: number): Promise<any> {
		try {
			if (this.devicePowerThinkPad) {
				return this.devicePowerThinkPad.sectionBatteryGaugeReset.startBatteryGaugeReset(
					handler,
					barCode,
					batteryNumber
				);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	stopBatteryGaugeReset(handler, barCode: string, batteryNumber: number): Promise<any> {
		try {
			if (this.devicePowerThinkPad) {
				return this.devicePowerThinkPad.sectionBatteryGaugeReset.stopBatteryGaugeReset(
					handler,
					barCode,
					batteryNumber
				);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
}
