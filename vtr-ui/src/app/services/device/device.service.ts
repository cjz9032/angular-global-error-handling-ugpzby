import { Injectable } from '@angular/core';
import { MyDevice } from 'src/app/data-models/device/my-device.model';
import WinRT from '@lenovo/tan-client-bridge/src/util/winrt';
import { CommonService } from '../common/common.service';
import { Microphone } from 'src/app/data-models/audio/microphone.model';
import { DeviceMonitorStatus } from 'src/app/enums/device-monitor-status.enum';
import { AndroidService } from '../android/android.service';
import { HypothesisService } from '../hypothesis/hypothesis.service';
import { LoggerService } from '../logger/logger.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
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
	public supportAIMeetingMgr = false;
	public showWarranty = false;
	public machineInfo: any;
	public showSearch = false;
	public machineType: number;
	constructor(
		private shellService: VantageShellService,
		private commonService: CommonService,
		public androidService: AndroidService,
		private logger: LoggerService,
		private hypSettings: HypothesisService,
		private localCacheService: LocalCacheService
	) {
		this.device = this.shellService.getDevice();
		this.sysInfo = this.shellService.getSysinfo();
		this.microphone = this.shellService.getMicrophoneSettings();
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

	private async identifySMBMachine(familyName: string) {
		if (familyName) {
			familyName = familyName.toLowerCase().replace(/\s+/g, ''); //remove all white space
		}

		this.supportAIMeetingMgr = await this.isSupportSMBFeature('AIMeetingManagerX') || this.isSoupportAIMeetingMgr(familyName);
		this.supportCreatorSettings = await this.isSupportSMBFeature('CreatorSettingsX') || this.isSupportSubFeature(familyName, 'creatorSettings');
		this.supportColorCalibration = await this.isSupportSMBFeature('ColorCalibrationX') || this.isSupportSubFeature(familyName, 'colorCalibration');;
		this.supportSmartAppearance = await this.isSupportSMBFeature('SmartAppearanceX') || this.isSupportSubFeature(familyName, 'smartAppearance');;
		this.isSMB = this.supportAIMeetingMgr || this.supportColorCalibration
			|| this.supportSmartAppearance || this.supportCreatorSettings;
	}

	isSupportSMBFeature(featureName): Promise<boolean> {
		return new Promise((resolve) => {
			if (this.hypSettings) {
				this.hypSettings.getFeatureSetting(featureName).then(
					(result) => {
						resolve((result || '').toString().toLowerCase() === 'true');
					},
					(error) => {
						this.logger.error(
							`DeviceService.isSupportSMBFeature: ${featureName} promise rejected `,
							error
						);
						resolve(false);
					}
				);
			}
			else {
				this.logger.error(
					`DeviceService.isSupportSMBFeature: hypothesis is not available`);
				resolve(false);
			}
		});
	}

	isSoupportAIMeetingMgr(familyName: string) {
		let ret = false;
		if (familyName) {
			if (
				familyName.match(/^(thinkbook)/) ||
				familyName.match(/^(thinkpade)/)
			) {
				ret = true;
			}
		}
		return ret;
	}

	isSupportSubFeature(familyName: string, familyKey: string) {
		let ret = false;
		if (familyName) {
			if (smbMachines[familyKey].includes(familyName)) {
				ret = true;
			}
		}
		return ret;
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

				this.identifySMBMachine(info.family);

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
			.then((info) => info && info.mtm && info.mtm.toLocaleLowerCase().endsWith('cd'))
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
