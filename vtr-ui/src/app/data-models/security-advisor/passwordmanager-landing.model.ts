import { EventTypes } from '@lenovo/tan-client-bridge';
import * as phoenix from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';
import { StatusInfo } from './status-info.model';

export class PasswordManagerLandingViewModel {
	statusList: Array<StatusInfo>;
	type = 'security';
	imgUrl = '../../../../assets/images/Dashlane_Logo_Teal_Web.png';

	pmStatus: StatusInfo = {
		status: 4,
		detail: '',
		path: 'security/password-protection',
		title: '',
		type: 'security',
		id: 'sa-ov-link-passwordManager'
	};
	subject = {
		status: 2,
		title: '',
		type: 'security',
	};
	translateString: any;
	constructor(public translate: TranslateService, pmModel: phoenix.PasswordManager, public commonService: CommonService, ) {
		const cacheStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityPasswordManagerStatus);
		translate.stream([
			'common.securityAdvisor.installed',
			'common.securityAdvisor.installing',
			'common.securityAdvisor.notInstalled',
			'common.securityAdvisor.pswdMgr',
			'security.landing.pwdHealth',
			'common.securityAdvisor.loading'
		]).subscribe((res: any) => {
			if (!this.pmStatus.detail) {
				this.pmStatus.detail = res['common.securityAdvisor.loading'];
			}
			this.translateString = res;
			this.pmStatus.title = res['common.securityAdvisor.pswdMgr'];
			this.subject.title = res['security.landing.pwdHealth'];
			if (pmModel.status) {
				this.setPmStatus(pmModel.status);
			} else if (cacheStatus) {
				this.setPmStatus(cacheStatus);
			}
			this.statusList = new Array(this.pmStatus);
		});
		pmModel.on(EventTypes.pmStatusEvent, (data) => {
			this.setPmStatus(data);
		});
	}

	setPmStatus(status: string) {
		if (!this.translateString) {
			return;
		}
		switch (status) {
			case 'installed':
				this.pmStatus.detail = this.translateString['common.securityAdvisor.installed'];
				this.pmStatus.status = 5;
				this.subject.status = 2;
				break;
			case 'installing':
				this.pmStatus.detail = this.translateString['common.securityAdvisor.installing'];
				this.pmStatus.status = 4;
				this.subject.status = 1;
				break;
			default:
				this.pmStatus.detail = this.translateString['common.securityAdvisor.notInstalled'];
				this.pmStatus.status = 5;
				this.subject.status = 1;
		}
		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityPasswordManagerStatus, status);
	}
}
