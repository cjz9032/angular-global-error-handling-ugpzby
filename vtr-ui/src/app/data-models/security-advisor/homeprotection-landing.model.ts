import { TranslateService } from '@ngx-translate/core';

export class HomeProtectionLandingViewModel {
	statusList: Array<any>;
	type = 'security';
	constructor(public translate: TranslateService) {
		const hpStatus = {
			detail: 'device.myDevice.learnMore',
			path: 'security/wifi-security',
			pathParams: { fragment: 'home-security' },
			title: 'security.landing.connectedHomeSecurity',
			type: 'security',
			circle: 'questionCircle',
			id: 'sa-ov-link-homeProtection'
		};
		this.translate.stream(hpStatus.title).subscribe((res) => {
			hpStatus.title = res;
		});
		this.translate.stream(hpStatus.detail).subscribe((res) => {
			hpStatus.detail = res;
		});
		this.statusList = new Array(hpStatus);
	}
}
