import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { MyDevice } from 'src/app/data-models/device/my-device.model';
import WinRT from '@lenovo/tan-client-bridge/src/util/winrt';

@Injectable({
	providedIn: 'root'
})
export class DeviceService {
	private device: any;
	private sysInfo: any;
	public isShellAvailable = false;
	public isArm = false;

	constructor(shellService: VantageShellService) {
		this.device = shellService.getDevice();
		this.sysInfo = shellService.getSysinfo();

		if (this.device && this.sysInfo) {
			this.isShellAvailable = true;
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
}
