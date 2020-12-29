import { Injectable } from '@angular/core';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';
import { MacroKeyInput } from 'src/app/data-models/gaming/macrokey/macrokey-input.model';
import { MacroKeyTypeStatus } from 'src/app/data-models/gaming/macrokey/macrokey-type-status.model';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { MacroKeyRecordedChange } from 'src/app/data-models/gaming/macrokey/macrokey-recorded-change.model';
import { MacroKeyInputChange } from 'src/app/data-models/gaming/macrokey/macrokey-input-change.model';
import { LocalCacheService } from '../../local-cache/local-cache.service';

@Injectable({
	providedIn: 'root',
})
export class MacrokeyService {
	private macroKey: any;
	public isMacroKeyAvailable = false;

	public cardContentPositionF: any = {
		FeatureImage: 'assets/cms-cache/content-card-4x4-support.jpg',
	};

	public cardContentPositionB: any = {
		FeatureImage: 'assets/cms-cache/Security4x3-zone2.jpg',
	};

	constructor(
		private shellService: VantageShellService,
		private localCacheService: LocalCacheService
	) {
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

	public setStopRecording(selectedNumber: String, isSuccess: Boolean, stopType: Boolean) {
		if (this.isMacroKeyAvailable) {
			return this.shellService.macroKeySetStopRecording(
				selectedNumber,
				isSuccess,
				stopType ? 'abnormal' : 'normal'
			);
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
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.MacroKeyType,
			macrokeyStatusType.MacroKeyType
		);
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.MacroKeyStatus,
			macrokeyStatusType.MacroKeyStatus
		);
	}

	getMacrokeyTypeStatusCache(): MacroKeyTypeStatus {
		const macrokeyStatusType = new MacroKeyTypeStatus();
		macrokeyStatusType.MacroKeyType = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.MacroKeyType
		);
		macrokeyStatusType.MacroKeyStatus = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.MacroKeyStatus
		);
		return macrokeyStatusType;
	}

	// Macrokey recorded changes
	setMacrokeyRecordedStatusCache(macrokeyRecordChanges: MacroKeyRecordedChange[]) {
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.MacroKeyRecordedStatus,
			macrokeyRecordChanges
		);
	}

	getMacrokeyRecordedStatusCache(): MacroKeyRecordedChange[] {
		let recordChangeStatus: MacroKeyRecordedChange[];
		recordChangeStatus = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.MacroKeyRecordedStatus
		);
		return recordChangeStatus;
	}

	// Macrokey input change details
	setMacrokeyInputChangeCache(inputChangeDetail: MacroKeyInputChange) {
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.CurrentMacroKeyRepeat,
			inputChangeDetail.macro.repeat
		);
		this.localCacheService.setLocalCacheValue(LocalStorageKey.MacroKey, inputChangeDetail.key);
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.CurrentMacroKeyInterval,
			inputChangeDetail.macro.interval
		);
	}

	getMacrokeyInputChangeCache(): MacroKeyInputChange {
		const inputChangeStatus = new MacroKeyInputChange();
		inputChangeStatus.macro.repeat = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.CurrentMacroKeyRepeat
		);
		inputChangeStatus.key = this.localCacheService.getLocalCacheValue(LocalStorageKey.MacroKey);
		inputChangeStatus.macro.interval = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.CurrentMacroKeyInterval
		);
		return inputChangeStatus;
	}

	// Initial key data change
	setMacrokeyInitialKeyDataCache(macroKeyData: MacroKeyInputChange) {
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.InitialKeyMacroKeyData,
			macroKeyData
		);
	}

	getMacrokeyInitialKeyDataCache(): MacroKeyInputChange {
		let macroKeyData = new MacroKeyInputChange();
		macroKeyData = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.InitialKeyMacroKeyData
		);
		return macroKeyData;
	}

	updateMacrokeyInitialKeyRepeatDataCache(selectRepeatChange: number) {
		let macroKeyData = new MacroKeyInputChange();
		macroKeyData = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.InitialKeyMacroKeyData
		);
		if (macroKeyData) {
			macroKeyData.macro.repeat = selectRepeatChange;
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.InitialKeyMacroKeyData,
				macroKeyData
			);
		}
	}

	updateMacrokeyInitialKeyIntervalDataCache(intervalStatus: number) {
		let macroKeyData = new MacroKeyInputChange();
		macroKeyData = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.InitialKeyMacroKeyData
		);
		if (macroKeyData) {
			macroKeyData.macro.interval = intervalStatus;
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.InitialKeyMacroKeyData,
				macroKeyData
			);
		}
	}

	updateMacrokeyInitialKeyDataCache(inputs: any) {
		let macroKeyData = new MacroKeyInputChange();
		macroKeyData = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.InitialKeyMacroKeyData
		);
		macroKeyData.macro.inputs = inputs;
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.InitialKeyMacroKeyData,
			macroKeyData
		);
	}

	// Set Macrokey change status

	setMacrokeyChangeStatusCache(macrokeyStatusType: MacroKeyTypeStatus) {
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.MacroKeyStatus,
			macrokeyStatusType.MacroKeyStatus
		);
	}

	setOnRepeatStatusCache(selectRepeatChange: number, keySelected) {
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.CurrentMacroKeyRepeat,
			selectRepeatChange
		);
		if (keySelected === '0' || keySelected === 'M1') {
			this.updateMacrokeyInitialKeyRepeatDataCache(selectRepeatChange);
		}
	}

	setOnIntervalStatusCache(intervalStatus: number, keySelected) {
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.CurrentMacroKeyInterval,
			intervalStatus
		);
		if (keySelected === '0' || keySelected === 'M1') {
			this.updateMacrokeyInitialKeyIntervalDataCache(intervalStatus);
		}
	}
}
