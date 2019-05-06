import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { MyDevice } from 'src/app/data-models/device/my-device.model';
import WinRT from '@lenovo/tan-client-bridge/src/util/winrt';
import { CommonService } from '../common/common.service';
import { Microphone } from 'src/app/data-models/audio/microphone.model';
import { DeviceMonitorStatus } from 'src/app/enums/device-monitor-status.enum';

@Injectable({
	providedIn: 'root'
})
export class DeviceService {
	private device: any;
	private sysInfo: any;
	private microphone: any;
	public isShellAvailable = false;
	public isArm = false;

	constructor(
		shellService: VantageShellService
		, private commonService: CommonService) {
		this.device = shellService.getDevice();
		this.sysInfo = shellService.getSysinfo();
		this.microphone = shellService.getMicrophoneSettings();

		if (this.device && this.sysInfo) {
			this.isShellAvailable = true;
		}
		if (this.microphone) {
			this.startDeviceMonitor();
		}
		this.initIsArm();
	}
	
	private initIsArm() {
		try {
			//this.isArm = true;
			if (this.isShellAvailable) {
				this.getMachineInfo()
					.then((machineInfo: any) => {
						this.isArm = machineInfo.cpuArchitecture.toUpperCase().trim() == "ARM64"
					}).catch(error => {
						console.error('initArm', error);
					});
			}
		} catch (error) {
			console.error('initArm' + error.message);
		}
	}

	public getDeviceInfo(): Promise<MyDevice> {
		if (this.device) {
			return this.device.getDeviceInfo();
		}
		return undefined;
	}

	getMachineInfo(): Promise<any> {
		if (this.sysInfo) {
			return this.sysInfo.getMachineInfo();
		}
		return undefined;
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

	private startDeviceMonitor() {
		if (this.microphone) {
			this.microphone.startMonitor((response: Microphone) => {
				this.commonService.sendNotification(DeviceMonitorStatus.MicrophoneStatus, response);
			});
		}
	}
	getMachineType(): Promise<number> {
		if (this.sysInfo) {
			return this.sysInfo.getMachineType();
		}
		return undefined;
	}
}
