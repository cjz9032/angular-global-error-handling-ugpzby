import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { MyDevice } from 'src/app/data-models/device/my-device.model';
import WinRT from '@lenovo/tan-client-bridge/src/util/winrt';
import { CommonService } from '../common/common.service';
import { Microphone } from 'src/app/data-models/audio/microphone.model';
import { DeviceMonitorStatus } from 'src/app/enums/device-monitor-status.enum';
import { Router } from '@angular/router';
import { AndroidService } from '../android/android.service';

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
	private isGamingDashboardLoaded = false;
	private machineInfo: any;

	constructor(
		private shellService: VantageShellService,
		private commonService: CommonService,
		public androidService: AndroidService,
		private router: Router) {
		this.device = shellService.getDevice();
		this.sysInfo = shellService.getSysinfo();
		this.microphone = shellService.getMicrophoneSettings();

		if (this.device && this.sysInfo) {
			this.isShellAvailable = true;
		}
		// if (this.microphone) {
		// 	this.startDeviceMonitor();
		// }
		this.initIsArm();
		this.initshowPrivacy();
	}

	private loadGamingDashboard() {
		if (!this.isGamingDashboardLoaded) {
			this.isGamingDashboardLoaded = true;
			if (this.isGaming) {
				this.router.navigateByUrl('/device-gaming');
			} else {
				this.router.navigateByUrl('/dashboard');
			}
		}
	}

	// private initIsGaming() {
	// 	try {
	// 		if (this.isShellAvailable) {
	// 			this.getMachineInfo()
	// 				.then((machineInfo: any) => {
	// 					if (machineInfo.isGaming !== undefined) {
	// 						console.log('initIsGaming', machineInfo.isGaming);
	// 						this.isGaming = machineInfo.isGaming;
	// 					}
	// 				}).catch(error => {
	// 					console.error('initIsGaming', error);
	// 				});
	// 		}
	// 	} catch (error) {
	// 		console.error('initArm' + error.message);
	// 	}
	// }

	private initIsArm() {
		try {
			this.getIsARM()
				.then((status: boolean) => {
					this.isArm = status;
				}).catch(error => {
					console.error('initArm', error);
				});
		} catch (error) {
			console.error('initArm' + error.message);
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
			console.error('getIsARM' + error.message);
		}
	}

	private initshowPrivacy() {
		// set this.showPrivacy appropriately based on machineInfo data
		try {
			if (this.isShellAvailable) {
				this.shellService.calcDeviceFilter('{"var":"HypothesisGroups.PrivacyTab"}').then((privacy) => {
					this.showPrivacy = (privacy === 'enabled');
				});
			}
		} catch (error) {
			console.error('initPrivacy' + error.message);
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
		if (this.sysInfo) {
			return this.sysInfo.getMachineInfo()
				.then((info) => {
					this.machineInfo = info;
					this.isGaming = info.isGaming;
					if (info && info.cpuArchitecture) {
						if (info.cpuArchitecture.indexOf('64') === -1) {
							this.is64bit = false;
						} else {
							this.is64bit = true;
						}
					}
					this.commonService.sendNotification('MachineInfo', this.machineInfo);
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
