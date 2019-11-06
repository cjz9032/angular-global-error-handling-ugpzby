import { Injectable } from '@angular/core';
import { MyDevice } from 'src/app/data-models/device/my-device.model';
import WinRT from '@lenovo/tan-client-bridge/src/util/winrt';
import { CommonService } from '../common/common.service';
import { Microphone } from 'src/app/data-models/audio/microphone.model';
import { DeviceMonitorStatus } from 'src/app/enums/device-monitor-status.enum';
import { Router } from '@angular/router';
import { AndroidService } from '../android/android.service';
import { HypothesisService } from '../hypothesis/hypothesis.service';
import { LoggerService } from '../logger/logger.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';

@Injectable({
	providedIn: 'root'
})
export class DeviceService {
	private device: any;
	private sysInfo: any;
	private microphone: any;
	public isShellAvailable = false;
	public isArm = false;
	public isAndroid = false;
	public is64bit = true;
	public showPrivacy = false;
	public isGaming = false;
	public isSMode = false;
	public showWarranty = false;
	private isGamingDashboardLoaded = false;
	public machineInfo: any;
	public showSearch = false;
	constructor(
		private shellService: VantageShellService,
		private commonService: CommonService,
		public androidService: AndroidService,
		private router: Router,
		private logger: LoggerService,
		private hypSettings: HypothesisService) {
		this.device = shellService.getDevice();
		this.sysInfo = shellService.getSysinfo();
		this.microphone = shellService.getMicrophoneSettings();

		if (this.device && this.sysInfo) {
			this.isShellAvailable = true;
		}
		this.initIsArm();
		this.initshowPrivacy();
		this.initShowSearch();
	}

	private initIsArm() {
		try {
			this.getIsARM()
				.then((status: boolean) => {
					this.isArm = status;
				}).catch(error => {
					this.logger.error('initArm', error.message);
					return false;
				});
		} catch (error) {
			this.logger.error('initArm' + error.message);
			return false;
		}
	}

	public async getIsARM(): Promise<boolean> {
		let isArm = false;
		this.isAndroid = this.androidService.isAndroid;
		if (this.isAndroid) {
			return true;
		}
		try {
			if (this.isShellAvailable) {
				const machineInfo = await this.getMachineInfo();
				isArm = this.isAndroid || machineInfo.cpuArchitecture.toUpperCase().trim() === 'ARM64';
				return isArm;
			}
		} catch (error) {
			this.logger.error('getIsARM' + error.message);
			return isArm;
		}
	}

	private initshowPrivacy() {
		// set this.showPrivacy appropriately based on machineInfo data
		if (this.hypSettings) {
			this.hypSettings.getFeatureSetting('PrivacyTab').then((privacy) => {
				this.showPrivacy = (privacy === 'enabled');
			}, (error) => {
				this.logger.error('DeviceService.initshowPrivacy: promise rejected ', error);
			});
		}
	}

	private initShowSearch() {
		if (this.hypSettings) {
			this.hypSettings.getFeatureSetting('FeatureSearch').then((searchFeature) => {
				this.showSearch = ((searchFeature || '').toString() === 'true');
			}, (error) => {
				this.logger.error('DeviceService.initShowSearch: promise rejected ', error);
			});
		}
	}

	public getDeviceInfo(): Promise<MyDevice> {
		if (this.device) {
			return this.device.getDeviceInfo();
		}
		return undefined;
	}

	// this API doesn't have performance issue, can be always called at any time.
	getMachineInfo(): Promise<any> {
		this.logger.debug('DeviceService.getMachineInfo: pre API call');
		if (this.machineInfo) {
			this.logger.debug('DeviceService.getMachineInfo: found cached response');
			this.commonService.sendNotification('MachineInfo', this.machineInfo);
			return Promise.resolve(this.machineInfo);
		}

		if (this.isShellAvailable && this.sysInfo) {
			this.logger.debug('DeviceService.getMachineInfo: no cache, invoking API');

			return this.sysInfo.getMachineInfo()
				.then((info) => {
					this.logger.debug('DeviceService.getMachineInfo: response received from API');
					this.machineInfo = info;
					this.isSMode = info.isSMode;
					this.isGaming = info.isGaming;
					if (!this.showWarranty && (!info.mtm || (info.mtm && info.mtm.substring(info.mtm.length - 2).toLocaleLowerCase() !== 'cd'))) {
						this.showWarranty = true;
					}
					if (info && info.cpuArchitecture) {
						if (info.cpuArchitecture.indexOf('64') === -1) {
							this.is64bit = false;
						} else {
							this.is64bit = true;
						}
					}
					this.commonService.sendNotification('MachineInfo', this.machineInfo);
					this.logger.debug('DeviceService.getMachineInfo: returning response from API');
					return info;
				});
		}
		return Promise.resolve(undefined);
	}

	getMachineInfoSync(): any {
		return this.machineInfo;
	}

	getHardwareInfo(): Promise<any> {
		if (this.sysInfo) {
			return this.sysInfo.getHardwareInfo();
		}
		return undefined;
	}

	getMemAndDiskUsage(): Promise<any> {
		if (this.sysInfo) {
			return this.sysInfo.getMemAndDiskUsage();
		}
		return undefined;
	}

	public launchUri(path: string) {
		if (WinRT.launchUri && path) {
			WinRT.launchUri(path);
		}
	}

	public startMicrophoneMonitor() {
		if (this.microphone) {
			this.microphone.startMonitor((response: Microphone) => {
				this.commonService.sendNotification(DeviceMonitorStatus.MicrophoneStatus, response);
			});
		}
	}

	public stopMicrophoneMonitor() {
		if (this.microphone) {
			// this.microphone.stopMonitor((response) => {
			// 	console.log('stopMicrophoneMonitor', response);
			// });
		}
	}

	getMachineType(): Promise<number> {
		if (this.sysInfo) {
			return this.sysInfo.getMachineType();
		}
		return undefined;
	}
}
