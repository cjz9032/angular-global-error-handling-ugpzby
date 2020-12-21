import { Injectable } from '@angular/core';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';
import { LoggerService } from '../../logger/logger.service';
import { WinRT } from '@lenovo/tan-client-bridge'

@Injectable({
  providedIn: 'root'
})
export class GamingThirdPartyAppService {
	public isShellAvailable = false;
	// protocol
	private regUtil: any;
  
  private regPath = {
    accessory: 'HKEY_LOCAL_MACHINE\\Software\\WOW6432Node\\Lenovo\\Legion Accessory Central',
    nahimic: `HKEY_CURRENT_USER\\Software\\Classes\\Local Settings\\Software\\Microsoft\\Windows\\CurrentVersion\\AppContainer\\Storage\\a-volute.nahimic_w2gh52qy24etm`,
    xRite: ``
  };
  private protocolUrl = {
    accessory: 'legion-accessory-central:',
    nahimic: `nh3-msi:`,
    xRite: ``
  } 

	constructor(private shellService: VantageShellService, private logger: LoggerService) {
		this.regUtil = this.shellService.getRegistryUtil();
		if (this.regUtil) {
			this.isShellAvailable = true;
		}
	}

	public isLACSupportUriProtocol(key: string): Promise<any> {
		if (this.isShellAvailable) {
			return new Promise((resolve) => {
				try {
					this.regUtil.queryValue(this.regPath[key]).then((res) => {
						this.logger.info(
							`Service-thirdPartyApp-isLACSupportUriProtocol: app is ${key}, queryValue return value: ${res}`
						);
						if (res.keyList.length !== 0) {
							resolve(true);
						}
						resolve(false);
					});
				} catch (error) {
					this.logger.error(
						`Service-thirdPartyApp-isLACSupportUriProtocol: app is ${key}, queryValue fail; Error message: `,
						error.message
					);
					throw new Error(error.message);
				}
			});
		} else {
			this.logger.error(
				`Service-thirdPartyApp-isLACSupportUriProtocol: return undefined, shell Available: ${this.isShellAvailable}`
			);
			return undefined;
		}
	}

	launchThirdPartyApp(isSupported: any, key: string): Promise<any> {
		if (this.isShellAvailable && isSupported) {
			return new Promise(async (resolve) => {
				try {
					// launch win32 app through protocol
					const result = await WinRT.launchUri(this.protocolUrl[key]);
					this.logger.info(
						`Service-thirdPartyApp-launchThirdPartyApp: app is ${key}, WinRT.launchUri return: ${result}`
					);
					if (result) {
						resolve(true);
					}
				} catch (error) {
					this.logger.error(
						`Service-thirdPartyApp-launchThirdPartyApp: app is ${key}, launch fail; Error message: `,
						error.message
					);
					throw new Error(error.message);
				}
				resolve(false);
			});
		} else {
			this.logger.error(
				`Service-thirdPartyApp-launchThirdPartyApp: return undefined, this.isShellAvailable value: ${this.isShellAvailable}, isSupported value: ${this.isShellAvailable}`
			);
			return undefined;
		}
  }
}
