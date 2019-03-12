// below line is needed for js intellisense
/// <reference path='../../../../node_modules/@lenovo/tan-client-bridge/src/features/dashboard-feature.js' />

import { Injectable } from '@angular/core';

import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';

@Injectable({
	providedIn: 'root'
})
export class SupportService {
	private sysinfo: any;
	private warranty: any;
	// public isShellAvailable = false;
	constructor(shellService: VantageShellService) {
		this.sysinfo = shellService.getSysinfo();
		this.warranty = shellService.getWarranty();
		// if (this.sysinfo && this.warranty) {
		// 	this.isShellAvailable = true;
		// }
	}

	public getMachineInfo(): Promise<any> {
		if (this.sysinfo) {
			return this.sysinfo.getMachineInfo();
		}
		return undefined;
	}

	public getWarranty(serialnumber: string): Promise<any> {
		if (this.warranty) {
			return this.warranty.getWarrantyInformation(serialnumber);
		}
	}
}
