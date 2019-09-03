import { CHSDeviceOverview } from '@lenovo/tan-client-bridge';

export class HomeSecurityAllDevice {
	allDevicesStatus: boolean;
	allDevicesNumber: number;

	constructor(chsDeviceOverview?: any) {
		if (chsDeviceOverview && chsDeviceOverview.allDevices) {
			const allDevices = chsDeviceOverview.allDevices;
			if (allDevices.length > 0) {
				this.allDevicesNumber = allDevices.length;
				if (this.allDevicesNumber > 99) {
					this.allDevicesNumber = 99;
				}
				this.allDevicesStatus = allDevices.filter(device => {
					return !device.protected;
				}).length <= 0;
			} else {
				this.allDevicesNumber = 0;
				this.allDevicesStatus = undefined;
			}
		}
	}
}
