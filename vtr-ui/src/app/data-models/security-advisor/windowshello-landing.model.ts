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
		if (whModel) {
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
			let fingerStatus = 'common.securityAdvisor.disabled';
			let faciaStatus = 'common.securityAdvisor.disabled';
			const cacheStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus);
			if (cacheStatus) {
				whStatus.status = cacheStatus === 'active' ? 0 : 1;
				whStatus.detail = cacheStatus === 'active' ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
				subjectStatus.status = cacheStatus === 'active' ? 0 : 1;
			}
			if (whModel.fingerPrintStatus || whModel.facialIdStatus) {
				if (whModel.fingerPrintStatus) {
					whStatus.status = (whModel.fingerPrintStatus === 'active') ? 0 : 1;
					whStatus.detail = (whModel.fingerPrintStatus === 'active') ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
					subjectStatus.status = (whModel.fingerPrintStatus === 'active' || whModel.facialIdStatus === 'active') ? 0 : 1;
					commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus, subjectStatus.status === 0 ? 'active' : 'inactive');
				} else {
					whStatus.status = 1;
					whStatus.detail = 'common.securityAdvisor.notFound';
					subjectStatus.status = 1;
					commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus, 'inactive');
				}
			}
			whModel.on(EventTypes.helloFingerPrintStatusEvent, (data) => {
				if (data) {
					whStatus.status = (data === 'active') ? 0 : 1;
					whStatus.detail = data === 'active' ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
					fingerStatus = data === 'active' ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
					subjectStatus.status = (faciaStatus === 'active' || fingerStatus === 'active') ? 0 : 1;
					commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus, subjectStatus.status === 0 ? 'active' : 'inactive');
				} else {
					whStatus.status = 1;
					whStatus.detail = 'common.securityAdvisor.notFound';
					subjectStatus.status = 1;
					commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus, 'inactive');
				}
				translate.get(whStatus.detail).subscribe((res) => {
					whStatus.detail = res;
				});

			});
			whModel.on(EventTypes.helloFacialIdStatusEvent, (data) => {
				faciaStatus = data === 'active' ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
				subjectStatus.status = (faciaStatus === 'active' || fingerStatus === 'active') ? 0 : 1;
			});
			translate.get(whStatus.detail).subscribe((res) => {
				whStatus.detail = res;
			});
			translate.get(whStatus.title).subscribe((res) => {
				whStatus.title = res;
			});
			translate.get(subjectStatus.title).subscribe((res) => {
				subjectStatus.title = res;
			});
			this.statusList = new Array(whStatus);
			this.subject = subjectStatus;

		}
	}
}
