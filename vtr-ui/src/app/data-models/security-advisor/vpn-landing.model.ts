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
		detail: '',
		path: 'security/internet-protection',
		title: '',
		type: 'security',
		id: 'sa-ov-link-vpn'
	};
	subject = {
		status: 2,
		title: '',
		type: 'security',
	};
	translateString: any;
	constructor(public translate: TranslateService, vpnModel: phoenix.Vpn, public commonService: CommonService) {
		const cacheStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityVPNStatus);
		translate.stream([
			'common.securityAdvisor.loading',
			'security.landing.vpnVirtual',
			'security.landing.vpnSecurity',
			'common.securityAdvisor.installed',
			'common.securityAdvisor.installing',
			'common.securityAdvisor.notInstalled'
		]).subscribe((res: any) => {
			this.translateString = res;
			if (!this.vpnStatus.detail) {
				this.vpnStatus.detail = res['common.securityAdvisor.loading'];
			}
			this.vpnStatus.title = res['security.landing.vpnVirtual'];
			this.subject.title = res['security.landing.vpnSecurity'];
			if (vpnModel.status) {
				this.setVpnStatus(vpnModel.status);
			} else if (cacheStatus) {
				this.setVpnStatus(cacheStatus);
			}
			this.statusList = new Array(this.vpnStatus);
		});
		vpnModel.on(EventTypes.vpnStatusEvent, (data) => {
			this.setVpnStatus(data);
		});
	}

	setVpnStatus(status: string) {
		if (!this.translateString) {
			return;
		}
		switch (status) {
			case 'installed':
				this.vpnStatus.detail = this.translateString['common.securityAdvisor.installed'];
				this.vpnStatus.status = 5;
				this.subject.status = 2;
				break;
			case 'installing':
				this.vpnStatus.detail = this.translateString['common.securityAdvisor.installing'];
				this.vpnStatus.status = 4;
				this.subject.status = 1;
				break;
			default:
				this.vpnStatus.detail = this.translateString['common.securityAdvisor.notInstalled'];
				this.vpnStatus.status = 5;
				this.subject.status = 1;
		}

		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityVPNStatus, status);
	}
}
