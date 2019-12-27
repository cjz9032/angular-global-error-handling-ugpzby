import { VantageShellService } from '../../vantage-shell/vantage-shell.service';
import { DevService } from '../../dev/dev.service';
import { TranslateService } from '@ngx-translate/core';


export class UPEHelper {
	constructor(
		private vantageShellService: VantageShellService,
		private devService: DevService,
		private translate: TranslateService
	) {
	}

	public filterUPEContent(results) {
		return new Promise((resolve, reject) => {
			const promises = [];

			results.forEach((result) => {
				promises.push(this.deviceFilter(result.Filters));
			});

			Promise.all(promises).then((deviceFilterValues) => {
				const filteredResults = results.filter((result, index) => {
					return deviceFilterValues[index];
				});

				resolve(filteredResults);
			});
		});
	}

	public deviceFilter(filters) {
		return new Promise((resolve, reject) => {
			if (!filters) {
				this.devService.writeLog('vantageShellService.deviceFilter skipped filter call due to empty filter.');
				return resolve(true);
			}

			return this.vantageShellService.deviceFilter(filters).then(
				(result) => {
					this.devService.writeLog('vantageShellService.deviceFilter ', JSON.stringify(result));
					resolve(result);
				},
				(reason) => {
					this.devService.writeLog('vantageShellService.deviceFilter error', reason);
					resolve(false);
				}
			);
		});
	}

	public getLang() {
		return this.translate.currentLang
			? this.translate.currentLang.toLowerCase()
			: this.translate.defaultLang.toLowerCase();
	}
}
