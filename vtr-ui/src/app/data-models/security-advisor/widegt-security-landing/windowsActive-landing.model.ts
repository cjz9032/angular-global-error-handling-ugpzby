import { EventTypes, WindowsActivation } from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';

export class WindowsActiveLandingViewModel {
	waStatus = {
		status: 'loading',
		icon: 'landing-windows',
		title: 'security.landing.windows',
		content: 'security.landing.windowsActiveContent',
		buttonLabel: 'security.landing.visitWindows',
		buttonHref: 'ms-settings:activation',
		noneCheck: true,
		detail: '',
		id: 'sa-ov-link-windowsActive',
	};
	translateString: any;

	constructor(translate: TranslateService, waModel: WindowsActivation, public commonService: CommonService, ) {
		waModel.on(EventTypes.waStatusEvent, (data) => {
			if (data !== 'unknown') {
				this.setWaStatus(data);
			}
		});
		const cacheStatus = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityWindowsActiveStatus);
		translate.stream([
			'common.securityAdvisor.enabled',
			'common.securityAdvisor.disabled',
			'common.securityAdvisor.loading',
			'security.landing.windows',
			'security.landing.windowsActiveContent',
			'security.landing.visitWindows',
		]).subscribe((res: any) => {
			if (!this.waStatus.detail) {
				this.waStatus.detail = res['common.securityAdvisor.loading'];
			}
			this.translateString = res;
			this.waStatus.title = res['security.landing.windows'];
			this.waStatus.content = res['security.landing.windowsActiveContent'];
			this.waStatus.buttonLabel = res['security.landing.visitWindows'];
			if (waModel.status !== 'unknown') {
				this.setWaStatus(waModel.status);
			} else if (cacheStatus) {
				this.setWaStatus(cacheStatus);
			}
		});
	}

	setWaStatus(status: string) {
		if (!this.translateString) {
			return;
		}
		this.waStatus.detail = this.translateString[`common.securityAdvisor.${status === 'enable' ? 'enabled' : 'disabled'}`];
		this.waStatus.status = status === 'enable' ? 'enabled' : 'disabled';
		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsActiveStatus, status);
	}
}
