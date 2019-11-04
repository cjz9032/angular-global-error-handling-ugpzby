import {
	EventTypes
} from '@lenovo/tan-client-bridge';
import * as phoenix from '@lenovo/tan-client-bridge';
import {
	CommonService
} from 'src/app/services/common/common.service';
import {
	LocalStorageKey
} from 'src/app/enums/local-storage-key.enum';
import {
	TranslateService
} from '@ngx-translate/core';
import { StatusInfo } from './status-info.model';

export class WindowsHelloLandingViewModel {
	statusList: Array < StatusInfo > ;
	type = 'security';
	imgUrl = '../../../../assets/images/windows-logo.svg';

	whStatus = {
		status: 4,
		detail: 'common.securityAdvisor.loading', // active or inactive
		path: 'security/windows-hello',
		title: 'security.landing.fingerprint',
		type: 'security',
		id: 'sa-ov-link-windowsHello'
	};
	subject = {
		status: 2,
		title: 'common.securityAdvisor.windowsHello',
		type: 'security',
	};

	constructor(
		public translate: TranslateService,
		whModel: phoenix.WindowsHello,
		public commonService: CommonService,
	) {
		const cacheStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus);
		if (whModel && whModel.fingerPrintStatus) {
			this.setWhStatus(whModel.fingerPrintStatus);
		} else if (cacheStatus) {
			this.setWhStatus(whModel.fingerPrintStatus);
		}

		whModel.on(EventTypes.helloFingerPrintStatusEvent, (data) => {
			this.setWhStatus(data);
		});
		this.statusList = new Array(this.whStatus);

		translate.stream(this.whStatus.detail).subscribe((res: string) => {
			this.whStatus.detail = res;
		});
		translate.stream(this.whStatus.title).subscribe((res: string) => {
			this.whStatus.title = res;
		});
		translate.stream(this.subject.title).subscribe((res: string) => {
			this.subject.title = res;
		});
	}

	setWhStatus(finger: string) {
		this.whStatus.detail = finger === 'active' ? 'common.securityAdvisor.registered' : 'common.securityAdvisor.notRegistered';
		this.whStatus.status = finger === 'active' ? 0 : 1;
		this.subject.status = finger === 'active' ? 0 : 1;
		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus, this.subject.status === 0 ? 'enabled' : 'disabled');
		this.translate.stream(this.whStatus.detail).subscribe((res: string) => {
			this.statusList[0].detail = res;
		});
	}
}
