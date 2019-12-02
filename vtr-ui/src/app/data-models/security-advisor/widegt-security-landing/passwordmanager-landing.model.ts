import { EventTypes } from '@lenovo/tan-client-bridge';
import * as phoenix from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';

export class PasswordManagerLandingViewModel {
	pmStatus = {
		status: 'loading',
		icon: 'landing-password',
		title: 'security.landing.pwdHealth',
		buttonLabel: 'security.landing.goPassword',
		buttonLink: '/security/password-protection',
		showOwn: false,
		content: 'security.landing.passwordContent',
		ownTitle: 'security.landing.haveOwnPassword',
		id: 'sa-ov-link-passwordManager',
		detail: ''
	};
	translateString: any;

	constructor(translate: TranslateService, pmModel: phoenix.PasswordManager, public commonService: CommonService, ) {
		pmModel.on(EventTypes.pmStatusEvent, (data) => {
			this.setPmStatus(data);
		});
		const cacheStatus = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityPasswordManagerStatus);
		translate.stream([
			'common.securityAdvisor.installed',
			'common.securityAdvisor.installing',
			'common.securityAdvisor.notInstalled',
			'security.landing.pwdHealth',
			'common.securityAdvisor.loading',
			'security.landing.passwordContent',
			'security.landing.haveOwnPassword',
			'security.landing.goPassword',
		]).subscribe((res: any) => {
			if (!this.pmStatus.detail) {
				this.pmStatus.detail = res['common.securityAdvisor.loading'];
			}
			this.translateString = res;
			this.pmStatus.title = res['security.landing.pwdHealth'];
			this.pmStatus.content = res['security.landing.passwordContent'];
			this.pmStatus.buttonLabel = res['security.landing.goPassword'];
			this.pmStatus.ownTitle = res['security.landing.haveOwnPassword'];
			if (pmModel.status) {
				this.setPmStatus(pmModel.status);
			} else if (cacheStatus) {
				this.setPmStatus(cacheStatus);
			}
		});
	}

	setPmStatus(status: string) {
		if (!this.translateString) {
			return;
		}
		const cacheShowOwn = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingPasswordManagerShowOwn, null);
		this.pmStatus.showOwn = typeof cacheShowOwn === 'boolean' ? cacheShowOwn : false;
		switch (status) {
			case 'installed':
				this.pmStatus.detail = this.translateString['common.securityAdvisor.installed'];
				this.pmStatus.status = 'installed';
				break;
			case 'installing':
				this.pmStatus.detail = this.translateString['common.securityAdvisor.installing'];
				this.pmStatus.status = 'installing';
				break;
			default:
				this.pmStatus.detail = this.translateString['common.securityAdvisor.notInstalled'];
				this.pmStatus.status = 'not-installed';
		}
		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityPasswordManagerStatus, status);
	}
}
