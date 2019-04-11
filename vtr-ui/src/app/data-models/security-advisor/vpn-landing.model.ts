import { EventTypes } from '@lenovo/tan-client-bridge';
import * as phoenix from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';

export class VpnLandingViewModel {
	statusList: Array<any>;
	subject: any;
	type = 'security';
	imgUrl = '../../../../assets/images/surfeasy-logo.svg';
	constructor(vpnModel: phoenix.Vpn, commonService: CommonService, translate: TranslateService) {
		const vpnStatus = {
			status: 2,
			detail: 'common.securityAdvisor.loading', // installed or not-installed
			path: 'security/internet-protection',
			title: 'security.landing.vpnVirtual',
			type: 'security',
		};
		const subjectStatus = {
			status: 2,
			title: 'security.landing.vpnSecurity',
			type: 'security',
		};
		const setVpnStatus = (status: string) => {
			vpnStatus.status = status === 'installed' ? 2 : 1;
			vpnStatus.detail = status === 'installed' ? 'common.securityAdvisor.installed' : 'common.securityAdvisor.notInstalled';
			commonService.setLocalStorageValue(LocalStorageKey.SecurityVPNStatus, status);
			subjectStatus.status = status === 'installed' ? 2 : 1;
			translate.get(vpnStatus.detail).subscribe((res) => {
				vpnStatus.detail = res;
			});
			translate.get(vpnStatus.title).subscribe((res) => {
				vpnStatus.title = res;
			});
			translate.get(subjectStatus.title).subscribe((res) => {
				subjectStatus.title = res;
			});
		};
		const cacheStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityVPNStatus);
		if (cacheStatus) {
			setVpnStatus(cacheStatus);
		}
		if (vpnModel.status) {
			setVpnStatus(vpnModel.status);
		}

		vpnModel.on(EventTypes.vpnStatusEvent, (data) => {
			setVpnStatus(data);
		});
		this.statusList = new Array(vpnStatus);
		this.subject = subjectStatus;
	}
}
