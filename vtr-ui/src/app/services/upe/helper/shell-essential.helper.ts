import { DeviceService } from '../../device/device.service';
import { CommsService } from '../../comms/comms.service';
import { UUID } from 'angular2-uuid';
import { environment } from '../../../../environments/environment';
import { IUpeEssential, IEssentialHelper } from '../model/definitions';
import { DevService } from '../../dev/dev.service';

export class ShellEssentialHelper implements IEssentialHelper {
	private readonly CredNameUPEAPIKey = 'UPEAPIKey';
	private readonly CredNameUPEUserID = 'UPEUserID';

	constructor(
		private commsService: CommsService,
		private deviceService: DeviceService,
		private devService: DevService
	) {
	}

	public async getUpeEssential(): Promise<IUpeEssential> {
		const win: any = window;
		if (!win.VantageStub || !win.VantageStub.getCredential) {
			this.devService.writeLog('[shell essential helper] shell not support credential');
			return null;
		}

		// check client id
		if (!environment.upeClientID || !environment.upeSharedKey) {
			this.devService.writeLog('[shell essential helper] upeClientID/upeSharedKey null');
			return null;
		}

		// get device id
		const deviceInfo = await this.deviceService.getMachineInfo();
		if (!deviceInfo || !deviceInfo.deviceId) {
			this.devService.writeLog('[shell essential helper] get device id null');
			return null;
		}

		// get user id
		let anonUserId = null;
		let cred = win.VantageStub.getCredential(this.CredNameUPEUserID);
		if (cred && cred.password) {
			anonUserId = cred.password.trim();
		}
		// else do nothing

		// get apiKey
		let apiKey = null;
		cred = win.VantageStub.getCredential(this.CredNameUPEAPIKey);
		if (cred && cred.password) {
			apiKey = cred.password.trim();
		}
		// else do nothing

		return {
			anonUserId,
			clientAgentId: environment.upeClientID,
			deviceId: deviceInfo.deviceId,
			apiKey,
			upeUrlBase: environment.upeApiRoot
		};
	}

	public async registerDevice(upeEssential: IUpeEssential): Promise<IUpeEssential> {
		const newEssential = await this.refreshEssential(upeEssential);
		if (!newEssential || !newEssential.apiKeySalt) {
			return null;
		}

		const success = await this.postRegisterRequest(newEssential, newEssential.apiKeySalt);
		if (!success) {
			return null;
		}

		const win: any = window;
		newEssential.apiKey = newEssential.apiKeySalt.hash;
		newEssential.apiKeySalt = null;
		win.VantageStub.createCredential(this.CredNameUPEAPIKey, newEssential.apiKey);

		return newEssential;
	}

	private async postRegisterRequest(upeEssential: IUpeEssential, apiKeyInfo) {
		const queryParams = {
			identity: {
				anonUserId: upeEssential.anonUserId,
				anonDeviceId: upeEssential.deviceId,
				clientAgentId: upeEssential.clientAgentId,
				APIKey: apiKeyInfo.hash
			},
			registration: {
				cnonce: apiKeyInfo.cnonce,
				timeStamp: apiKeyInfo.timestamp
			}
		};

		try {
			const response = await this.commsService.callUpeApi(
				`${upeEssential.upeUrlBase}/upe/auth/registerDevice`, queryParams
			);

			if (response.status === 200) {
				return true;
			} else {
				this.devService.writeLog('[shell essential helper]send register request failed(unknown)');
			}
		} catch (ex) {
			this.devService.writeLog('[shell essential helper]send register request failed', ex);
		}

		return false;
	}

	private async refreshEssential(upeEssential: IUpeEssential): Promise<IUpeEssential> {
		const win: any = window;
		if (!upeEssential.anonUserId) {
			upeEssential.anonUserId = UUID.UUID();
			win.VantageStub.createCredential(this.CredNameUPEUserID, upeEssential.anonUserId);
		}

		if (!upeEssential.apiKey || !upeEssential.apiKeySalt) {
			const apiKeySalt = await this.generateAPIKey(upeEssential) as any;
			if (!apiKeySalt) {
				this.devService.writeLog(`[shell essential helper]generate API Key failed${JSON.stringify(upeEssential)}`);
				return null;
			} else {
				upeEssential.apiKeySalt = JSON.parse(apiKeySalt);
			}
		}

		return upeEssential;
	}

	private getUpeSalt() {
		const factor = environment.upeSharedKey.concat('S00MzU3LTkxOGYtYmNjODZkZjgyNmY5');
		return window.atob(factor);
	}

	private generateAPIKey(upeEssential: IUpeEssential): Promise<any> {
		const salt = this.getUpeSalt();
		const upeConfig = {
			salt,
			userid: upeEssential.anonUserId,
			devid: upeEssential.deviceId,
			agentid: upeEssential.clientAgentId,
		};

		return new Promise((resolve, reject) => {
			const win: any = window;
			win.VantageStub.onupeapikeyfound = (result) => {
				if (result && result.detail && result.detail.length > 0) {
					resolve(result.detail[0]);
				} else {
					resolve(null);
				}
			};
			win.VantageStub.findUPEAPIKey(JSON.stringify(upeConfig));
		});
	}
}
