import { EventTypes } from '@lenovo/tan-client-bridge';
import * as phoenix from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';
import { StatusInfo } from './status-info.model';

export class VpnLandingViewModel {
	statusList: Array<StatusInfo>;
	type = 'security';
	imgUrl = '../../../../assets/images/surfeasy-logo.svg';

	vpnStatus: StatusInfo = {
		status: 4,
		detail: 'common.securityAdvisor.loading',
		path: 'security/internet-protection',
		title: 'security.landing.vpnVirtual',
		type: 'security',
		id: 'sa-ov-link-vpn'
	};
	subject = {
		status: 2,
		title: 'security.landing.vpnSecurity',
		type: 'security',
	};
	constructor(public translate: TranslateService, vpnModel: phoenix.Vpn, public commonService: CommonService) {
		const cacheStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityVPNStatus);
		if (vpnModel.status) {
			this.setVpnStatus(vpnModel.status);
		} else if (cacheStatus) {
			this.setVpnStatus(cacheStatus);
		}
		vpnModel.on(EventTypes.vpnStatusEvent, (data) => {
			this.setVpnStatus(data);
		});
		this.statusList = new Array(this.vpnStatus);

		translate.stream(this.vpnStatus.detail).subscribe((res: string) => {
			this.vpnStatus.detail = res;
		});
		translate.stream(this.vpnStatus.title).subscribe((res: string) => {
			this.vpnStatus.title = res;
		});
		translate.stream(this.subject.title).subscribe((res: string) => {
			this.subject.title = res;
		});
	}

	setVpnStatus(status: string) {
		switch (status) {
			case 'installed':
				this.vpnStatus.detail = 'common.securityAdvisor.installed';
				this.vpnStatus.status = 5;
				this.subject.status = 2;
				break;
			case 'installing':
				this.vpnStatus.detail = 'common.securityAdvisor.installing';
				this.vpnStatus.status = 4;
				this.subject.status = 1;
				break;
			default:
				this.vpnStatus.detail = 'common.securityAdvisor.notInstalled';
				this.vpnStatus.status = 5;
				this.subject.status = 1;
		}

		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityVPNStatus, status);
		this.translate.stream(this.vpnStatus.detail).subscribe((res: string) => {
			this.statusList[0].detail = res;
		});
	}
}
