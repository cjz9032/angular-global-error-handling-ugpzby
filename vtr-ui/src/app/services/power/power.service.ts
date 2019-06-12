import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
@Injectable({
	providedIn: 'root'
})
export class PowerService {
	private devicePower: any;
	private devicePowerIdeaNoteBook: any;
	private devicePowerThinkPad: any;
	private devicePowerSmartSettings: any;
	private devicePowerItsIntelligentCooling: any;
	public isShellAvailable = false;
	public intelligentCoolingForIdeaPad: any;
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
		if(this.intelligentCoolingForIdeaPad) {
			this.isShellAvailable = true;
		}
	}
	// Start AlwaysOn USB ThinkPad
	public getAlwaysOnUSBCapabilityThinkPad(): Promise<boolean> {
		try {
			if (this.devicePowerThinkPad) {
				return this.devicePowerThinkPad.sectionAlwaysOnUsb.getAlwaysOnUsbCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	public getAlwaysOnUSBStatusThinkPad(): Promise<any> {
		if (this.devicePowerThinkPad) {
			return this.devicePowerThinkPad.sectionAlwaysOnUsb.getAlwaysOnUsb();
		}
		return undefined;
	}
	public setAlwaysOnUSBStatusThinkPad(value: string, check: boolean): Promise<boolean> {
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
	public getAlwaysOnUSBStatusIdeaNoteBook(): Promise<FeatureStatus> {
		if (this.devicePowerIdeaNoteBook) {
			return this.devicePowerIdeaNoteBook.alwaysOnUSB.getAlwaysOnUSBStatus();
		}
		return undefined;
	}
	public setAlwaysOnUSBStatusIdeaNoteBook(value: boolean): Promise<boolean> {
		try {
			if (this.devicePowerIdeaNoteBook) {
				return this.devicePowerIdeaNoteBook.alwaysOnUSB.setAlwaysOnUSBStatus(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	public getUSBChargingInBatteryModeStatusIdeaNoteBook(): Promise<FeatureStatus> {
		if (this.devicePowerIdeaNoteBook) {
			return this.devicePowerIdeaNoteBook.alwaysOnUSB.getUSBChargingInBatteryModeStatus();
		}
		return undefined;
	}
	public setUSBChargingInBatteryModeStatusIdeaNoteBook(value: boolean): Promise<boolean> {
		try {
			if (this.devicePowerIdeaNoteBook) {
				return this.devicePowerIdeaNoteBook.alwaysOnUSB.setUSBChargingInBatteryModeStatus(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	// End AlwaysOn USB IdeaNoteBook
	// Conservation mode for IdeaNotebook
	public getConservationModeStatusIdeaNoteBook(): Promise<FeatureStatus> {
		if (this.devicePowerIdeaNoteBook) {
			return this.devicePowerIdeaNoteBook.conservationMode.getConservationModeStatus();
		}
		return undefined;
	}
	public setConservationModeStatusIdeaNoteBook(value: boolean): Promise<boolean> {
		try {
			if (this.devicePowerIdeaNoteBook) {
				return this.devicePowerIdeaNoteBook.conservationMode.setConservationModeStatus(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	// End Conservation mode for IdeaNoteBook
	// Express/Rapid Charging mode for IdeaNotebook
	public getRapidChargeModeStatusIdeaNoteBook(): Promise<FeatureStatus> {
		if (this.devicePowerIdeaNoteBook) {
			return this.devicePowerIdeaNoteBook.rapidChargeMode.getRapidChargeModeStatus();
		}
		return undefined;
	}
	public setRapidChargeModeStatusIdeaNoteBook(value: boolean): Promise<boolean> {
		try {
			if (this.devicePowerIdeaNoteBook) {
				return this.devicePowerIdeaNoteBook.rapidChargeMode.setRapidChargeModeStatus(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	// End Express/Rapid Charging mode for IdeaNoteBook
	// Start Easy Resume for ThinkPad
	public getEasyResumeCapabilityThinkPad(): Promise<boolean> {
		if (this.devicePowerThinkPad) {
			return this.devicePowerThinkPad.sectionEasyResume.getEasyResumeCapability();
		}
		return undefined;
	}
	public getEasyResumeStatusThinkPad(): Promise<any> {
		if (this.devicePowerThinkPad) {
			return this.devicePowerThinkPad.sectionEasyResume.getEasyResume();
		}
		return undefined;
	}
	public setEasyResumeThinkPad(value: boolean): Promise<boolean> {
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
	public getAirplaneModeCapabilityThinkPad(): Promise<boolean> {
		if (this.devicePowerThinkPad) {
			return this.devicePowerThinkPad.sectionAirplaneMode.getAirplaneModeCapability();
		}
		return undefined;
	}
	public getAirplaneModeThinkPad(): Promise<boolean> {
		if (this.devicePowerThinkPad) {
			return this.devicePowerThinkPad.sectionAirplaneMode.getAirplaneMode();
		}
		return undefined;
	}
	public setAirplaneModeThinkPad(value: boolean): Promise<boolean> {
		try {
			if (this.devicePowerThinkPad) {
				return this.devicePowerThinkPad.sectionAirplaneMode.setAirplaneMode(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	// End Airplane Power mode thinkpad
	// Start Vantage ToolBar
	public getVantageToolBarStatus(): Promise<FeatureStatus> {
		if (this.devicePower) {
			return this.devicePower.getVantageToolBarStatus();
		}
		return undefined;
	}
	public setVantageToolBarStatus(value: boolean): Promise<boolean> {
		try {
			if (this.devicePower) {
				return this.devicePower.setVantageToolBarStatus(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	public startMonitor(handler: any): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.devicePower.startMonitor((handler));
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	public stopMonitor() {
		if (this.isShellAvailable) {
			this.devicePower.stopMonitor((response: boolean) => {
				//this.commonService.sendNotification(DeviceMonitorStatus.MicrophoneStatus, response);
			});
		}
	}
	// End Vantage ToolBar

	// Power smart settings
	// ----------start ITC Capable
	public getDYTCRevision(): Promise<number> {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.getDYTCRevision();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	public getCQLCapability(): Promise<boolean> {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.getCQLCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	public getTIOCapability(): Promise<boolean> {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.getTIOCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	public setAutoModeSetting(value: boolean): Promise<boolean> {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.setAutoModeSetting(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	public setManualModeSetting(value: string): Promise<boolean> {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.setManualModeSetting(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	public getManualModeSetting(): Promise<string> {
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
	public getAPSState(): Promise<boolean> {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.getAPSState();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public getLegacyCQLCapability(): Promise<boolean> {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.getLegacyCQLCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public getLegacyTIOCapability(): Promise<number> {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.getLegacyTIOCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public getLegacyManualModeCapability(): Promise<boolean> {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.getLegacyManualModeCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public getLegacyAutoModeState(): Promise<boolean> {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.getLegacyAutoModeState();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public getLegacyManualModeState(): Promise<boolean> {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.getLegacyManualModeState();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public setLegacyAutoModeState(value: boolean) {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.setLegacyAutoModeState(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public setLegacyManualModeState(value: boolean) {
		try {
			if (this.devicePowerItsIntelligentCooling) {
				return this.devicePowerItsIntelligentCooling.intelligentCooling.setLegacyManualModeState(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	// ---------- End Legacy Capable

	//-------------Start IdeaPad
	public getITSModeForICIdeapad() {
		try {
			if (this.intelligentCoolingForIdeaPad) {
				return this.intelligentCoolingForIdeaPad.GetITSMode();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public setITSModeForICIdeapad(mode: string) {
		try {
			if (this.intelligentCoolingForIdeaPad) {
				return this.intelligentCoolingForIdeaPad.SetITSMode(mode);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	public startMonitorForICIdeapad() {
		try {
			if (this.intelligentCoolingForIdeaPad) {
				return this.intelligentCoolingForIdeaPad.startMonitor();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public stopMonitorForICIdeapad() {
		try {
			if (this.intelligentCoolingForIdeaPad) {
				return this.intelligentCoolingForIdeaPad.stopMonitor();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	//-------------End IdeaPad

	// End Power smart settings

		// ---------- start battery threshold settings

		public getChargeThresholdInfo(): Promise<any> {
			try {
				if (this.devicePowerThinkPad) {
					return this.devicePowerThinkPad.sectionChargeThreshold.getChargeThresholdInfo();
				}
				return undefined;
			} catch (error) {
				throw new Error(error.message);
			}
		}

		public setChargeThresholdValue(value: any): Promise<any> {
			//console.log('Battery threshold value here ----->', value);
			try {
				if (this.devicePowerThinkPad) {
					return this.devicePowerThinkPad.sectionChargeThreshold.setChargeThresholdValue(value);
				}
				return undefined;
			} catch (error) {
				throw new Error(error.message);
			}
		}

		public setCtAutoCheckbox(value: any): Promise<any> {
		//console.log('auto check value here ----->', value);
			try {
				if (this.devicePowerThinkPad) {
					return this.devicePowerThinkPad.sectionChargeThreshold.setCtAutoCheckbox(value);
				}
				return undefined;
			} catch (error) {
				throw new Error(error.message);
			}
		}
	
		
		// End end battery threshold settings
	
}
