import { Injectable } from '@angular/core';
import { CommsService } from '../comms/comms.service';
import { CommonService } from '../common/common.service';
import { DeviceService } from '../device/device.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { UUID } from 'angular2-uuid';
import { LocalStorageKey } from '../../enums/local-storage-key.enum';

import { environment } from '../../../environments/environment';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { Observable } from 'rxjs';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { DevService } from '../dev/dev.service';

@Injectable({
	providedIn: 'root'
})

export class UPEService {
	private readonly CredNameUPEAPIKey = 'UPEAPIKey';
	private readonly CredNameUPEUserID = 'UPEUserID';
	private forceRegister = false;
	private upeUserID = '';
	private regRetryCount = 0;

	constructor(
		private commsService: CommsService,
		private commonService: CommonService,
		private vantageShellService: VantageShellService,
		private deviceService: DeviceService,
		private devService: DevService
	) {
		this.upeUserID = this.getUPEUserID();
	}

	deviceFilter(filters) {
		return new Promise((resolve, reject) => {
			if (!filters) {
				console.log('vantageShellService.deviceFilter skipped filter call due to empty filter.');
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
					console.log('vantageShellService.deviceFilter error', reason);
					resolve(false);
				}
			);
		});
	}

	private getUpeAPIKey(forceReg: boolean) {
		return new Promise((resolve, reject) => {
			const win: any = window;
			let cred = null;
			if (win.VantageStub && win.VantageStub.getCredential) {
				cred = win.VantageStub.getCredential(this.CredNameUPEAPIKey);
			}

			if (!cred || forceReg) {
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
				resolve(cred.password);
			}
		});
	}

	private generateAPIKey() {
		const salt = window.atob(environment.upeSharedKey);
		const anonUserID = this.upeUserID;
		const anonDeviceId = this.deviceService.getMachineInfoSync().deviceId;
		const clientAgentId = environment.upeClientID;
		// const timeStamp = new Date().toISOString().replace(/[-:]/ig, '').replace(/\.\d+Z/ig, 'Z');

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
							win.VantageStub.createCredential(this.CredNameUPEAPIKey, data);
							this.forceRegister = false;
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
				anonUserId: this.upeUserID,
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

	private getUPEUserID() {
		const win: any = window;
		let uuid;
		if (win.VantageStub && win.VantageStub.getCredential) {
			const cred = win.VantageStub.getCredential(this.CredNameUPEUserID);
			if (cred) {
				uuid = cred.password;
				this.forceRegister = false;
			} else {
				uuid = UUID.UUID();
				win.VantageStub.createCredential(this.CredNameUPEUserID, uuid);
				this.forceRegister = true;
			}
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
		this.getUpeAPIKey(this.forceRegister).then((apiKey) => {
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
					if (this.regRetryCount < 2) {
						this.forceRegister = true;
						this.getUPEContent(params, subscriber);
					}
					this.regRetryCount++;
				}
				if (reason.status !== 401 || this.regRetryCount >= 2) {
					console.log('getUPEContent error', reason);
					subscriber.error(reason);
				}
			});
		});
	}

	makeQueryParam(apiKey, upeParams) {
		const devID = this.deviceService.getMachineInfoSync().deviceId;
		const queryParam = {
			identity: {
				anonUserId: this.upeUserID,
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
