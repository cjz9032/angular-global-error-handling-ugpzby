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
}
