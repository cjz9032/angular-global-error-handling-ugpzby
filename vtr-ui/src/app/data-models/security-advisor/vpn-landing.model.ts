import { EventTypes } from '@lenovo/tan-client-bridge';
import * as phoenix from '@lenovo/tan-client-bridge';

export class VpnLandingViewModel {
	// vpn: Vpn;
	statusList: Array<any>;
	subject = 'VPN Security';
	subjectStatus: number;
	type = 'security';
	imgUrl = '../../../../assets/images/surfeasy-logo.svg';
	constructor(vpnModel: phoenix.Vpn) {
		// this.vpn = vpnModel;
		const vpnStatus = {
			status: 2,
			detail: 'not-installed', // installed or not-installed
			path: 'internet-protection',
			title: 'Virtual Private Network',
			type: 'security',
		};
		if (vpnModel.status) {
			vpnStatus.status = (vpnModel.status === 'installed') ? 2 : 1;
			vpnStatus.detail = vpnModel.status;
			this.subjectStatus = (vpnModel.status === 'installed') ? 2 : 1;
		}

		vpnModel.on(EventTypes.vpnStatusEvent, (data) => {
			vpnStatus.status = (data === 'installed') ? 2 : 1;
			vpnStatus.detail = data;
			this.subjectStatus = (data === 'installed') ? 2 : 1;
		});
		this.statusList = new Array(vpnStatus);
	}
}