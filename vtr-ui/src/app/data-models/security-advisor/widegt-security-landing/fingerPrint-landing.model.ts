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

export class FingerPrintLandingViewModel {
	whStatus = {
		status: 'loading',
		icon: 'landing-finger',
		title: 'security.landing.fingerprint',
		content: 'security.landing.fingerprintContent',
		buttonLabel: 'security.landing.visitFingerprint',
		buttonHref: 'ms-settings:signinoptions',
		noneCheck: true,
		id: 'sa-ov-btn-fingerPrint',
		detail: '',
	};
	translateString: any;
	constructor(
		translate: TranslateService,
		whModel: phoenix.WindowsHello,
		public commonService: CommonService,
	) {
		whModel.on(EventTypes.helloFingerPrintStatusEvent, (data) => {
			this.setWhStatus(data);
		});

		translate.stream([
			'common.securityAdvisor.loading',
			'common.securityAdvisor.registered',
			'common.securityAdvisor.notRegistered',
			'security.landing.fingerprint',
			'security.landing.fingerprintContent',
			'security.landing.visitFingerprint',
		]).subscribe((res: any) => {
			this.translateString = res;
			if (!this.whStatus.detail) {
				this.whStatus.detail = res['common.securityAdvisor.loading'];
			}
			this.whStatus.title = res['security.landing.fingerprint'];
			this.whStatus.content = res['security.landing.fingerprintContent'];
			this.whStatus.buttonLabel = res['security.landing.visitFingerprint'];
			const cacheStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingWindowsHelloFingerprintStatus);
			if (whModel && whModel.fingerPrintStatus) {
				this.setWhStatus(whModel.fingerPrintStatus);
			} else if (cacheStatus) {
				this.setWhStatus(cacheStatus);
			}
		});
	}

	setWhStatus(finger: string) {
		if (!this.translateString) {
			return;
		}
		this.whStatus.detail = this.translateString[`common.securityAdvisor.${finger === 'active' ? 'registered' : 'notRegistered'}`];
		this.whStatus.status = finger === 'active' ? 'enabled' : 'disabled';
		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingWindowsHelloFingerprintStatus, this.whStatus.status);
	}
}
