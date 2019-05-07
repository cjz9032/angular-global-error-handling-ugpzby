import { EventTypes } from '@lenovo/tan-client-bridge';
import * as phoenix from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';

export class PasswordManagerLandingViewModel {
	statusList: Array<any>;
	subject: any;
	type = 'security';
	imgUrl = '../../../../assets/images/Dashlane_Logo_Teal _Web.png';

	constructor(pmModel: phoenix.PasswordManager, commonService: CommonService, translate: TranslateService) {
		const pmStatus = {
			status: 4,
			detail: 'common.securityAdvisor.loading',
			path: 'security/password-protection',
			title: 'common.securityAdvisor.pswdMgr',
			type: 'security',
			id: 'sa-ov-link-passwordManager'
		};
		const subjectStatus = {
			status: 2,
			title: 'security.landing.pwdHealth',
			type: 'security',
		};
		const setPmStatus = (status: string) => {
			switch (status) {
				case 'installed':
					pmStatus.detail = 'common.securityAdvisor.installed';
					pmStatus.status = 5;
					subjectStatus.status = 2;
					break;
				case 'installing':
					pmStatus.detail = 'common.securityAdvisor.installing';
					pmStatus.status = 4;
					subjectStatus.status = 1;
					break;
				default:
					pmStatus.detail = 'common.securityAdvisor.notInstalled';
					pmStatus.status = 5;
					subjectStatus.status = 1;
			}
			commonService.setLocalStorageValue(LocalStorageKey.SecurityPasswordManagerStatus, status);
			translate.stream(pmStatus.detail).subscribe((res) => {
				pmStatus.detail = res;
			});
			translate.stream(pmStatus.title).subscribe((res) => {
				pmStatus.title = res;
			});
			translate.stream(subjectStatus.title).subscribe((res) => {
				subjectStatus.title = res;
			});
		};
		const cacheStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityPasswordManagerStatus);
		if (cacheStatus) {
			setPmStatus(cacheStatus);
		}
		if (pmModel.status) {
			setPmStatus(pmModel.status);
		}
		pmModel.on(EventTypes.pmStatusEvent, (data) => {
			setPmStatus(pmModel.status);
		});
		this.statusList = new Array(pmStatus);
		this.subject = subjectStatus;
	}
}
