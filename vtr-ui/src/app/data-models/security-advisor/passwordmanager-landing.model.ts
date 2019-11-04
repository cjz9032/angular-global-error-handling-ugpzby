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
		detail: 'common.securityAdvisor.loading',
		path: 'security/password-protection',
		title: 'common.securityAdvisor.pswdMgr',
		type: 'security',
		id: 'sa-ov-link-passwordManager'
	};
	subject = {
		status: 2,
		title: 'security.landing.pwdHealth',
		type: 'security',
	};

	constructor(public translate: TranslateService, pmModel: phoenix.PasswordManager, public commonService: CommonService, ) {
		const cacheStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityPasswordManagerStatus);
		if (pmModel.status) {
			this.setPmStatus(pmModel.status);
		} else if (cacheStatus) {
			this.setPmStatus(cacheStatus);
		}
		pmModel.on(EventTypes.pmStatusEvent, (data) => {
			this.setPmStatus(data);
		});
		this.statusList = new Array(this.pmStatus);

		translate.stream(this.pmStatus.detail).subscribe((res: string) => {
			this.pmStatus.detail = res;
		});
		translate.stream(this.pmStatus.title).subscribe((res: string) => {
			this.pmStatus.title = res;
		});
		translate.stream(this.subject.title).subscribe((res: string) => {
			this.subject.title = res;
		});
	}

	setPmStatus(status: string) {
		switch (status) {
			case 'installed':
				this.pmStatus.detail = 'common.securityAdvisor.installed';
				this.pmStatus.status = 5;
				this.subject.status = 2;
				break;
			case 'installing':
				this.pmStatus.detail = 'common.securityAdvisor.installing';
				this.pmStatus.status = 4;
				this.subject.status = 1;
				break;
			default:
				this.pmStatus.detail = 'common.securityAdvisor.notInstalled';
				this.pmStatus.status = 5;
				this.subject.status = 1;
		}
		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityPasswordManagerStatus, status);
		this.translate.stream(this.pmStatus.detail).subscribe((res: string) => {
			this.statusList[0].detail = res;
		});
	}
}
