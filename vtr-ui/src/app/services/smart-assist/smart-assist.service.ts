import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';

@Injectable({
	providedIn: 'root'
})
export class SmartAssistService {

	private intelligentSensing;
	private intelligentMedia;
	public isShellAvailable = false;

	constructor(shellService: VantageShellService) {
		this.intelligentSensing = shellService.getIntelligentSensing();
		this.intelligentMedia = shellService.getIntelligentMedia();


		if (this.intelligentSensing && this.intelligentMedia) {
			this.isShellAvailable = true;
		}
	}

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

	public resetHPDSetting(): Promise<boolean> {
		if (this.isShellAvailable) {
			return this.intelligentMedia.HPDSettingReset();
		}
		return undefined;
	}

	public getWindowsHelloStatus(): Promise<boolean> {
		if (this.isShellAvailable) {
			return this.intelligentMedia.GetFacialFeatureRegistered();
		}
		return undefined;
	}
}
