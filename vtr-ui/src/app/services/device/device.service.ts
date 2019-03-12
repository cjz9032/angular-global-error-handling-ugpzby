import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { MyDevice } from 'src/app/data-models/device/my-device.model';

@Injectable({
	providedIn: 'root'
})
export class DeviceService {
	deviceModel = 'Ideapad 720s';
	private device: any;
	public isShellAvailable = false;
	constructor(shellService: VantageShellService) {
		this.device = shellService.getDevice();
		if (this.device) {
			this.isShellAvailable = true;
		}
	}

	public getDeviceInfo(): Promise<MyDevice> {
		if (this.device) {
			return this.device.getDeviceInfo();
		}
		return undefined;
	}

}
