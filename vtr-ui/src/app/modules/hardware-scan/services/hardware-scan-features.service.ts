import { EventEmitter, Injectable } from '@angular/core';
import { ScanLogService } from './scan-log.service';

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
			this.scanLogService.getScanLog()
			.then(() => {
				resolve(true);
			})
			.catch(() => {
				resolve(false);
			});
		});
	}
}
