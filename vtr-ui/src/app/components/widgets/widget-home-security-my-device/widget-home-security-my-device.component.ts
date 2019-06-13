import { Component, OnInit, Input, EventEmitter, NgZone } from '@angular/core';
import { MyDevice } from 'src/app/data-models/device/my-device.model';
import { SecurityAdvisor, HomeProtection, EventTypes, DeviceInfo } from '@lenovo/tan-client-bridge';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';
import { DeviceService } from 'src/app/services/device/device.service';


interface DevicePostureDetail {
	status: number; // 1:success,2:fail
	title: string; // name
}

@Component({
	selector: 'vtr-widget-home-security-my-device',
	templateUrl: './widget-home-security-my-device.component.html',
	styleUrls: ['./widget-home-security-my-device.component.scss']
})

export class WidgetHomeSecurityMyDeviceComponent implements OnInit {
	@Input() deviceStatus: string; // secure, needs attention
	myDevice: MyDevice;
	devicePosture: Array<DevicePostureDetail>  = [];
	deviceName: string;
	event = new EventEmitter();
	securityAdvisor: SecurityAdvisor;
	homeProtection: HomeProtection;


	constructor(
		private ngZone: NgZone,
		public shellService: VantageShellService,
		private commonService: CommonService,
		public translate: TranslateService,
		private deviceService: DeviceService
		) {
		this.securityAdvisor = shellService.getSecurityAdvisor();
		this.homeProtection = this.securityAdvisor.homeProtection;
		const cacheHomeDevicePosture = commonService.getLocalStorageValue(LocalStorageKey.HomeProtectionDevicePosture);
		const cacheHomeDeviceName = commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityDeviceName);
		this.myDevice = new MyDevice();
		if (cacheHomeDeviceName) {
			this.deviceName = cacheHomeDeviceName;
		}
		if (this.homeProtection.devicePosture && this.homeProtection.devicePosture.length !== 0) {
			this.ngZone.run(() => {
				commonService.setLocalStorageValue(LocalStorageKey.HomeProtectionDevicePosture, this.homeProtection.devicePosture);
				this.createHomeDevicePosture(this.homeProtection.devicePosture);
			});
		} else if (cacheHomeDevicePosture && cacheHomeDevicePosture.length !== 0) {
			this.ngZone.run(() => {
				this.createHomeDevicePosture(cacheHomeDevicePosture);
			});
		}
		this.homeProtection.on(EventTypes.homeDevicePostureEvent, (value) => {
			this.ngZone.run(() => {
				if (value && value.length !== 0) {
					commonService.setLocalStorageValue(LocalStorageKey.HomeProtectionDevicePosture, value);
					this.createHomeDevicePosture(value);
				}
			});
		});
	}

	ngOnInit() {
		this.event = new EventEmitter();
		this.getDeviceInfo();
	}


	private getDeviceInfo() {
		if (this.deviceService.isShellAvailable) {
			this.deviceService.getDeviceInfo()
				.then((value: any) => {
					this.ngZone.run(() => {
						if (!value || !value.family) {
							return false;
						}
						this.myDevice = value;
						if (this.myDevice.family.length > 20) {
							this.deviceName = `${this.myDevice.family.slice(0, 17)}...`;
						} else {
							this.deviceName = this.myDevice.family;
						}
						this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityDeviceName, this.deviceName);
					});
				}).catch(error => {
					console.error('getDeviceInfo', error);
				});
		}
	}

	createHomeDevicePosture(devicePosture: Array<DeviceInfo>) {
		this.devicePosture = [];
		devicePosture.forEach((item) => {
			const it: DevicePostureDetail = {
				status: 0,
				title: '',
			};
			it.status = item.vulnerable === 'true' ? 2 : 1;
			it.title = this.mappingDevicePosture(item.config);
			if (it.title !== 'other') {
				this.devicePosture.push(it);
			}
		});
		this.creatDeviceStatus(this.devicePosture);
	}

	mappingDevicePosture(config: string): string {
		let titles: Array<string>;
		let title: string;
		titles = [
			'security.homeprotection.securityhealth.deviceName1',
			'security.homeprotection.securityhealth.deviceName2',
			'security.homeprotection.securityhealth.deviceName3',
			'security.homeprotection.securityhealth.deviceName4',
			'security.homeprotection.securityhealth.deviceName5',
			'security.homeprotection.securityhealth.deviceName6',
			'security.homeprotection.securityhealth.deviceName7',
			'security.homeprotection.securityhealth.deviceName8',
			'security.homeprotection.securityhealth.deviceName9',
			'security.homeprotection.securityhealth.deviceName10'
		];
		config = config.toLowerCase();
		if (config.indexOf('apps') !== -1) {
			title = titles[0];
		} else if (config.indexOf('developer') !== -1) {
			title = titles[1];
		} else if (config.indexOf('uac') !== -1) {
			title = titles[2];
		} else if (config.indexOf('antivirus') !== -1) {
			title = titles[3];
		} else if (config.indexOf('drive') !== -1) {
			title = titles[4];
		} else if (config.indexOf('firewall') !== -1) {
			title = titles[5];
		} else if (config.indexOf('windows') !== -1) {
			title = titles[6];
		} else if (config.indexOf('security') !== -1) {
			title = titles[7];
		} else if ((config.indexOf('pin') !== -1) || (config.indexOf('password') !== -1)) {
			title = titles[8];
		} else if ((config.indexOf('automatic') !== -1)) {
			title = titles[9];
		} else {
			title = 'other';
		}
		this.translate.stream(title).subscribe((res) => {
			title = res;
		});
		return title;
	}

	creatDeviceStatus(devicePosture: Array<DevicePostureDetail>) {
		this.deviceStatus = '';
		if (devicePosture.length !== 0) {
			this.devicePosture.forEach((item) => {
				if (this.deviceStatus !== 'needs attention') {
					if (item.status === 2) {
						this.deviceStatus = 'needs attention';
					} else {
						this.deviceStatus = 'secure';
					}
				}
			});
		}
	}
}
