import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { DevService } from '../dev/dev.service';


@Injectable({
	providedIn: 'root'
})
export class HypothesisService {

	private hypSettings: any;

	constructor(
		private shellService: VantageShellService,
		private devService: DevService
	) {
		if (!this.hypSettings) {
			this.getHypothesis();
		}
	}

	private getHypothesis() {
		return new Promise((resolve, reject) => {
			try {
				const filter = this.shellService.calcDeviceFilter('{"var":"HypothesisGroups"}');
				this.devService.writeLog('getHypothesis filter: ', filter);
				if (filter) {
					filter.then((hyp) => {
						this.hypSettings = hyp;
						resolve();
					},
						error => {
							console.log('getHypothesis:' + error);
							this.devService.writeLog('getHypothesis: ', error);

							reject(error);
						});
				}
				else {
					reject('getHypothesis failed');
					this.devService.writeLog('getHypothesis failed: ');
				}
			} catch (ex) {
				console.log('getHypothesis:' + ex.message);
				this.devService.writeLog('getHypothesis: ' + ex.message);
				reject(ex);
			}
		});
	}

	public getFeatureSetting(feature) {
		return new Promise((resolve, reject) => {
			if (this.hypSettings) {
				resolve(this.hypSettings[feature]);
			} else {
				this.getHypothesis().then(() => {
					if (this.hypSettings) {
						resolve(this.hypSettings[feature]);
						this.devService.writeLog('get hypothesis  getFeatureSetting: ' + this.hypSettings[feature]);
					}
					else {
						this.devService.writeLog('get hypothesis  getFeatureSetting: setting failed.');
						reject('get hypothesis setting failed.');
					}
				},
					error => {
						reject(error);
						this.devService.writeLog('get hypothesis  getFeatureSetting: setting failed.' + error);
					});
			}
		});
	}
}
