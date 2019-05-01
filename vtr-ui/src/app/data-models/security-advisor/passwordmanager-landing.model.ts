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
		};
		const subjectStatus = {
			status: 2,
			title: 'security.landing.pwdHealth',
			type: 'security',
		};
		const setPmStatus = (status: string) => {
			pmStatus.detail = status === 'installed' ? 'common.securityAdvisor.installed' : 'common.securityAdvisor.notInstalled';
			pmStatus.status = status === 'installed' ? 2 : 1;
			commonService.setLocalStorageValue(LocalStorageKey.SecurityPasswordManagerStatus, status);
			subjectStatus.status = (status === 'installed') ? 2 : 1;
			translate.get(pmStatus.detail).subscribe((res) => {
				pmStatus.detail = res;
			});
			translate.get(pmStatus.title).subscribe((res) => {
				pmStatus.title = res;
			});
			translate.get(subjectStatus.title).subscribe((res) => {
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
