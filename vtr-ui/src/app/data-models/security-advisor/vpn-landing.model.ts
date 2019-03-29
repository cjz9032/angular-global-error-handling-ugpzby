import { EventTypes } from '@lenovo/tan-client-bridge';
import * as phoenix from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

export class VpnLandingViewModel {
	statusList: Array<any>;
	subject: any;
	type = 'security';
	imgUrl = '../../../../assets/images/surfeasy-logo.svg';
	constructor(vpnModel: phoenix.Vpn, commonService: CommonService) {
		const vpnStatus = {
			status: 2,
			detail: 'not-installed', // installed or not-installed
			path: 'internet-protection',
			title: 'Virtual Private Network',
			type: 'security',
		};
		const subjectStatus = {
			status: 2,
			title: 'VPN Security',
			type: 'security',
		};
		const cacheStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityVPNStatus);
		if (cacheStatus) {
			vpnStatus.status = cacheStatus === 'installed' ? 2 : 1;
			vpnStatus.detail = cacheStatus;
			subjectStatus.status = cacheStatus === 'installed' ? 2 : 1;
		}
		if (vpnModel.status) {
			vpnStatus.status = (vpnModel.status === 'installed') ? 2 : 1;
			vpnStatus.detail = vpnModel.status;
			commonService.setLocalStorageValue(LocalStorageKey.SecurityVPNStatus, vpnStatus.detail);
			subjectStatus.status = (vpnModel.status === 'installed') ? 2 : 1;
		}

		vpnModel.on(EventTypes.vpnStatusEvent, (data) => {
			vpnStatus.status = (data === 'installed') ? 2 : 1;
			vpnStatus.detail = data;
			commonService.setLocalStorageValue(LocalStorageKey.SecurityVPNStatus, vpnStatus.detail);
			subjectStatus.status = (data === 'installed') ? 2 : 1;
		});
		this.statusList = new Array(vpnStatus);
		this.subject = subjectStatus;
	}
}
