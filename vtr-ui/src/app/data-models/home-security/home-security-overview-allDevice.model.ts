import { EventTypes, CHSDeviceOverview } from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

export class HomeSecurityAllDevice {
	allDevicesStatus: boolean;
	allDevicesNumber: number;

	constructor(chsDeviceOverview: CHSDeviceOverview) {
		if (chsDeviceOverview && chsDeviceOverview.allDevices) {
			const allDevices = chsDeviceOverview.allDevices;
			if (allDevices.length > 0) {
				this.allDevicesNumber = allDevices.length;
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
