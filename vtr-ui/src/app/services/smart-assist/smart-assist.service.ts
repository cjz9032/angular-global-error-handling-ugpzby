import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';

@Injectable({
	providedIn: 'root'
})
export class SmartAssistService {

	private intelligentSensing;
	private intelligentMedia;
	private activeProtectionSystem;
	
	public isShellAvailable = false;
	public isAPSavailable = false;

	constructor(shellService: VantageShellService) {
		console.log('SHELL SERVICE----------------------------------', shellService);
		this.intelligentSensing = shellService.getIntelligentSensing();
		this.intelligentMedia = shellService.getIntelligentMedia();
		this.activeProtectionSystem = shellService.getActiveProtectionSystem(); // getting APS Object from vantage-shell.service

		this.activeProtectionSystem ? this.isAPSavailable = true : this.isAPSavailable = false;
		if (this.intelligentSensing && this.intelligentMedia) {
			this.isShellAvailable = true;
		}
	}

	//#region HPD section

	/**
	 * IdeaPad Only : User Presence Sensing global toggle can be shown on UI
	 */
	public getHPDVisibilityInIdeaPad(): Promise<boolean> {
		// HPD global switch status. true means show, false means hide
		return this.intelligentSensing.GetHPDCapability();
	}

	/**
	 * ThinkPad Only : User Presence Sensing global toggle can be shown on UI
	 */
	public getHPDVisibilityInThinkPad(): Promise<boolean> {
		// HPD global switch status. true means show, false means hide
		return this.intelligentSensing.GetHPDGlobalCapability();
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
			return this.intelligentSensing.SetBrowsingMode(option);
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
			return this.intelligentSensing.setBrowsingTime(option);
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
	public getHDDStatus(): Promise<boolean> {
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

	//#endregion
}
