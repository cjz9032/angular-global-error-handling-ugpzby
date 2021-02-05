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
import { resolve } from 'url';
import { LocalCacheService } from '../local-cache/local-cache.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { smbMachines } from 'src/assets/smb-machine/smb-machines';

@Injectable({
	providedIn: 'root',
})
export class DeviceService {
	private device: any;
	private sysInfo: any;
	private microphone: any;
	public isShellAvailable = false;
	public isArm = false;
	private isInitArm = false;
	public isAndroid = false;
	public is64bit = true;
	public isGaming = false;
	public isLiteGaming = false;
	public isSMode = false;
	public isSMB = false;
	public supportCreatorSettings = false;
	public supportColorCalibration = false;
	public supportEasyRendering = false;
	public supportSmartAppearance = false;
	public showWarranty = false;
	private isGamingDashboardLoaded = false;
	public machineInfo: any;
	public showSearch = false;
	public machineType: number;
	private Windows: any;
	constructor(
		private shellService: VantageShellService,
		private commonService: CommonService,
		public androidService: AndroidService,
		private router: Router,
		private logger: LoggerService,
		private hypSettings: HypothesisService,
		private localCacheService: LocalCacheService
	) {
		this.device = shellService.getDevice();
		this.sysInfo = shellService.getSysinfo();
		this.microphone = shellService.getMicrophoneSettings();
		this.Windows = this.shellService.getWindows();
		if (this.device && this.sysInfo) {
			this.isShellAvailable = true;
		}
		this.initShowSearch();
	}

	public initIsArm() {
		if (this.isInitArm) {
			return Promise.resolve(this.isArm);
		}
		this.isAndroid = this.androidService.isAndroid;
		if (this.isAndroid) {
			return Promise.resolve(true);
		}
		if (this.isShellAvailable) {
			return this.getMachineInfo()
				.then((res) => {
					this.isArm =
						this.isAndroid ||
						(res &&
							res.cpuArchitecture &&
							res.cpuArchitecture.toUpperCase().trim() === 'ARM64');
					this.isInitArm = true;
					return this.isArm;
				})
				.catch((error) => {
					this.logger.error('getIsARM' + error.message);
					return this.isArm;
				});
		}
	}

	public getDeviceInfo(): Promise<MyDevice> {
		if (this.device) {
			return this.device.getDeviceInfo();
		}
		return undefined;
	}

	private identifySMBMachine(machineFamilyName) {
		if (machineFamilyName.match(/^(thinkbook)/) || machineFamilyName.match(/^(thinkpad e)/)) {
			this.isSMB = true;
			const trimedFamilyName = machineFamilyName.trim().toLowerCase();
			if (smbMachines.creatorSettings.includes(trimedFamilyName)) {
				this.supportCreatorSettings = true;
			}

			if (smbMachines.easyRendering.includes(trimedFamilyName)) {
				this.supportEasyRendering = true;
			}

			if (smbMachines.colorCalibration.includes(trimedFamilyName)) {
				this.supportColorCalibration = true;
			}

			if (smbMachines.smartAppearance.includes(trimedFamilyName)) {
				this.supportSmartAppearance = true;
			}
		}
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

			return this.sysInfo.getMachineInfo().then((info) => {
				this.logger.debug('DeviceService.getMachineInfo: response received from API');
				this.machineInfo = info;
				this.isSMode = info.isSMode;
				this.isGaming = info.isGaming;
				if (info.family) {
					this.identifySMBMachine(info.family.toLowerCase());
				}

				if (
					!this.showWarranty &&
					(!info.mtm || (info.mtm && !info.mtm.toLocaleLowerCase().endsWith('cd')))
				) {
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

	isCdDevice(): Promise<any> {
		return this.getMachineInfo()
			.then((info) => {
				if (info && info.mtm && info.mtm.toLocaleLowerCase().endsWith('cd')) {
					return true;
				}
				return false;
			})
			.catch(() => false);
	}

	getHardwareInfo(): Promise<any> {
		if (this.sysInfo) {
			return this.sysInfo.getHardwareInfo();
		}
		return undefined;
	}

	getAllDisksUsage(): Promise<any> {
		if (this.sysInfo) {
			return this.sysInfo.getAllDisksUsage();
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

	async getMachineType(): Promise<number> {
		if (this.sysInfo) {
			if (this.machineType) {
				return Promise.resolve(this.machineType);
			}

			const cache = this.localCacheService.getLocalCacheValue(
				LocalStorageKey.MachineType,
				-1
			);
			if (cache !== -1) {
				this.machineType = cache;
				return Promise.resolve(this.machineType);
			}
			const value = await this.sysInfo.getMachineType();
			this.machineType = value;
			this.localCacheService.setLocalCacheValue(LocalStorageKey.DesktopMachine, value === 4);
			this.localCacheService.setLocalCacheValue(LocalStorageKey.MachineType, value);
			return value;
		} else {
			return undefined;
		}
	}

	private initShowSearch() {
		if (this.hypSettings) {
			this.hypSettings.getFeatureSetting('FeatureSearch').then(
				(searchFeature) => {
					this.showSearch = (searchFeature || '').toString() === 'true';
				},
				(error) => {
					this.logger.error('DeviceService.initShowSearch: promise rejected ', error);
				}
			);
		}
	}
}
