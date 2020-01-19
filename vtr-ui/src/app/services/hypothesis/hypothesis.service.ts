import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { DevService } from '../dev/dev.service';

declare var window;

@Injectable({
	providedIn: 'root'
})
export class HypothesisService {

	private hypSettings: any;

	constructor(
		private shellService: VantageShellService,
		private devService: DevService
	) {
		this.getHypothesis().catch();
	}

	private getHypothesis() {
		return new Promise((resolve, reject) => {
			if (window.Windows && window.Windows.ApplicationModel.Package.current.id.familyName === 'E046963F.LenovoCompanionBeta_k1h2ywk1493x8') {
				// beta may not support the hypothesis config filter key, and it would block here, if not return immediately, we can treat it as not supported.
				setTimeout(() => reject(new Error('not support in beta')), 2000);
			}
			const filter = this.shellService.calcDeviceFilter('{"var":"HypothesisGroups"}');
			if (filter) {
				filter.then((hyp) => {
					this.hypSettings = hyp;
					resolve();
				},
					error => {
						this.devService.writeLog('getHypothesis: ', error);
						reject(error);
					});
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
						this.devService.writeLog('get hypothesis  getFeatureSetting: ' + JSON.stringify(this.hypSettings[feature]));
					} else {
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

	public getAllSettings() {
		return new Promise((resolve, reject) => {
			if (this.hypSettings) {
				resolve(this.hypSettings);
			} else {
				this.getHypothesis().then(() => {
					if (this.hypSettings) {
						resolve(this.hypSettings);
					} else {
						reject('get all hypothesis settings failed.');
					}
				},
				error => {
					reject(error);
				});
			}
		});
	}
}
