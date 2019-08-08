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
	constructor(translate: TranslateService, vpnModel: phoenix.Vpn, commonService: CommonService) {
		const vpnStatus = {
			status: 4,
			detail: 'common.securityAdvisor.loading', // installed or not-installed
			path: 'security/internet-protection',
			title: 'security.landing.vpnVirtual',
			type: 'security',
			id: 'sa-ov-link-vpn'
		};
		const subjectStatus = {
			status: 2,
			title: 'security.landing.vpnSecurity',
			type: 'security',
		};
		translate.stream(vpnStatus.detail).subscribe((res) => {
			vpnStatus.detail = res;
		});
		translate.stream(vpnStatus.title).subscribe((res) => {
			vpnStatus.title = res;
		});
		translate.stream(subjectStatus.title).subscribe((res) => {
			subjectStatus.title = res;
		});
		const setVpnStatus = (status: string) => {
			switch (status) {
				case 'installed':
					vpnStatus.detail = 'common.securityAdvisor.installed';
					vpnStatus.status = 5;
					subjectStatus.status = 2;
					break;
				case 'installing':
					vpnStatus.detail = 'common.securityAdvisor.installing';
					vpnStatus.status = 4;
					subjectStatus.status = 1;
					break;
				default:
					vpnStatus.detail = 'common.securityAdvisor.notInstalled';
					vpnStatus.status = 5;
					subjectStatus.status = 1;
			}
			commonService.setLocalStorageValue(LocalStorageKey.SecurityVPNStatus, status);
			subjectStatus.status = status === 'installed' ? 2 : 1;
			translate.stream(vpnStatus.detail).subscribe((res) => {
				vpnStatus.detail = res;
			});
			translate.stream(vpnStatus.title).subscribe((res) => {
				vpnStatus.title = res;
			});
			translate.stream(subjectStatus.title).subscribe((res) => {
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
