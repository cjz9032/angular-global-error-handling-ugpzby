import { EventTypes } from '@lenovo/tan-client-bridge';
import * as phoenix from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

export class PasswordManagerLandingViewModel {
	statusList: Array<any>;
	subject: any;
	type = 'security';
	imgUrl = '../../../../assets/images/Dashlane_Logo_Teal _Web.png';

	constructor(pmModel: phoenix.PasswordManager, commonService: CommonService) {
		const pmStatus = {
			status: 2,
			detail: 'not-installed', // install or not-installed
			path: 'password-protection',
			title: 'Password Manager',
			type: 'security',
		};
		const subjectStatus = {
			status: 2,
			title: 'Password Health',
			type: 'security',
		};
		const cacheStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityPasswordManagerStatus);
		if (cacheStatus) {
			pmStatus.status = cacheStatus === 'installed' ? 2 : 1;
			pmStatus.detail = cacheStatus;
			subjectStatus.status = cacheStatus === 'installed' ? 2 : 1;
		}
		if (pmModel.status) {
			pmStatus.detail = pmModel.status;
			pmStatus.status = (pmModel.status === 'installed') ? 2 : 1;
			commonService.setLocalStorageValue(LocalStorageKey.SecurityPasswordManagerStatus, pmStatus.detail);
			subjectStatus.status = (pmModel.status === 'installed') ? 2 : 1;
		}
		pmModel.on(EventTypes.pmStatusEvent, (data) => {
			pmStatus.detail = data;
			pmStatus.status = (data === 'installed') ? 2 : 1;
			commonService.setLocalStorageValue(LocalStorageKey.SecurityPasswordManagerStatus, pmStatus.detail);
			subjectStatus.status = (data === 'installed') ? 2 : 1;
		});
		this.statusList = new Array(pmStatus);
		this.subject = subjectStatus;
	}
}
