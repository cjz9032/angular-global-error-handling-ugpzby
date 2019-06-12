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

	public clearMacroKey(macroKey: string): Promise<any> {
		try {
			if (this.isMacroKeyAvailable) {
				console.log('Deleting the following macro key ---->', macroKey);
				return this.macroKey.setClear(macroKey);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
}
