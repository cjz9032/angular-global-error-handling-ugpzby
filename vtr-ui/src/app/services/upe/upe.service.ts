import {	Injectable} from '@angular/core';
import {	CommsService} from '../comms/comms.service';
import {	CommonService} from '../common/common.service';
import {	DeviceService} from '../device/device.service';
import {	VantageShellService} from '../vantage-shell/vantage-shell.service';
import {	UUID} from 'angular2-uuid';
import {	LocalStorageKey} from '../../enums/local-storage-key.enum';

import {	environment} from '../../../environments/environment';
import { 	NetworkStatus } from 'src/app/enums/network-status.enum';
import { 	Observable } from 'rxjs';
import { 	AppNotification } from 'src/app/data-models/common/app-notification.model';

@Injectable({
	providedIn: 'root'
})

export class UPEService {
	language: string;
	region: string;
	machineInfo: any;

	constructor(
		private commsService: CommsService,
		private commonService: CommonService,
		private vantageShellService: VantageShellService,
		private deviceService: DeviceService
	) {

	}

	deviceFilter(filters) {
		return new Promise((resolve, reject) => {
			if (!filters) {
				console.log('vantageShellService.deviceFilter skipped filter call due to empty filter.');
				return resolve(true);
			}

			return this.vantageShellService.deviceFilter(filters).then(
				(result) => {
					resolve(result);
				},
				(reason) => {
					console.log('vantageShellService.deviceFilter error', reason);
					resolve(false);
				}
			);
		});
	}

	private getUpeAPIKey(forceReg: boolean) {
		return new Promise((resolve, reject) => {
			const upeApiKey = this.commonService.getLocalStorageValue(LocalStorageKey.UPEAPIKey);
			if (!upeApiKey || forceReg) {
				try {
					this.generateAPIKey().then((result) => {
						resolve(result);
					}, error => {
						reject(error);
					});
				} catch (ex) {
					reject(ex);
				}
			} else {
				resolve(upeApiKey);
			}
		});
	}

	private generateAPIKey() {
		const salt = environment.upeSharedKey;
		const anonUserID = this.getUPEUserID(LocalStorageKey.UPEUserID);
		const anonDeviceId = this.deviceService.getMachineInfoSync().deviceId;
		const clientAgentId = environment.upeClientID;
		const timeStamp = new Date().toISOString().replace(/[-:]/ig, '').replace(/\.\d+Z/ig, 'Z');

		const upeConfig = {
			salt,
			userid: anonUserID,
			devid: anonDeviceId,
			agentid: clientAgentId,
		};

		return new Promise((resolve, reject) => {
			const win: any = window;
			if (win.VantageStub) {
				win.VantageStub.onupeapikeyfound = (result) => {
					this.registerDeviceToUPEServer(JSON.parse(result)).then((data: any) => {
						if (data) {
							this.commonService.setLocalStorageValue(LocalStorageKey.UPEAPIKey, data);
							resolve(data);
						} else {
							console.log('register UPE Server failed.');
							reject(result);
						}
					}, error => {
						console.log('register UPE Server:' + error);
						reject(error);
					});
				};

				win.VantageStub.findUPEAPIKey(JSON.stringify(upeConfig));
			}
		});
	}

	private registerDeviceToUPEServer(regData) {
		const queryParams = {
			identity: {
				anonUserId: this.getUPEUserID(LocalStorageKey.UPEUserID),
				anonDeviceId: this.deviceService.getMachineInfoSync().deviceId,
				clientAgentId: environment.upeClientID,
				APIKey: regData.hash
			},
			registration: {
				cnonce: regData.cnonce,
				timeStamp: regData.timestamp
			}
		};


		return new Promise((resolve, reject) => {
			this.commsService.callUpeApi(
				'/upe/auth/registerDevice', queryParams, {}
			).subscribe((response: any) => {
					if (response.status === 200) {
						resolve(regData.hash);
					} else {
						reject(response.status + ' ' + response.statusText);
					}
				},
				error => {
					console.log('registerDeviceToUPEServer error', error);
					reject('registerDeviceToUPEServer error');
				});
		});
	}

	private getUPEUserID(IDKey) {
		let uuid = this.commonService.getLocalStorageValue(IDKey);
		if (!uuid) {
			uuid = UUID.UUID();
			this.commonService.setLocalStorageValue(IDKey, uuid);
		}
		return uuid;
	}

	fetchUPEContent(params) {
		return new Observable(subscriber => {
			if (this.commonService.isOnline) {
				this.getUPEContent(params, subscriber);
			} else {
				this.commonService.notification.subscribe((notification: AppNotification) => {
					if (notification && notification.type === NetworkStatus.Online) {
						this.getUPEContent(params, subscriber);
					}
				});
			}
		});
	}

	getUPEContent(params, subscriber) {
		this.getUpeAPIKey(false).then((apiKey) => {
			const queryParam = this.makeQueryParam(apiKey, params);
			this.commsService.callUpeApi(
				'/upe/recommendation/recommends', queryParam, {}
			).subscribe((response: any) => {
					if (response.status === 200) {
						subscriber.next(response.body.results);
						subscriber.complete();
					} else {
						subscriber.error(response.status + ' ' + response.statusText);
					}
				},
				(reason) => {
					if (reason.status === 401) {
						this.getUpeAPIKey(true);
					}
					console.log('getUPEContent error', reason);
					subscriber.error(reason);
				}
			);
		});
	}

	makeQueryParam(apiKey, upeParams) {
		const devID = this.deviceService.getMachineInfoSync().deviceId;
		const queryParam = {
			identity: {
				anonUserId: this.getUPEUserID(LocalStorageKey.UPEUserID),
				anonDeviceId: devID,
				clientAgentId: environment.upeClientID,
				APIKey: apiKey,
			},
			dId: devID,
			context: {
				// lang: this.language,
				// geo: this.region,
				category: this.deviceService.getMachineInfoSync().isGaming ? 'game' : '',
				position: upeParams.position
			},
			recommendSize: 1
		};
		return queryParam;
	}

	filterUPEContent(results) {
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

	getOneUPEContent(results, template, position) {
		return results.filter((record) => {
			return record.Template === template;
		}).filter((record) => {
			return record.Position === position;
		}).sort((a, b) => a.Priority.localeCompare(b.Priority));
	}
}
