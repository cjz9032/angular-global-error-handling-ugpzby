import { EventTypes } from '@lenovo/tan-client-bridge';
import * as phoenix from '@lenovo/tan-client-bridge';

export class WindowsHelloLandingViewModel {
	// windowsHello: WindowsHello;
	statusList: Array<any>;

	subject = 'Windows Hello';
	subjectStatus: number;
	imgUrl = '../../../../assets/images/windows-logo.svg';
	type = 'security';
	constructor(whModel: phoenix.WindowsHello) {
		if (whModel) {
			// this.windowsHello = whModel;
			const whStatus = {
				status: 2,
				detail: 'inactive', // active or inactive
				path: 'windows-hello',
				title: 'Fingerprint reader',
				type: 'security',
			};
			let fingerStatus = 'inactive';
			let faciaStatus = 'inactive';
			if (whModel.fingerPrintStatus || whModel.facialIdStatus) {
				whStatus.status = (whModel.fingerPrintStatus === 'active') ? 0 : 1;
				whStatus.detail = whModel.fingerPrintStatus === 'active' ? 'enabled' : 'disabled';
				this.subjectStatus = (whModel.fingerPrintStatus === 'active' || whModel.facialIdStatus === 'active') ? 0 : 1;
			}
			whModel.on(EventTypes.helloFingerPrintStatusEvent, (data) => {
				whStatus.status = (data === 'active') ? 0 : 1;
				whStatus.detail = data;
				fingerStatus = data;
				this.subjectStatus = (faciaStatus === 'active' || fingerStatus === 'active') ? 0 : 1;
			});
			whModel.on(EventTypes.helloFacialIdStatusEvent, (data) => {
				faciaStatus = data;
				this.subjectStatus = (faciaStatus === 'active' || fingerStatus === 'active') ? 0 : 1;
			});
			this.statusList = new Array(whStatus);

		}
	}
}