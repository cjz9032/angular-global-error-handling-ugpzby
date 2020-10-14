import { EventEmitter, Injectable } from '@angular/core';
import { ScanLogService } from './scan-log.service';
import { CommonService } from 'src/app/services/common/common.service';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';

@Injectable({
	providedIn: 'root'
})
export class HardwareScanFeaturesService {

	private exportLogAvailable = false;

	public get isExportLogAvailable(): boolean {
		return this.exportLogAvailable;
	}
	public featuresChecked: EventEmitter<void> = new EventEmitter();

	constructor(
		private scanLogService: ScanLogService,
		private commonService: CommonService
	) {
		this.startCheckFeatures();
	}

	private async startCheckFeatures() {
		const checkExportFeature = this.checkExportLogAvailable().then((available) => {
			this.exportLogAvailable = available;
		});

		// When angular gets updated this call should be Promise.allSettled
		Promise.all([checkExportFeature]).then(() => {
			this.featuresChecked.emit();
		});
	}

	private checkExportLogAvailable() {
		return new Promise<boolean>((resolve) => {
			let hasExportLogData = false;
			this.scanLogService.getScanLog()
			.then((response) => {
				// Checking if there is actually data to be exported
				if (response.modulesResults.length > 0 && response.scanSummary !== null) {
					hasExportLogData = true;
				}
				resolve(true);
			})
			.catch(() => {
				resolve(false);
			})
			.finally(() => {
				this.commonService.setSessionStorageValue(SessionStorageKey.HwScanHasExportLogData, hasExportLogData);
			});
		});
	}
}
