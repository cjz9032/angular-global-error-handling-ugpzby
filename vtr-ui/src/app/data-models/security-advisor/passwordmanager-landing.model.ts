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
			status: 2,
			detail: 'common.securityAdvisor.loading', // install or not-installed
			path: 'security/password-protection',
			title: 'common.securityAdvisor.pswdMgr',
			type: 'security',
		};
		const subjectStatus = {
			status: 2,
			title: 'security.landing.pwdHealth',
			type: 'security',
		};
		const cacheStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityPasswordManagerStatus);
		if (cacheStatus) {
			pmStatus.status = cacheStatus === 'installed' ? 2 : 1;
			pmStatus.detail = cacheStatus === 'installed' ? 'common.securityAdvisor.installed' : 'common.securityAdvisor.notInstalled';
			subjectStatus.status = cacheStatus === 'installed' ? 2 : 1;
		}
		if (pmModel.status) {
			pmStatus.detail = pmModel.status === 'installed' ? 'common.securityAdvisor.installed' : 'common.securityAdvisor.notInstalled';
			pmStatus.status = (pmModel.status === 'installed') ? 2 : 1;
			commonService.setLocalStorageValue(LocalStorageKey.SecurityPasswordManagerStatus, pmModel.status);
			subjectStatus.status = (pmModel.status === 'installed') ? 2 : 1;
		}
		pmModel.on(EventTypes.pmStatusEvent, (data) => {
			pmStatus.detail = data === 'installed' ? 'common.securityAdvisor.installed' : 'common.securityAdvisor.notInstalled';
			pmStatus.status = (data === 'installed') ? 2 : 1;
			translate.get(pmStatus.detail).subscribe((res) => {
				pmStatus.detail = res;
			});
			commonService.setLocalStorageValue(LocalStorageKey.SecurityPasswordManagerStatus, data);
			subjectStatus.status = (data === 'installed') ? 2 : 1;
		});
		translate.get(pmStatus.detail).subscribe((res) => {
			pmStatus.detail = res;
		});
		translate.get(pmStatus.title).subscribe((res) => {
			pmStatus.title = res;
		});
		translate.get(subjectStatus.title).subscribe((res) => {
			subjectStatus.title = res;
		});
		this.statusList = new Array(pmStatus);
		this.subject = subjectStatus;
	}
}
