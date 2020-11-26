import { Injectable } from '@angular/core';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';
import { LoggerService } from '../../logger/logger.service';
import { WinRT } from '@lenovo/tan-client-bridge';

@Injectable({
	providedIn: 'root',
})
export class GamingAccessoryService {
	private gamingAccessory: any;
	// protocol
	private regUtil: any;
	// plugin?
	private systemUpdateBridge: any;
	public isShellAvailable: boolean = false;

	constructor(private shellService: VantageShellService, private logger: LoggerService) {
		this.gamingAccessory = shellService.getGamingAccessory();
		this.regUtil = this.shellService.getRegistryUtil();
		this.systemUpdateBridge = this.shellService.getSystemUpdate();
		if (this.gamingAccessory && this.regUtil) {
			this.isShellAvailable = true;
		}
	}

	public isLACSupportUriProtocol(): Promise<any> {
		if (this.isShellAvailable) {
			return new Promise((resolve) => {
				let regPath =
					'HKEY_LOCAL_MACHINE\\Software\\WOW6432Node\\Lenovo\\Legion Accessory Central';
				try {
					this.regUtil.queryValue(regPath).then((res) => {
						this.logger.info(
							`Service-GamingAccessory-isLACSupportUriProtocol: queryValue return value: ${res}`
						);
						if (res.keyList.length !== 0) {
							resolve(true);
						}
						resolve(false);
					});
				} catch (error) {
					this.logger.error(
						'Service-GamingAccessory-isLACSupportUriProtocol: queryValue fail; Error message: ',
						error.message
					);
					throw new Error(error.message);
				}
			});
		} else {
			this.logger.error(
				`Service-GamingAccessory-isLACSupportUriProtocol: return undefined, shell Available: ${this.isShellAvailable}`
			);
			return undefined;
		}
	}

	launchAccessory(isSupported: any): Promise<any> {
		if (this.isShellAvailable && isSupported) {
			return new Promise(async (resolve) => {
				try {
					// launch win32 app through protocol
					const result = await WinRT.launchUri('legion-accessory-central:');
					this.logger.info(
						`Service-GamingAccessory-launchAccessory: WinRT.launchUri return: ${result}`
					);
					if (result) {
						resolve(true);
					}
				} catch (error) {
					this.logger.error(
						'Service-GamingAccessory-LaunchAccessory: launch fail; Error message: ',
						error.message
					);
					throw new Error(error.message);
				}
				resolve(false);
			});
		} else {
			this.logger.error(
				`Service-GamingAccessory-launchAccessory: return undefined, this.isShellAvailable value: ${this.isShellAvailable}, isSupported value: ${this.isShellAvailable}`
			);
			return undefined;
		}
	}
}
