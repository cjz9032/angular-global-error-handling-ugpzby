import { EventTypes } from '@lenovo/tan-client-bridge';
import * as phoenix from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';

export class BitLockerLandingViewModel {
	blStatus = {
		status: 'loading',
		icon: 'landing-disk',
		title: 'security.landing.hde',
		content: 'security.landing.bitLockerContent',
		buttonLabel: 'security.landing.visitHde',
		buttonHref: 'ms-settings:activation',
		noneCheck: true,
		detail: '',
		id: 'sa-ov-link-bitLocker',
	};
	translateString: any;

	constructor(translate: TranslateService, blModel, public commonService: CommonService, ) {
		// waModel.on(EventTypes.pmStatusEvent, (data) => {
		// 	this.setWaStatus(data);
		// });
		const cacheStatus = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityBitLockerStatus);
		translate.stream([
			'common.securityAdvisor.enabled',
			'common.securityAdvisor.disabled',
			'common.securityAdvisor.loading',
			'security.landing.hde',
			'security.landing.bitLockerContent',
			'security.landing.visitHde',
		]).subscribe((res: any) => {
			if (!this.blStatus.detail) {
				this.blStatus.detail = res['common.securityAdvisor.loading'];
			}
			this.translateString = res;
			this.blStatus.title = res['security.landing.hde'];
			this.blStatus.content = res['security.landing.bitLockerContent'];
			this.blStatus.buttonLabel = res['security.landing.visitHde'];
			if (blModel.status) {
				this.setBlStatus(blModel.status);
			} else if (cacheStatus) {
				this.setBlStatus(cacheStatus);
			}
		});
	}

	setBlStatus(status: string) {
		if (!this.translateString) {
			return;
		}
		this.blStatus.detail = this.translateString[`common.securityAdvisor.${status === 'active' ? 'enabled' : 'disabled'}`];
		this.blStatus.status = status === 'active' ? 'enabled' : 'disabled';
		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityBitLockerStatus, status);
	}
}
