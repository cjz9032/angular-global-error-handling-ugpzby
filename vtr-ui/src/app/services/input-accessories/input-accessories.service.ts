import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { VoipResponse } from '../../data-models/input-accessories/voip.model';

@Injectable({
	providedIn: 'root'
})
export class InputAccessoriesService {
	public keyboardManager: any;
	private mouseAndTouchPad: any;
	public isShellAvailable = false;
	private voipHotkeys;

	constructor(shellService: VantageShellService) {
		this.voipHotkeys = shellService.getVoipHotkeysObject();
		this.keyboardManager = shellService.getKeyboardManagerObject();
		this.mouseAndTouchPad = shellService.getMouseAndTouchPad();
		if (this.keyboardManager) {
			this.isShellAvailable = true;
		}
	}


	public setUserDefinedKeySetting(type: string, actionType: string, settingKey: string, settingValue: string): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.setUserDefinedKeySetting(type, actionType, settingKey, settingValue);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}

	}

	//  Check Keyboard UDK Compatability Status and KeyboardMapCapability
	public GetAllCapability(): Promise<any> {
		try {
			if (this.keyboardManager) {
				const value = this.keyboardManager.GetAllCapability();
				return value;
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	//  Get the UDKTypeList
	public GetUDKTypeList(): Promise<any> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetUDKTypeList();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public GetKeyboardVersion(): Promise<string> {
		try {
			if (this.keyboardManager) {
				const response = this.keyboardManager.GetKeyboardVersion();
				return response;
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

	// Start Top Row Function keys

	public getTopRowFnLockCapability(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				const response = this.keyboardManager.GetTopRowFnLockCapability();
				return response;
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	public getTopRowFnStickKeyCapability(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				const response = this.keyboardManager.GetTopRowFnStickKeyCapability();
				return response;
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	public getTopRowPrimaryFunctionCapability(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				const response = this.keyboardManager.GetTopRowPrimaryFunctionCapability();
				return response;
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public getFnLockStatus(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				const response = this.keyboardManager.GetFnLockStatus();
				return response;
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public getFnStickKeyStatus(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				const response = this.keyboardManager.GetFnStickKeyStatus();
				return response;
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	public getPrimaryFunctionStatus(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				const response = this.keyboardManager.GetPrimaryFunctionStatus();
				return response;
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public setFnStickKeyStatus(value): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				const response = this.keyboardManager.SetFnStickKey(value);
				return response;
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public setFnLock(value): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				const response = this.keyboardManager.SetFnLock(value);
				return response;
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	public setPrimaryFunction(value): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				const response = this.keyboardManager.SetPrimaryFunction(value);
				return response;
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	// FnCtrlSwap feature start here

	public GetFnCtrlSwapCapability(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetFnCtrlSwapCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public GetFnCtrlSwap() {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetFnCtrlSwap();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public SetFnCtrlSwap(value) {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.SetFnCtrlSwap(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	// FnCtrlSwap feature end here

	// FnAsCtrl feature start here

	public GetFnAsCtrlCapability(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetFnAsCtrlCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public GetFnAsCtrl() {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetFnAsCtrl();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public SetFnAsCtrl(value) {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.SetFnCtrlSwap(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
		// FnAsCtrl feature end here
	public getMouseCapability(): Promise<boolean> {
		try {
			if (this.mouseAndTouchPad) {
				return this.mouseAndTouchPad.GetMouseCapability();
			}
			return Promise.resolve(false);
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public getTouchPadCapability(): Promise<boolean> {
		try {
			if (this.mouseAndTouchPad) {
				return this.mouseAndTouchPad.GetTouchpadCapability();
			}
			return Promise.resolve(false);
		} catch (error) {
			throw new Error(error.message);
		}
	}

	// Voiphotkeys Feature
	public getVoipHotkeysSettings(): Promise<VoipResponse> {
		try {
			if (this.voipHotkeys) {
				return this.voipHotkeys.getVOIPHotkeysSettings();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public setVoipHotkeysSettings(selectedApp: number): Promise<VoipResponse> {
		try {
			if (this.voipHotkeys) {
				return this.voipHotkeys.setVOIPHotkeysSettings(selectedApp);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	// To Restart Windows
	public restartMachine() {
		this.keyboardManager.RestartMachine();
	}
}
