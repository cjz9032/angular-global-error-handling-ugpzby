import { Injectable } from '@angular/core';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';
import { promise } from 'protractor';
import { BehaviorSubject } from 'rxjs';
@Injectable({
	providedIn: 'root'
})
export class GamingAllCapabilitiesService {
	private gamingAllCapabilities: any;
	public isShellAvailable = false;
	public gamingCapablityValues = new BehaviorSubject(undefined);
	constructor(shellService: VantageShellService) {
		this.gamingAllCapabilities = shellService.getGamingAllCapabilities();
		if (this.gamingAllCapabilities) {
			this.isShellAvailable = true;
		}
	}

	getCapabilities(): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.gamingAllCapabilities.getCapabilities();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	setCapabilityValuesGlobally(capabilities: any) {
		this.gamingCapablityValues.next(capabilities);
	}
}
