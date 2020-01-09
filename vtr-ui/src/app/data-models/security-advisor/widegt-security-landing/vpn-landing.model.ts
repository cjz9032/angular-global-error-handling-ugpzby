import { EventTypes } from '@lenovo/tan-client-bridge';
import * as phoenix from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';

export class VpnLandingViewModel {
	vpnStatus = {
		status: 'loading',
		icon: 'landing-vpn',
		title: 'security.landing.vpnVirtual',
		buttonLabel: 'security.landing.goVpn',
		buttonLink: '/security/internet-protection',
		content: 'security.landing.vpnContent',
		showOwn: false,
		ownTitle: 'security.landing.haveOwnVpn',
		id: 'sa-ov-link-vpn',
		detail: ''
	};
	translateString: any;
	constructor(translate: TranslateService, vpnModel: phoenix.Vpn, public commonService: CommonService) {
		vpnModel.on(EventTypes.vpnStatusEvent, (data) => {
			this.setVpnStatus(data);
		});

		const cacheStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityVPNStatus);
		translate.stream([
			'common.securityAdvisor.loading',
			'security.landing.vpnVirtual',
			'common.securityAdvisor.installed',
			'common.securityAdvisor.installing',
			'common.securityAdvisor.notInstalled',
			'security.landing.haveOwnVpn',
			'security.landing.vpnContent',
			'security.landing.goVpn'
		]).subscribe((res: any) => {
			this.translateString = res;
			if (!this.vpnStatus.detail) {
				this.vpnStatus.detail = res['common.securityAdvisor.loading'];
			}
			this.vpnStatus.title = res['security.landing.vpnVirtual'];
			this.vpnStatus.buttonLabel = res['security.landing.goVpn'];
			this.vpnStatus.content = res['security.landing.vpnContent'];
			this.vpnStatus.ownTitle = res['security.landing.haveOwnVpn'];
			if (vpnModel.status) {
				this.setVpnStatus(vpnModel.status);
			} else if (cacheStatus) {
				this.setVpnStatus(cacheStatus);
			}
		});
	}

	setVpnStatus(status: string) {
		if (!this.translateString) {
			return;
		}
		const cacheShowOwn: boolean = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingVPNShowOwn, null);
		this.vpnStatus.showOwn = cacheShowOwn ? cacheShowOwn : false;
		switch (status) {
			case 'installed':
				this.vpnStatus.detail = this.translateString['common.securityAdvisor.installed'];
				this.vpnStatus.status = 'installed';
				break;
			case 'installing':
				this.vpnStatus.detail = this.translateString['common.securityAdvisor.installing'];
				this.vpnStatus.status = 'installing';
				break;
			default:
				this.vpnStatus.detail = this.translateString['common.securityAdvisor.notInstalled'];
				this.vpnStatus.status = 'not-installed';
		}

		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityVPNStatus, status);
	}
}
