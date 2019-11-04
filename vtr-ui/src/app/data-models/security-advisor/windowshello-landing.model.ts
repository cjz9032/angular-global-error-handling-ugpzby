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
	statusList: Array<StatusInfo>;
	type = 'security';
	imgUrl = '../../../../assets/images/windows-logo.svg';

	whStatus = {
		status: 4,
		detail: '', // active or inactive
		path: 'security/windows-hello',
		title: '',
		type: 'security',
		id: 'sa-ov-link-windowsHello'
	};
	subject = {
		status: 2,
		title: '',
		type: 'security',
	};
	translateString: any;
	constructor(
		public translate: TranslateService,
		whModel: phoenix.WindowsHello,
		public commonService: CommonService,
	) {
		whModel.on(EventTypes.helloFingerPrintStatusEvent, (data) => {
			this.setWhStatus(data);
		});

		translate.stream([
			'common.securityAdvisor.loading',
			'common.securityAdvisor.windowsHello',
			'common.securityAdvisor.registered',
			'common.securityAdvisor.notRegistered',
			'security.landing.fingerprint'
		]).subscribe((res: any) => {
			this.translateString = res;
			if (!this.whStatus.detail) {
				this.whStatus.detail = res['common.securityAdvisor.loading'];
			}
			this.whStatus.title = res['security.landing.fingerprint'];
			this.subject.title = res['common.securityAdvisor.windowsHello'];
			const cacheStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus);
			if (whModel && whModel.fingerPrintStatus) {
				this.setWhStatus(whModel.fingerPrintStatus);
			} else if (cacheStatus) {
				this.setWhStatus(whModel.fingerPrintStatus);
			}
			this.statusList = new Array(this.whStatus);
		});
	}

	setWhStatus(finger: string) {
		if (!this.translateString) {
			return;
		}
		this.whStatus.detail = this.translateString[`common.securityAdvisor.${finger === 'active' ? 'registered' : 'notRegistered'}`];
		this.whStatus.status = finger === 'active' ? 0 : 1;
		this.subject.status = finger === 'active' ? 0 : 1;
		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus, this.subject.status === 0 ? 'enabled' : 'disabled');
	}
}
