import { DevicePosture, DeviceCondition } from '@lenovo/tan-client-bridge';
import { TranslateService } from '@ngx-translate/core';
import { WindowsVersionService } from 'src/app/services/windows-version/windows-version.service';
import { Status } from '../widgets/status.model';

export class HomeSecurityDevicePosture {
	homeDevicePosture: Status[] = [];

	constructor(
		private windowsVersionService: WindowsVersionService,
		devicePosture?: DevicePosture,
		cacheDevicePosture?: HomeSecurityDevicePosture,
		public translate?: TranslateService
	) {
		if (devicePosture && Array.isArray(devicePosture.value) && devicePosture.value.length > 0) {
			if (cacheDevicePosture) {
				this.createHomeDevicePosture(devicePosture.value, cacheDevicePosture);
			} else {
				this.createHomeDevicePosture(devicePosture.value);
			}
		}
	}

	createHomeDevicePosture(
		devicePosture: DeviceCondition[],
		cacheDevicePosture?: HomeSecurityDevicePosture
	) {
		const devicePostures = this.initDevicePosture();
		devicePosture.forEach((item) => {
			this.mappingDevicePosture(devicePostures, item);
		});
		if (devicePostures[0].status === 'loading') {
			if (
				cacheDevicePosture &&
				cacheDevicePosture.homeDevicePosture[0].status !== 'loadFailed'
			) {
				devicePostures[0] = cacheDevicePosture.homeDevicePosture[0];
			} else {
				devicePostures[0].isHidden = true;
			}
		}
		this.homeDevicePosture = devicePostures;
	}

	mappingDevicePosture(devicePostures: Status[], item: DeviceCondition) {
		const config = item.name.toLowerCase();
		if (config.indexOf('pin') !== -1 || config.indexOf('password') !== -1) {
			this.assignValue(devicePostures, item.vulnerable, 0);
		} else if (config.indexOf('drive') !== -1) {
			this.assignValue(devicePostures, item.vulnerable, 1);
		} else if (config.indexOf('antivirus') !== -1) {
			this.assignValue(devicePostures, item.vulnerable, 2);
		} else if (config.indexOf('firewall') !== -1) {
			this.assignValue(devicePostures, item.vulnerable, 3);
		} else if (config.indexOf('apps') !== -1) {
			this.assignValue(devicePostures, item.vulnerable, 4);
			devicePostures[4].isHidden = !this.windowsVersionService.isOlderThan20H1();
		} else if (config.indexOf('developer') !== -1) {
			this.assignValue(devicePostures, item.vulnerable, 5);
		} else if (config.indexOf('windows') !== -1) {
			this.assignValue(devicePostures, item.vulnerable, 6);
		}
	}

	assignValue(devicePostures: Status[], vulnerable: boolean, index: number) {
		devicePostures[index].status = vulnerable === true ? 'disabled' : 'installState';
		devicePostures[index].detail =
			vulnerable === true
				? 'security.homeprotection.securityhealth.fail'
				: 'security.homeprotection.securityhealth.pass';
		this.translate.stream(devicePostures[index].detail).subscribe((res) => {
			devicePostures[index].detail = res;
		});
	}

	initDevicePosture(): Status[] {
		const titles = [
			'security.homeprotection.securityhealth.deviceName9',
			'security.homeprotection.securityhealth.deviceName5',
			'security.homeprotection.securityhealth.deviceName4',
			'security.homeprotection.securityhealth.deviceName6',
			'security.homeprotection.securityhealth.deviceName1',
			'security.homeprotection.securityhealth.deviceName2',
			'security.homeprotection.securityhealth.deviceName7',
		];
		const devicePostures: Status[] = titles.map((value) => {
			this.translate.stream(value).subscribe((res) => {
				value = res;
			});
			return {
				status: 'loading',
				detail: '',
				path: 'home-security',
				type: 'security',
				title: value,
				isHidden: false,
				id: 'home-security-device-posture',
			};
		});
		return devicePostures;
	}
}
