import { Injectable } from '@angular/core';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';

@Injectable({
	providedIn: 'root',
})
export class ScanLogService {
	private hardwareScanBridge: any;

	constructor(shellService: VantageShellService) {
		this.hardwareScanBridge = shellService.getHardwareScan();
		if (!this.hardwareScanBridge) {
			throw new Error('Error: Invalid hardwareScanBridge.');
		}
	}

	public getScanLog(): Promise<any> {
		return this.hardwareScanBridge.getScanLog();
	}
}
