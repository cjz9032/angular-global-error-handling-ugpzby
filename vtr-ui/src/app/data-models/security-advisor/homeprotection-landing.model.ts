import { EventTypes } from '@lenovo/tan-client-bridge';
import * as phoenix from '@lenovo/tan-client-bridge';

export class HomeProtectionLandingViewModel {
	// homeProtection: HomeProtection;
	statusList: Array<any>;

	type = 'security';
	constructor(hpModel: phoenix.HomeProtection, wfModel: phoenix.WifiSecurity) {
		// this.homeProtection = hpModel;
		const hpStatus = {
			status: 2,
			detail: 'disabled', // enabled / disabled
			path: 'wifi-security',
			title: 'Connected Home Security',
			type: 'security',
		};
		if (wfModel.state) {
			hpStatus.status = (wfModel.state === 'enabled') ? 0 : 1;
			hpStatus.detail = wfModel.state;
		}

		wfModel.on(EventTypes.wsStateEvent, (data) => {
			hpStatus.status = (data === 'enabled') ? 0 : 1;
			hpStatus.detail = data;
		});
		this.statusList = new Array(hpStatus);
	}
}
