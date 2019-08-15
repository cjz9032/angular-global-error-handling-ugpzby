import {	Injectable} from '@angular/core';
import {	VantageShellService} from '../vantage-shell/vantage-shell.service';


@Injectable({
	providedIn: 'root'
})
export class HypothesisService {

	private hypSettings: any;

	constructor(
		private shellService: VantageShellService
	) {
		if (!this.hypSettings) {
			this.getHypothesis();
		}
	}

	private getHypothesis() {
		return new Promise((resolve, reject) => {
			try {
				this.shellService.calcDeviceFilter('{"var":"HypothesisGroups"}').then((hyp) => {
						this.hypSettings = hyp;
						resolve();
					},
					error => {
						console.log('getHypothesis:' + error);
						reject(error);
					});
			} catch (ex) {
				console.error('getHypothesis:' + ex.message);
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
						if(this.hypSettings){
							resolve(this.hypSettings[feature]);
						}
						else
						{
							reject('get hypothesis setting failed.');
						}
					},
					error => {
						reject(error);
					});
			}
		});
	}
}
