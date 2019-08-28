import { CHSDeviceOverview, DevicePosture, DeviceCondition } from '@lenovo/tan-client-bridge';

export class HomeSecurityOverviewMyDevice {
	deviceName: string;
	devicePosture: DeviceCondition[];
	deviceStatus: string;

	constructor(overview?: CHSDeviceOverview, devicePosture?: DevicePosture) {
		if (!overview) { return; }
		if (overview.myDevice && overview.myDevice.name) {
			this.deviceName = overview.myDevice.name;
		}
		if (devicePosture && devicePosture.value.length > 0) {
			this.createHomeDevicePosture(devicePosture.value);
			this.creatDeviceStatus(devicePosture.value);
		}
	}

	createHomeDevicePosture(devicePosture: DeviceCondition[]) {
		this.devicePosture = devicePosture.map((deviceCondition) => {
			return {
				name: this.mappingDevicePosture(deviceCondition),
				vulnerable: deviceCondition.vulnerable
			};
		});
	}

	mappingDevicePosture(deviceCondition: DeviceCondition) {
		let title: string;
		const config = deviceCondition.name.toLowerCase();
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

	creatDeviceStatus(devicePosture: DeviceCondition[]) {
		this.deviceStatus = '';
		if (devicePosture.length !== 0) {
			this.devicePosture.forEach((item) => {
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

