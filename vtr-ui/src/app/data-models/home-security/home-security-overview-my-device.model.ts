import { CHSDevicePosture } from '@lenovo/tan-client-bridge';
import { TranslateService } from '@ngx-translate/core';

export class HomeSecurityOverviewMyDevice {
	deviceName: string;
	devicePostures: CHSDevicePosture[];
	deviceStatus: string;

	constructor (public translate: TranslateService) {
	}

	createHomeDevicePosture(chsDevicePostures: CHSDevicePosture[]) {
		this.devicePostures = chsDevicePostures.map((devicePosture) => {
			return {
				name: this.mappingDevicePosture(devicePosture.name),
				vulnerable: devicePosture.vulnerable
			};
		});
	}

	mappingDevicePosture(config: string): string {
		let title: string;
		config = config.toLowerCase();
		if (config.includes('apps')) {
			title = 'security.homeprotection.securityhealth.deviceName1';
		} else if (config.includes('developer')) {
			title = 'security.homeprotection.securityhealth.deviceName2';
		} else if (config.includes('uac')) {
			title = 'security.homeprotection.securityhealth.deviceName3';
		} else if (config.includes('antivirus')) {
			title = 'security.homeprotection.securityhealth.deviceName4';
		} else if (config.includes('drive')) {
			title = 'security.homeprotection.securityhealth.deviceName5';
		} else if (config.includes('firewall')) {
			title = 'security.homeprotection.securityhealth.deviceName6';
		} else if (config.includes('windows')) {
			title = 'security.homeprotection.securityhealth.deviceName7';
		} else if (config.includes('security')) {
			title = 'security.homeprotection.securityhealth.deviceName8';
		} else if ((config.includes('pin')) || (config.includes('password'))) {
			title = 'security.homeprotection.securityhealth.deviceName9';
		} else if ((config.includes('automatic'))) {
			title = 'security.homeprotection.securityhealth.deviceName10';
		} else {
			title = 'other';
		}
		this.translate.stream(title).subscribe((res) => {
			title = res;
		});
		return title;
	}

	creatDeviceStatus(devicePostures: CHSDevicePosture[]) {
		this.deviceStatus = '';
		if (devicePostures.length !== 0) {
			this.devicePostures.forEach((item) => {
				if (this.deviceStatus !== 'needs attention') {
					if (item.vulnerable === true) {
						this.deviceStatus = 'needs attention';
					} else {
						this.deviceStatus = 'secure';
					}
				}
			});
		}
	}
}

