import { EventTypes, BitLocker } from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';

export class BitLockerLandingViewModel {
	blStatus = {
		status: 'loading',
		icon: 'landing-disk',
		title: 'security.landing.hde',
		content: 'security.landing.bitLockerContent',
		buttonLabel: 'security.landing.visitHde',
		launch() {},
		noneCheck: true,
		detail: '',
		id: 'sa-ov-btn-bitLocker',
	};
	translateString: any;

	constructor(
		translate: TranslateService,
		blModel: BitLocker,
		public commonService: CommonService,
		private localCacheService: LocalCacheService) {
		blModel.on(EventTypes.bitLockerStatusEvent, (data) => {
			if (data !== 'unknown') {
				this.setBlStatus(data);
			}
		});
		const cacheStatus = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityBitLockerStatus);
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
			this.blStatus.launch = blModel.launch.bind(blModel);
			if (blModel.status !== 'unknown') {
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
		this.blStatus.detail = this.translateString[`common.securityAdvisor.${status === 'enable' ? 'enabled' : 'disabled'}`];
		this.blStatus.status = status === 'enable' ? 'enabled' : 'disabled';
		this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityBitLockerStatus, status);
	}
}
