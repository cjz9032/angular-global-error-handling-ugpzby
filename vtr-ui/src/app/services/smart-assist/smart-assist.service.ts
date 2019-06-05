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

	public getHPDCapability(): Promise<boolean> {
		// Is (Intelligent Security) supported
		return this.intelligentSensing.GetHPDCapability();
	}

	public getAutoLockVisibility(): Promise<boolean> {
		// Get Auto Screen Lock section visibility
		return this.intelligentSensing.GetHPDLeaveCapability();
	}

	public getAutoLockStatus(): Promise<boolean> {
		// Get Auto Screen Lock setting
		return this.intelligentSensing.GetHPDPresentLeaveSetting();
	}

	// set auto adjust for IdeaPad models
	public setAutoLockStatus(value: string): Promise<boolean> {
		return this.intelligentSensing.SetHPDPresentLeaveSetting(value);
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
}
