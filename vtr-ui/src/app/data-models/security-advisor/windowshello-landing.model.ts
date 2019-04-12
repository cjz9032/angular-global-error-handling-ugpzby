import { EventTypes } from '@lenovo/tan-client-bridge';
import * as phoenix from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';

export class WindowsHelloLandingViewModel {
	statusList: Array<any>;
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
			const setWhStatus = (finger: string, facia: string) => {
				if (!finger) {
					whStatus.status = 1;
					whStatus.detail = 'common.securityAdvisor.notFound';
					subjectStatus.status = 1;
					commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus, 'disabled');
					commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingWindowsHelloFingerprintStatus, 'notFound');
				} else {
					whStatus.status = finger === 'active' ? 0 : 1;
					whStatus.detail = finger === 'active' ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
					subjectStatus.status = finger === 'active' || facia === 'active' ? 0 : 1;
					commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus, subjectStatus.status === 0 ? 'enabled' : 'disabled');
					commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingWindowsHelloFingerprintStatus, finger);
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
			};
		if (whModel) {
			if (whModel.fingerPrintStatus || whModel.facialIdStatus) {
				setWhStatus(whModel.fingerPrintStatus, whModel.facialIdStatus);
			}
			whModel.on(EventTypes.helloFingerPrintStatusEvent, (data) => {
				setWhStatus(data, whModel.facialIdStatus);
			});
			whModel.on(EventTypes.helloFacialIdStatusEvent, (data) => {
				setWhStatus(whModel.fingerPrintStatus, data);
			});
		} else {
			const cacheStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus);
			const cacheFingerStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingWindowsHelloFingerprintStatus);
			if (cacheFingerStatus && cacheFingerStatus === 'notFound') {
				whStatus.status = 1;
				whStatus.detail = 'common.securityAdvisor.notFound';
				subjectStatus.status = 1;
			} else {
				whStatus.status = cacheFingerStatus === 'active' ? 0 : 1;
				whStatus.detail = cacheFingerStatus === 'active' ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
				subjectStatus.status = cacheStatus;
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
		}
		this.statusList = new Array(whStatus);
		this.subject = subjectStatus;
	}
}
