import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { VoipResponse } from '../../data-models/input-accessories/voip.model';

@Injectable({
	providedIn: 'root',
})
export class InputAccessoriesService {
	keyboardManager: any;
	isShellAvailable = false;
	keyboard;
	private mouseAndTouchPad: any;
	private voipHotkeys;

	constructor(shellService: VantageShellService) {
		this.voipHotkeys = shellService.getVoipHotkeysObject();
		this.keyboardManager = shellService.getKeyboardManagerObject();
		this.mouseAndTouchPad = shellService.getMouseAndTouchPad();
		this.keyboard = shellService.getKeyboardObject();
		if (this.keyboardManager) {
			this.isShellAvailable = true;
		}
		if (this.keyboard) {
			this.isShellAvailable = true;
		}
	}

	setUserDefinedKeySetting(
		type: string,
		actionType: string,
		settingKey: string,
		settingValue: string
	): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.setUserDefinedKeySetting(
					type,
					actionType,
					settingKey,
					settingValue
				);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	StartSpecialKeyMonitor(installDirectory: string): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.StartSpecialKeyMonitor(installDirectory);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	EndSpecialKeyMonitor(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.EndSpecialKeyMonitor();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	Initialize(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.Initialize();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	AddApplicationOrFiles(selectedUDK: string, appSelectorType: string): Promise<any> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.AddApplicationOrFiles(selectedUDK, appSelectorType);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	DeleteUDKApplication(
		udkType: string,
		itemId: string,
		displayName: string
	): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.DeleteUDKApplication(udkType, itemId, displayName);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	//  Check Keyboard UDK Compatability Status and KeyboardMapCapability
	GetAllCapability(): Promise<any> {
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
	GetUDKTypeList(): Promise<any> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetUDKTypeList();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	GetKeyboardVersion(): Promise<string> {
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

	GetKBDLayoutName(): Promise<any> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetKBDLayoutName();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	GetKBDMachineType(): Promise<any> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetKBDMachineType();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	GetKbdHiddenKeyPrivacyFilterCapability(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetKbdHiddenKeyPrivacyFilterCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	GetKbdHiddenKeyBackLightCapability(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetKbdHiddenKeyBackLightCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	GetKbdHiddenKeyMagnifierCapability(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetKbdHiddenKeyMagnifierCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	GetKbdHiddenKeyPerformanceModeCapability(): Promise<boolean> {
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

	getTopRowFnLockCapability(): Promise<boolean> {
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
	getTopRowFnStickKeyCapability(): Promise<boolean> {
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
	getTopRowPrimaryFunctionCapability(): Promise<boolean> {
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

	getFnLockStatus(): Promise<boolean> {
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

	getFnStickKeyStatus(): Promise<boolean> {
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
	getPrimaryFunctionStatus(): Promise<boolean> {
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

	setFnStickKeyStatus(value): Promise<boolean> {
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

	setFnLock(value): Promise<boolean> {
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
	setPrimaryFunction(value): Promise<boolean> {
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
	// fnCtrlSwap & fnAsCtrl features hidden in 3.2.001
	GetFnCtrlSwapCapability(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetFnCtrlSwapCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	GetFnCtrlSwap() {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetFnCtrlSwap();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	SetFnCtrlSwap(value) {
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

	GetFnAsCtrlCapability(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetFnAsCtrlCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	GetFnAsCtrl() {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetFnAsCtrl();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	SetFnAsCtrl(value) {
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

	getMouseCapability(): Promise<boolean> {
		try {
			if (this.mouseAndTouchPad) {
				return this.mouseAndTouchPad.GetMouseCapability();
			}
			return Promise.resolve(false);
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getTouchPadCapability(): Promise<boolean> {
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
	getVoipHotkeysSettings(): Promise<VoipResponse> {
		try {
			if (this.voipHotkeys) {
				return this.voipHotkeys.getVOIPHotkeysSettings();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setVoipHotkeysSettings(selectedApp: number): Promise<VoipResponse> {
		try {
			if (this.voipHotkeys) {
				return this.voipHotkeys.setVOIPHotkeysSettings(selectedApp);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	// Start of Keyboard backlight thinkpad model
	getAutoKBDBacklightCapability(): Promise<boolean> {
		try {
			if (this.keyboard) {
				return this.keyboard.GetAutoKBDBacklightCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getKBDBacklightCapability(): Promise<boolean> {
		try {
			if (this.keyboard) {
				return this.keyboard.GetKBDBacklightCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getAutoKBDStatus(): Promise<boolean> {
		try {
			if (this.keyboard) {
				return this.keyboard.GetAutoKBDStatus();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getKBDBacklightStatus(): Promise<string> {
		try {
			if (this.keyboard) {
				return this.keyboard.GetKBDBacklightStatus();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getKBDBacklightLevel(): Promise<string> {
		try {
			if (this.keyboard) {
				return this.keyboard.GetKBDBacklightLevel();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setKBDBacklightStatus(level: string): Promise<boolean> {
		try {
			if (this.keyboard) {
				return this.keyboard.SetKBDBacklightStaus(level);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setAutomaticKBDBacklight(level: boolean): Promise<boolean> {
		try {
			if (this.keyboard) {
				return this.keyboard.SetAutomaticKBDBacklight(level);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setAutoKBDEnableStatus(): Promise<boolean> {
		try {
			if (this.keyboard) {
				return this.keyboard.SetAutoKBDEnableStatus(true);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	// End of Keyboard backlight thinkpad model

	// To Restart Windows
	restartMachine() {
		this.keyboardManager.RestartMachine();
	}
}
