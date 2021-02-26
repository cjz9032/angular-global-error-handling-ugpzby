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
		const getScanLogPromise = this.hardwareScanBridge.getScanLog();

		// Created a timeout function to return reject if IMController not send any update in 10s
		// Uses this validation to avoid cases that IMController was closed unexpectedly
		const timeoutPromise = new Promise((resolve, reject) => {
			const timeout = setTimeout(() => {
				this.hardwareScanBridge.getScanLog();
				resolve('Timed out after 10s!');
			}, 10000);
		});

		return getScanLogPromise;
	}
}
