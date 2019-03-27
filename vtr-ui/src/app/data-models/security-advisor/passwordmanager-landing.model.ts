import { EventTypes } from '@lenovo/tan-client-bridge';
import * as phoenix from '@lenovo/tan-client-bridge';

export class PasswordManagerLandingViewModel {
	// passwordManager: PasswordManager;
	statusList: Array<any>;
	subject = 'Password Health';
	subjectStatus: number;
	type = 'security';
	imgUrl = '../../../../assets/images/Dashlane_Logo_Teal _Web.png';

	constructor(pmModel: phoenix.PasswordManager) {
		// this.passwordManager = pmModel;
		const pmStatus = {
			status: 2,
			detail: 'not-installed', // install or not-installed
			path: 'password-protection',
			title: 'Password Manager',
			type: 'security',
		};
		if (pmModel.status) {
			pmStatus.detail = pmModel.status;
			pmStatus.status = (pmModel.status === 'installed') ? 2 : 1;
			this.subjectStatus = (pmModel.status === 'installed') ? 2 : 1;
		}
		pmModel.on(EventTypes.pmStatusEvent, (data) => {
			pmStatus.detail = data;
			pmStatus.status = (data === 'installed') ? 2 : 1;
			this.subjectStatus = (data === 'installed') ? 2 : 1;
		});
		this.statusList = new Array(pmStatus);
	}
}