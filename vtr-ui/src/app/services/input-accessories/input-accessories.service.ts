import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { promise } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class InputAccessoriesService {
  public keyboardManager: any;
  public isShellAvailable = false;
  
	constructor(shellService: VantageShellService) {	
		this.keyboardManager = shellService.getKeyboardManagerObject();
		if (this.keyboardManager) {
			this.isShellAvailable = true;
		}	
	}
	// Start Hidden keyboard keys
	public GetKeyboardMapCapability(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetKeyboardMapCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public GetKBDLayoutName(): Promise<any> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetKBDLayoutName();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public GetKBDMachineType(): Promise<any> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetKBDMachineType();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}	


	public GetKbdHiddenKeyPrivacyFilterCapability(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetKbdHiddenKeyPrivacyFilterCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	public GetKbdHiddenKeyBackLightCapability(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetKbdHiddenKeyBackLightCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	public GetKbdHiddenKeyMagnifierCapability(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetKbdHiddenKeyMagnifierCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	public GetKbdHiddenKeyPerformanceModeCapability(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetKbdHiddenKeyPerformanceModeCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	// End  Hidden keyboard keys

}
