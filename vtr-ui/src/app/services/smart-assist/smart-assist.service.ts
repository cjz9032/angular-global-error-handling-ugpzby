import {
	Injectable
} from '@angular/core';
import {
	FeatureStatus
} from 'src/app/data-models/common/feature-status.model';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';

@Injectable({
	providedIn: 'root'
})
export class SmartAssistService {

	private intelligentSensing;
	private intelligentMedia;
	private activeProtectionSystem;
	private lenovoVoice;
	private superResolution;

	public isShellAvailable = false;
	public isAPSavailable = false;

	constructor(shellService: VantageShellService) {
		this.intelligentSensing = shellService.getIntelligentSensing();
		this.intelligentMedia = shellService.getIntelligentMedia();
		this.activeProtectionSystem = shellService.getActiveProtectionSystem(); // getting APS Object from //vantage-shell.service
		this.lenovoVoice = shellService.getLenovoVoice();
		this.superResolution = shellService.getSuperResolution();

		this.activeProtectionSystem ? this.isAPSavailable = true : this.isAPSavailable = false;
		if (this.intelligentSensing && this.intelligentMedia && this.lenovoVoice  && this.superResolution) {
			this.isShellAvailable = true;
		}
	}

	//#region HPD section

	/**
	 * IdeaPad Only : User Presence Sensing global toggle can be shown on UI
	 */
	// public getHPDVisibilityInIdeaPad(): Promise<boolean> {
	// 	// HPD global switch status. true means show, false means hide
	// 	return this.intelligentSensing.GetHPDCapability();
	// }

	/**
	 * ThinkPad Only : User Presence Sensing global toggle can be shown on UI
	 */
	public getHPDVisibility(): Promise<boolean> {
		// HPD global switch status. true means show, false means hide
		return this.intelligentSensing.GetHPDCapability();
	}

	/**
	 * User Presence Sensing global toggle enable/disable state on UI,
	 */
	public getHPDStatus(): Promise<boolean> {
		// HPD global switch status. true means enable, false means disable
		return this.intelligentSensing.GetHPDGlobalSetting();
	}

	/**
	 * set value for global HPD setting
	 */
	public setHPDStatus(value: boolean): Promise<boolean> {
		// HPD global switch status. true means enable, false means disable
		const option = value ? 'True' : 'False';
		return this.intelligentSensing.SetHPDGlobalSetting(option);
	}

	public getZeroTouchLockVisibility(): Promise<boolean> {
		// Get Auto Screen Lock section visibility
		return this.intelligentSensing.GetHPDLeaveCapability();
	}

	public getZeroTouchLockStatus(): Promise<boolean> {
		// Get Auto Screen Lock setting
		return this.intelligentSensing.GetHPDPresentLeaveSetting();
	}

	// set auto adjust for IdeaPad models
	public setZeroTouchLockStatus(value: boolean): Promise<boolean> {
		const option = value ? 'True' : 'False';
		return this.intelligentSensing.SetHPDPresentLeaveSetting(option);
	}

	public getZeroTouchLockFacialRecoStatus(): Promise<boolean> {
		return this.intelligentSensing.getLockFacialRecognitionSettings();
	}

	public setZeroTouchLockFacialRecoStatus(value: boolean): Promise<boolean> {
		const option = value ? 'True' : 'False';
		return this.intelligentSensing.setLockFacialRecognitionSettings(option);

	}

	public resetFacialRecognitionStatus(): Promise<boolean> {
		return this.intelligentSensing.resetFacialRecognitionStatus();
	}

	public getZeroTouchLoginVisibility(): Promise<boolean> {
		// Get Auto Screen Lock section visibility
		return this.intelligentSensing.GetHPDApproachCapability();
	}


	public getZeroTouchLoginStatus(): Promise<boolean> {
		// Get Auto Screen Login setting
		return this.intelligentSensing.GetHPDApproachSetting();
	}

	public getZeroTouchLoginDistance(): Promise<number> {
		// Get Auto Screen Login setting
		return this.intelligentSensing.GetHPDApproachDistance();
	}

	/**
	 * Set Zero Touch Login toggle button status,
	 */
	public setZeroTouchLoginStatus(value: boolean): Promise<boolean> {
		// HPD global switch status. true means enable, false means disable
		const option = value ? 'True' : 'False';
		return this.intelligentSensing.SetHPDApproachSetting(option);
	}

	public getZeroTouchLoginAdjustVisibility(): Promise<number> {
		// Get Auto Screen Login setting
		return this.intelligentSensing.GetHPDAutoAdjustCapability();
	}

	public getZeroTouchLoginAdjustStatus(): Promise<number> {
		// Get Auto Screen Login setting
		return this.intelligentSensing.GetHPDAutoAdjustSetting();
	}

	/**
	 * Set Zero Touch Login toggle button status,
	 */
	public setZeroTouchLoginAdjustStatus(value: boolean): Promise<boolean> {
		// HPD global switch status. true means enable, false means disable
		const option = value ? 'True' : 'False';
		return this.intelligentSensing.SetHPDAutoAdjustSetting(option);
	}

	/**
	 * Get currently selected lock screen timer value
	 * 1 = Near,
	 * 2 = Middle/Medium,
	 * 3 = Far
	 */
	public setZeroTouchLoginDistance(value: number): Promise<boolean> {
		// HPD global switch status. true means enable, false means disable
		const option = value.toString();
		return this.intelligentSensing.SetHPDApproachDistanceSetting(option);
	}

	/**
	 * Get currently selected lock screen timer value
	 * 1 = Fast,
	 * 2 = Medium,
	 * 3 = Slow
	 */
	public getSelectedLockTimer(): Promise<number> {
		// Get Auto Screen Lock setting
		return this.intelligentSensing.GetHPDLeaveWait();
	}

	/**
	 * Get currently selected lock screen timer value
	 * '1' = Fast
	 * '2' = Medium
	 * '3' = Slow
	 */
	public setSelectedLockTimer(value: string): Promise<boolean> {
		return this.intelligentSensing.SetHPDLeaveWaitSetting(value);
	}



	public resetHPDSetting(): Promise<boolean> {
		if (this.isShellAvailable) {
			return this.intelligentSensing.HPDSettingReset();
		}
		return undefined;
	}

	public getWindowsHelloStatus(): Promise<boolean> {
		if (this.isShellAvailable) {
			return this.intelligentSensing.GetFacialFeatureRegistered();
		}
		return undefined;
	}

	//#endregion


	//#region Intelligent Media section

	/**
	 * HDP auto video pause
	 */
	public getVideoPauseResumeStatus(): Promise<FeatureStatus> {
		try {
			if (this.isShellAvailable) {
				return this.intelligentMedia.getVideoPauseResumeStatus();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public setVideoPauseResumeStatus(value: boolean): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.intelligentMedia.setVideoPauseResumeStatus(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	//#endregion

	public getSuperResolutionStatus(): Promise<FeatureStatus> {
		try {
			if (this.isShellAvailable) {
				return this.superResolution.getSuperResolutionStatus();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public setSuperResolutionStatus(value: boolean): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.superResolution.setSuperResolutionStatus(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	//#region Intelligent Sensing (Intelligent screen) section

	public getIntelligentScreenVisibility(): Promise<boolean> {
		if (this.isShellAvailable) {
			return this.intelligentSensing.GetSmartSensecapability();
		}
		return undefined;
	}

	public getAutoScreenOffVisibility(): Promise<boolean> {
		if (this.isShellAvailable) {
			return this.intelligentSensing.GetWalkingCapability();
		}
		return undefined;
	}

	public getAutoScreenOffStatus(): Promise<boolean> {
		if (this.isShellAvailable) {
			return this.intelligentSensing.GetWalkingSetting();
		}
		return undefined;
	}

	public setAutoScreenOffStatus(value: boolean): Promise<boolean> {
		if (this.isShellAvailable) {
			const option = value ? 'True' : 'False';
			return this.intelligentSensing.SetWalkingMode(option);
		}
		return undefined;
	}

	/**
	 * if value returned is true then show note
	 */
	public getAutoScreenOffNoteStatus(): Promise<boolean> {
		if (this.isShellAvailable) {
			return this.intelligentSensing.GetWalkingCautionVisibility();
		}
		return undefined;
	}

	public getReadingOrBrowsingVisibility(): Promise<boolean> {
		if (this.isShellAvailable) {
			return this.intelligentSensing.GetBrowsingCapability();
		}
		return undefined;
	}

	public getReadingOrBrowsingStatus(): Promise<boolean> {
		if (this.isShellAvailable) {
			return this.intelligentSensing.GetBrowsingSetting();
		}
		return undefined;
	}

	public setReadingOrBrowsingStatus(value: boolean): Promise<boolean> {
		if (this.isShellAvailable) {
			const option = value ? 'True' : 'False';
			return this.intelligentSensing.setBrowsingMode(option);
		}
		return undefined;
	}

	public getReadingOrBrowsingTime(): Promise<boolean> {
		if (this.isShellAvailable) {
			return this.intelligentSensing.GetBrowsingTime();
		}
		return undefined;
	}

	public setReadingOrBrowsingTime(value: number): Promise<boolean> {
		if (this.isShellAvailable) {
			const option = value * 60;
			return this.intelligentSensing.SetBrowsingTime(option);
		}
		return undefined;
	}

	//#endregion


	//#region Active Protection System APS
	//  APS Capability
	public getAPSCapability(): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.getAPSCapability();
		}
		return undefined;
	}
	// APS Sensor(G-Sensor) Capability
	public getSensorStatus(): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.getSensorStatus();
		}
		return undefined;
	}
	// HDD Status
	public getHDDStatus(): Promise<number> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.getHDDStatus();
		}
		return undefined;
	}
	// APS Mode
	public getAPSMode(): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.getAPSMode();
		}
		return undefined;
	}
	// SET APS MODE
	public setAPSMode(value: boolean): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.setAPSMode(value);
		}
		return undefined;
	}
	// Get Sensitivity Level
	public getAPSSensitivityLevel(): Promise<number> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.getAPSSensitivityLevel();
		}
		return undefined;
	}
	// Get Sensitivity Level
	public setAPSSensitivityLevel(value: number): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.setAPSSensitivityLevel(value);
		}
		return undefined;
	}
	// Get Repetitive Shock
	public getAutoDisableSetting(): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.getAutoDisableSetting();
		}
		return undefined;
	}
	// Set Repetitive Shock
	public setAutoDisableSetting(value: boolean): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.setAutoDisableSetting(value);
		}
		return undefined;
	}
	// GET Manual suspention of APS
	public getSnoozeSetting(): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.getSnoozeSetting();
		}
		return undefined;
	}
	// SET Manual Suspension of APS
	public setSnoozeSetting(value: boolean): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.setSnoozeSetting(value);
		}
		return undefined;
	}
	// GET Snooze value
	public getSnoozeTime(): Promise<number> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.getSnoozeTime();
		}
		return undefined;
	}
	// SET Snooze time
	public setSnoozeTime(value: string): Promise<boolean> {
		console.log('SNOOZE VALUE', typeof value);
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.setSnoozeTime(value);
		}
		return undefined;
	}
	// Suspend APS
	public sendSnoozeCommand(value: string): Promise<boolean> {
		console.log('SUSPEND', typeof value, value);
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.sendSnoozeCommand(value);
		}
		return undefined;
	}
	//  Get Pen Capability
	public getPenCapability(): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.getPenCapability();
		}
		return undefined;
	}
	// Get Touch Capability
	public getTouchCapability(): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.getTouchCapability();
		}
		return undefined;
	}
	// Get PSensor Capability
	public getPSensorCapability(): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.getPSensorCapability();
		}
		return undefined;
	}
	// Get Pen Status
	public getPenSetting(): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.getPenSetting();
		}
		return undefined;
	}
	// Get Pen Delay
	public getPenDelayTime(): Promise<number> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.getPenDelayTime();
		}
		return undefined;
	}
	// Get Touch Status
	public getTouchInputSetting(): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.getTouchInputSetting();
		}
		return undefined;
	}
	// Get PSensor Status
	public getPSensorSetting(): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.getPSensorSetting();
		}
		return undefined;
	}
	// Set Pen settings
	public setPenSetting(value: boolean): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.setPenSetting(value);
		}
		return undefined;
	}
	// Set Pen Delay
	public setPenDelayTime(value: number): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.setPenDelayTime(value);
		}
		return undefined;
	}
	//  Set Touch settings
	public setTouchInputSetting(value: boolean): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.setTouchInputSetting(value);
		}
		return undefined;
	}
	// Set PSensor Settings
	public setPSensorSetting(value: boolean): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.setPSensorSetting(value);
		}
		return undefined;
	}
	//#endregion

	//#region Start Lenovo Voice
	public isLenovoVoiceAvailable(): Promise<boolean> {
		if (this.lenovoVoice) {
			return this.lenovoVoice.getCapability();
		}
		return undefined;
	}

	public isLenovoVoiceInstalled(): Promise<boolean> {
		if (this.lenovoVoice) {
			return this.lenovoVoice.getInstallStatus();
		}
		return undefined;
	}

	public downloadLenovoVoice(): Promise<string> {
		if (this.lenovoVoice) {
			return this.lenovoVoice.downloadAndInstallVoiceApp();
		}
		return undefined;
	}

	public launchLenovoVoice(): Promise<boolean> {
		if (this.lenovoVoice) {
			return this.lenovoVoice.launchVoiceApp();
		}
		return undefined;
	}
	//#endregion

	public getHPDSensorType(): Promise<number> {
		if (this.isShellAvailable) {
			return this.intelligentSensing.GetHPDSensorType();
		}
		return undefined;
	}
}
