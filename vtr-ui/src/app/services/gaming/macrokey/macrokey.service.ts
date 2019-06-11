import { Injectable } from '@angular/core';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';

@Injectable({
	providedIn: 'root'
})
export class MacrokeyService {
	private macroKey: any;
	public isMacroKeyAvailable: Boolean = false;

	constructor(shellService: VantageShellService) {
		this.macroKey = shellService.getGamingMacroKey();
		if (this.macroKey) {
			this.isMacroKeyAvailable = true;
		}
	}
}
