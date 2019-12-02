import { EventTypes } from '@lenovo/tan-client-bridge';
import * as phoenix from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';

export class UacLandingViewModel {
	uacStatus = {
		status: 'loading',
		icon: 'landing-uac',
		title: 'security.landing.uac',
		content: 'security.landing.uacContent',
		buttonLabel: 'security.landing.visitUac',
		buttonHref: 'ms-settings:signinoptions',
		noneCheck: true,
		detail: '',
		id: 'sa-ov-link-uac',
	};
	translateString: any;

	constructor(translate: TranslateService, uacModel, public commonService: CommonService, ) {
		// waModel.on(EventTypes.pmStatusEvent, (data) => {
		// 	this.setWaStatus(data);
		// });
		const cacheStatus = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityUacStatus);
		translate.stream([
			'common.securityAdvisor.enabled',
			'common.securityAdvisor.disabled',
			'common.securityAdvisor.loading',
			'security.landing.uac',
			'security.landing.uacContent',
			'security.landing.visitUac',
		]).subscribe((res: any) => {
			if (!this.uacStatus.detail) {
				this.uacStatus.detail = res['common.securityAdvisor.loading'];
			}
			this.translateString = res;
			this.uacStatus.title = res['security.landing.uac'];
			this.uacStatus.content = res['security.landing.uacContent'];
			this.uacStatus.buttonLabel = res['security.landing.visitUac'];
			if (uacModel.status) {
				this.setWaStatus(uacModel.status);
			} else if (cacheStatus) {
				this.setWaStatus(cacheStatus);
			}
		});
	}

	setWaStatus(status: string) {
		if (!this.translateString) {
			return;
		}
		this.uacStatus.detail = this.translateString[`common.securityAdvisor.${status === 'active' ? 'enabled' : 'disabled'}`];
		this.uacStatus.status = status === 'enabled' ? 'enabled' : 'disabled';
		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityUacStatus, status);
	}
}
