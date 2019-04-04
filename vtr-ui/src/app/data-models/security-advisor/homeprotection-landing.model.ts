import { EventTypes } from '@lenovo/tan-client-bridge';
import * as phoenix from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

export class HomeProtectionLandingViewModel {
	statusList: Array<any>;
	type = 'security';
	constructor() {
		const hpStatus = {
			detail: 'device.myDevice.learnMore',
			path: 'security/wifi-security',
			title: 'security.landing.connectedHomeSecurity',
			type: 'security',
		};
		this.statusList = new Array(hpStatus);
	}
}
