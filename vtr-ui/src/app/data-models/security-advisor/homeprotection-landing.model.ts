import { EventTypes } from '@lenovo/tan-client-bridge';
import * as phoenix from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

export class HomeProtectionLandingViewModel {
	statusList: Array<any>;
	type = 'security';
	constructor(hpModel: phoenix.HomeProtection, wfModel: phoenix.WifiSecurity, commonService: CommonService) {
		// this.homeProtection = hpModel;
		const hpStatus = {
			status: 2,
			detail: 'disabled', // enabled / disabled
			path: 'wifi-security',
			title: 'Connected Home Security',
			type: 'security',
		};
		const cacheStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingWifiSecurityStatus);
		if (cacheStatus) {
			hpStatus.status = cacheStatus === 'enabled' ? 0 : 1;
			hpStatus.detail = cacheStatus;
		}
		if (wfModel.state) {
			hpStatus.status = (wfModel.state === 'enabled') ? 0 : 1;
			hpStatus.detail = wfModel.state;
			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingWifiSecurityStatus, hpStatus.detail);
		}

		wfModel.on(EventTypes.wsStateEvent, (data) => {
			hpStatus.status = (data === 'enabled') ? 0 : 1;
			hpStatus.detail = data;
			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingWifiSecurityStatus, hpStatus.detail);
		});
		this.statusList = new Array(hpStatus);
	}
}
