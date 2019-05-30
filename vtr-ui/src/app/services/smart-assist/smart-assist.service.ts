import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';

@Injectable({
	providedIn: 'root'
})
export class SmartAssistService {

	private intelligentSensing;
	public isShellAvailable = false;

	constructor(shellService: VantageShellService) {
		this.intelligentSensing = shellService.getIntelligentSensing();

		if (this.intelligentSensing) {
			this.isShellAvailable = true;
		}
	}

	/**
	 * Intelligent Security card can be shown on UI
	 */
	public getIntelligentSecurityVisibility(): Promise<boolean> {
		// Is (Intelligent Security) supported
		return this.intelligentSensing.GetHPDCapability();
	}

	/**
	 * User Presence Sensing global toggle can be shown on UI
	 */
	public getHPDVisibility(): Promise<boolean> {
		// HPD global switch status. true means show, false means hide
		return this.intelligentSensing.GetHPDGlobalCapability();
	}

	/**
	 * User Presence Sensing global toggle enable/disable state on UI,
	 */
	public getHPDAvailability(): Promise<boolean> {
		// HPD global switch status. true means enable, false means disable
		return this.intelligentSensing.GetHPDGlobalEnabled();
	}

	/**
	 * User Presence Sensing global toggle enable/disable state on UI,
	 */
	public getHPDStatus(): Promise<boolean> {
		// HPD global switch status. true means enable, false means disable
		return this.intelligentSensing.GetHPDGlobalSetting();
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


}
