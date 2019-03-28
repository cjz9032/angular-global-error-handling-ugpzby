import { EventTypes } from '@lenovo/tan-client-bridge';
import * as phoenix from '@lenovo/tan-client-bridge';

export class WifiSecurityLandingViewModel {
	// wifiSecurity: WifiSecurity;
	statusList: Array<any>;

	subject = 'WiFi & Connected Home Security';
	subjectStatus: number;
	type = 'security';
	wifiHistory: Array<phoenix.WifiDetail>;
	constructor(wfModel: phoenix.WifiSecurity, hpModel: phoenix.HomeProtection) {
		// this.wifiSecurity = wfModel;
		const wfStatus = {
			status: 2,
			detail: 'disabled', // enabled / disabled
			path: 'wifi-security',
			title: 'WiFi Security',
			type: 'security',
		};
		if (wfModel.state) {
			wfStatus.status = (wfModel.state === 'enabled') ? 0 : 1;
			wfStatus.detail = wfModel.state;
			this.subjectStatus = (wfModel.state === 'enabled') ? 0 : 1;
		}
		if (wfModel.wifiHistory) {
			this.wifiHistory = wfModel.wifiHistory;
		}

		wfModel.on(EventTypes.wsWifiHistoryEvent, (data) => {
			this.wifiHistory = wfModel.wifiHistory;
		});

		wfModel.on(EventTypes.wsStateEvent, (data) => {
			wfStatus.status = (data === 'enabled') ? 0 : 1;
			wfStatus.detail = data;
			this.subjectStatus = (data === 'enabled') ? 0 : 1;
		});
		this.statusList = new Array(wfStatus);
	}
}