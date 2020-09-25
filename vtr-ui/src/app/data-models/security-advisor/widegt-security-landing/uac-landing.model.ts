import { EventTypes, UAC } from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';

export class UacLandingViewModel {
	uacStatus = {
		status: 'loading',
		icon: 'landing-uac',
		title: 'security.landing.uac',
		content: 'security.landing.uacContent',
		buttonLabel: 'security.landing.visitUac',
		launch() {},
		noneCheck: true,
		detail: '',
		id: 'sa-ov-btn-uac',
	};
	translateString: any;

	constructor(
		translate: TranslateService,
		uacModel: UAC,
		public commonService: CommonService,
		private localCacheService: LocalCacheService
		) {
		uacModel.on(EventTypes.uacStatusEvent, (data) => {
			if (data !== 'unknown') {
				this.setUacStatus(data);
			}
		});
		const cacheStatus = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityUacStatus);
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
			this.uacStatus.launch = uacModel.launch.bind(uacModel);
			if (uacModel.status !== 'unknown') {
				this.setUacStatus(uacModel.status);
			} else if (cacheStatus) {
				this.setUacStatus(cacheStatus);
			}
		});
	}

	setUacStatus(status: string) {
		if (!this.translateString) {
			return;
		}
		this.uacStatus.detail = this.translateString[`common.securityAdvisor.${status === 'enable' ? 'enabled' : 'disabled'}`];
		this.uacStatus.status = status === 'enable' ? 'enabled' : 'disabled';
		this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityUacStatus, status);
	}
}
