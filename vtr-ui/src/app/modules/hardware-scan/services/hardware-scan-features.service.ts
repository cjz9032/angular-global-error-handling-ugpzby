import { EventEmitter, Injectable } from '@angular/core';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { ScanLogService } from './scan-log.service';

@Injectable({
	providedIn: 'root',
})
export class HardwareScanFeaturesService {
	private exportLogAvailable = false;

	public get isExportLogAvailable(): boolean {
		return this.exportLogAvailable;
	}
	public featuresChecked: EventEmitter<void> = new EventEmitter();

	constructor(private scanLogService: ScanLogService, private logger: LoggerService) {}

	public async startCheckFeatures(isRecover = false) {
		const checkExportFeature = this.checkExportLogAvailable(isRecover).then((available) => {
			this.exportLogAvailable = available;
		});

		// When angular gets updated this call should be Promise.allSettled
		await Promise.all([checkExportFeature]).then(() => {
			this.featuresChecked.emit();
		});
	}

	private checkExportLogAvailable(isRecover: boolean) {
		return new Promise<boolean>((resolve) => {
			this.scanLogService
				.getScanLog()
				.then((response) => {
					// Checking if there is actually data to be exported
					if (
						(!isRecover &&
							Array.isArray(response.modulesResults) &&
							response.modulesResults.length &&
							response.scanSummary !== null) ||
						isRecover
					) {
						resolve(true);
					}

					resolve(false);
				})
				.catch((error) => {
					this.logger.exception(
						'[HardwareScanFeatureService] checkExportLogAvailable',
						error
					);

					resolve(false);
				});
		});
	}
}
