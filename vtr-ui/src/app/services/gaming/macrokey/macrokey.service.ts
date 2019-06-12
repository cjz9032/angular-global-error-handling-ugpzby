import { Injectable } from '@angular/core';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';

@Injectable({
	providedIn: 'root'
})
export class MacrokeyService {
	private macroKey: any;
	public isMacroKeyAvailable: Boolean = false;

	constructor(private shellService: VantageShellService) {
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
}
