import { EventTypes } from '@lenovo/tan-client-bridge';
import * as phoenix from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

export class WindowsHelloLandingViewModel {
	statusList: Array<any>;
	subject: any;
	type = 'security';
	imgUrl = '../../../../assets/images/windows-logo.svg';
	constructor(whModel: phoenix.WindowsHello, commonService: CommonService) {
		if (whModel) {
			const whStatus = {
				status: 2,
				detail: 'inactive', // active or inactive
				path: 'windows-hello',
				title: 'Fingerprint reader',
				type: 'security',
			};
			const subjectStatus = {
				status: 2,
				title: 'Windows Hello',
				type: 'security',
			};
			let fingerStatus = 'inactive';
			let faciaStatus = 'inactive';
			const cacheStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus);
			if (cacheStatus) {
				whStatus.status = cacheStatus === 'enabled' ? 0 : 1;
				whStatus.detail = cacheStatus;
				subjectStatus.status = cacheStatus === 'enabled' ? 0 : 1;
			}
			if (whModel.fingerPrintStatus || whModel.facialIdStatus) {
				whStatus.status = (whModel.fingerPrintStatus === 'active' || whModel.facialIdStatus === 'active') ? 0 : 1;
				whStatus.detail = (whModel.fingerPrintStatus === 'active' || whModel.facialIdStatus === 'active') ? 'enabled' : 'disabled';
				commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus, whStatus.detail);
				subjectStatus.status = (whModel.fingerPrintStatus === 'active' || whModel.facialIdStatus === 'active') ? 0 : 1;
			}
			whModel.on(EventTypes.helloFingerPrintStatusEvent, (data) => {
				whStatus.status = (data === 'active') ? 0 : 1;
				whStatus.detail = data === 'active' ? 'enabled' : 'disabled';
				commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus, whStatus.detail);
				fingerStatus = data;
				subjectStatus.status = (faciaStatus === 'active' || fingerStatus === 'active') ? 0 : 1;
			});
			whModel.on(EventTypes.helloFacialIdStatusEvent, (data) => {
				faciaStatus = data;
				subjectStatus.status = (faciaStatus === 'active' || fingerStatus === 'active') ? 0 : 1;
			});
			this.statusList = new Array(whStatus);
			this.subject = subjectStatus;

		}
	}
}
