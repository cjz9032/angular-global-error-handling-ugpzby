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

export class WindowsHelloLandingViewModel {
	statusList: Array < any > ;
	subject: any;
	type = 'security';
	imgUrl = '../../../../assets/images/windows-logo.svg';
	constructor(
		whModel: phoenix.WindowsHello,
		commonService: CommonService,
		translate: TranslateService
	) {
		const whStatus = {
			status: 2,
			detail: 'common.securityAdvisor.loading', // active or inactive
			path: 'security/windows-hello',
			title: 'security.landing.fingerprint',
			type: 'security',
		};
		const subjectStatus = {
			status: 2,
			title: 'common.securityAdvisor.windowsHello',
			type: 'security',
		};
		const setWhStatus = (finger: string, facial: string) => {
			if (!finger) {
				whStatus.status = 1;
				whStatus.detail = 'common.securityAdvisor.notFound';
				subjectStatus.status = facial === 'active' ? 0 : 1;
			} else {
				whStatus.status = finger === 'active' ? 0 : 1;
				whStatus.detail = finger === 'active' ? 'common.securityAdvisor.registered' : 'common.securityAdvisor.notRegistered';
				subjectStatus.status = finger === 'active' || facial === 'active' ? 0 : 1;
			}
			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingWindowsHelloFingerprintStatus, finger ? finger : 'notFound');
			commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus, subjectStatus.status === 0 ? 'enabled' : 'disabled');
			translate.get(whStatus.detail).subscribe((res) => {
				whStatus.detail = res;
			});
			translate.get(whStatus.title).subscribe((res) => {
				whStatus.title = res;
			});
			translate.get(subjectStatus.title).subscribe((res) => {
				subjectStatus.title = res;
			});
		};
		const cacheStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus);
		const cacheFingerStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingWindowsHelloFingerprintStatus);
		if (cacheFingerStatus && cacheFingerStatus === 'notFound') {
			whStatus.status = 1;
			whStatus.detail = 'common.securityAdvisor.notFound';
			subjectStatus.status = cacheStatus === 'enabled' ? 0 : 1;
		} else {
			whStatus.status = cacheFingerStatus === 'active' ? 0 : 1;
			whStatus.detail = cacheFingerStatus === 'active' ? 'common.securityAdvisor.registered' : 'common.securityAdvisor.notRegistered';
			subjectStatus.status = cacheStatus === 'enabled' ? 0 : 1;
		}
		translate.get(whStatus.detail).subscribe((res) => {
			whStatus.detail = res;
		});
		translate.get(whStatus.title).subscribe((res) => {
			whStatus.title = res;
		});
		translate.get(subjectStatus.title).subscribe((res) => {
			subjectStatus.title = res;
		});
		if (whModel && (whModel.fingerPrintStatus || whModel.facialIdStatus)) {
			setWhStatus(whModel.fingerPrintStatus, whModel.facialIdStatus);
		}
		whModel.on(EventTypes.helloFingerPrintStatusEvent, (data) => {
			setWhStatus(data, whModel.facialIdStatus);
		});
		whModel.on(EventTypes.helloFacialIdStatusEvent, (data) => {
			setWhStatus(whModel.fingerPrintStatus, data);
		});
		this.statusList = new Array(whStatus);
		this.subject = subjectStatus;
	}
}
