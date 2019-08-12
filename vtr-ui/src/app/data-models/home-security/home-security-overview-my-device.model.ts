import { CHSDevicePosture, CHSDeviceOverview } from '@lenovo/tan-client-bridge';
import { TranslateService } from '@ngx-translate/core';

export class HomeSecurityOverviewMyDevice {
	deviceName: string;
	devicePostures: CHSDevicePosture[];
	deviceStatus: string;

	constructor(overview?: CHSDeviceOverview) {
		if (!overview) { return; }
		if (overview.myDevice && overview.myDevice.name) {
			this.deviceName = overview.myDevice.name;
		}
		if (overview.devicePostures && overview.devicePostures.value.length > 0) {
			this.createHomeDevicePosture(overview.devicePostures.value);
			this.creatDeviceStatus(overview.devicePostures.value);
		}
	}

	createHomeDevicePosture(chsDevicePostures: CHSDevicePosture[]) {
		this.devicePostures = chsDevicePostures.map((devicePosture) => {
			return {
				name: this.mappingDevicePosture(devicePosture),
				vulnerable: devicePosture.vulnerable
			};
		});
	}

	mappingDevicePosture(devicePosture: CHSDevicePosture) {
		let title: string;
		const config = devicePosture.name.toLowerCase();
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

