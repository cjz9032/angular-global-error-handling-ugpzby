import { Injectable } from '@angular/core';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';
import { MacroKeyInput } from 'src/app/data-models/gaming/macrokey/macrokey-input.model';
import { MacroKeyTypeStatus } from 'src/app/data-models/gaming/macrokey/macrokey-type-status.model';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from '../../common/common.service';
import { MacroKeyRecordedChange } from 'src/app/data-models/gaming/macrokey/macrokey-recorded-change.model';
import { MacroKeyInputChange } from 'src/app/data-models/gaming/macrokey/macrokey-input-change.model';

@Injectable({
	providedIn: 'root'
})
export class MacrokeyService {
	private macroKey: any;
	public isMacroKeyAvailable: Boolean = false;

	constructor(private shellService: VantageShellService, private commonService: CommonService) {
		this.macroKey = shellService.getGamingMacroKey();
		if (this.macroKey) {
			this.isMacroKeyAvailable = true;
		}
	}

	public gamingMacroKeyInitializeEvent() {
		if (this.isMacroKeyAvailable) {
			return this.shellService.macroKeyInitializeEvent();
		}
		return undefined;
	}

	public setMacroKeyApplyStatus(selectedNumber: String) {
		if (this.isMacroKeyAvailable) {
			return this.shellService.macroKeySetApplyStatus(selectedNumber);
		}
		return undefined;
	}

	public setStartRecording(selectedNumber: String) {
		if (this.isMacroKeyAvailable) {
			return this.shellService.macroKeySetStartRecording(selectedNumber);
		}
		return undefined;
	}

	public setStopRecording(selectedNumber: String, isSuccess: Boolean, message: String) {
		if (this.isMacroKeyAvailable) {
			return this.shellService.macroKeySetStopRecording(selectedNumber, isSuccess, message);
		}
		return undefined;
	}

	public setKey(selectedNumber: String) {
		if (this.isMacroKeyAvailable) {
			return this.shellService.macroKeySetKey(selectedNumber);
		}
		return undefined;
	}

	public clearKey(selectedNumber: String) {
		if (this.isMacroKeyAvailable) {
			return this.shellService.macroKeyClearKey(selectedNumber);
		}
		return undefined;
	}

	public setRepeat(selectedNumber: String, repeatValue: Number) {
		if (this.isMacroKeyAvailable) {
			return this.shellService.macroKeySetRepeat(selectedNumber, repeatValue);
		}
		return undefined;
	}

	public setInterval(selectedNumber: String, intervalValue: Number) {
		if (this.isMacroKeyAvailable) {
			return this.shellService.macroKeySetInterval(selectedNumber, intervalValue);
		}
		return undefined;
	}

	public setMacroKey(selectedNumber: String, remainingInputs: MacroKeyInput[]) {
		if (this.isMacroKeyAvailable) {
			return this.shellService.macroKeySetMacroKey(selectedNumber, remainingInputs);
		}
		return undefined;
	}

	// update the macrokey status with cache
	setMacrokeyTypeStatusCache(macrokeyStatusType: MacroKeyTypeStatus) {
		this.commonService.setLocalStorageValue(LocalStorageKey.MacroKeyType, macrokeyStatusType.MacroKeyType);
		this.commonService.setLocalStorageValue(LocalStorageKey.MacroKeyStatus, macrokeyStatusType.MacroKeyStatus);
	}

	getMacrokeyTypeStatusCache(): MacroKeyTypeStatus {
		const macrokeyStatusType = new MacroKeyTypeStatus();
		macrokeyStatusType.MacroKeyType = this.commonService.getLocalStorageValue(LocalStorageKey.MacroKeyType);
		macrokeyStatusType.MacroKeyStatus = this.commonService.getLocalStorageValue(LocalStorageKey.MacroKeyStatus);
		return macrokeyStatusType;
	}

	// Macrokey recorded changes
	setMacrokeyRecordedStatusCache(macrokeyRecordChanges: MacroKeyRecordedChange[]) {
		this.commonService.setLocalStorageValue(LocalStorageKey.MacroKeyRecordedStatus, macrokeyRecordChanges);
	}

	getMacrokeyRecordedStatusCache(): MacroKeyRecordedChange[] {
		let recordChangeStatus: MacroKeyRecordedChange[];
		recordChangeStatus = this.commonService.getLocalStorageValue(LocalStorageKey.MacroKeyRecordedStatus);
		return recordChangeStatus;
	}

	// Macrokey input change details
	setMacrokeyInputChangeCache(inputChangeDetail: MacroKeyInputChange) {
		this.commonService.setLocalStorageValue(LocalStorageKey.CurrentMacroKeyRepeat, inputChangeDetail.macro.repeat);
		this.commonService.setLocalStorageValue(LocalStorageKey.MacroKey, inputChangeDetail.key);
		this.commonService.setLocalStorageValue(LocalStorageKey.CurrentMacroKeyInterval, inputChangeDetail.macro.interval);
	}

	getMacrokeyInputChangeCache(): MacroKeyInputChange {
		const inputChangeStatus = new MacroKeyInputChange();
		inputChangeStatus.macro.repeat = this.commonService.getLocalStorageValue(LocalStorageKey.CurrentMacroKeyRepeat);
		inputChangeStatus.key = this.commonService.getLocalStorageValue(LocalStorageKey.MacroKey);
		inputChangeStatus.macro.interval = this.commonService.getLocalStorageValue(LocalStorageKey.CurrentMacroKeyInterval);
		return inputChangeStatus;
	}

	// Set Macrokey change status

	// setMacrokeyTypeCache(macrokeyStatusType: MacroKeyTypeStatus) {
	// 	this.commonService.setLocalStorageValue(LocalStorageKey.MacroKeyType, macrokeyStatusType.MacroKeyType);
	// }

	// getMacrokeyTypeCache(): MacroKeyTypeStatus {
	// 	const macrokeyType = new MacroKeyTypeStatus();
	// 	macrokeyType.MacroKeyType = this.commonService.getLocalStorageValue(LocalStorageKey.MacroKeyType);
	// 	return macrokeyType;
	// }

	// setMacrokeyChangeStatusCache(macrokeyStatusType: MacroKeyTypeStatus) {
	// 	this.commonService.setLocalStorageValue(LocalStorageKey.MacroKeyStatus, macrokeyStatusType.MacroKeyStatus);
	// }

	// getMacrokeyChangeStatusCache(): MacroKeyTypeStatus {
	// 	const macroKeyChangeStatus = new MacroKeyTypeStatus();
	// 	macroKeyChangeStatus.MacroKeyStatus = this.commonService.getLocalStorageValue(LocalStorageKey.MacroKeyStatus);
	// 	return macroKeyChangeStatus;
	// }
}
