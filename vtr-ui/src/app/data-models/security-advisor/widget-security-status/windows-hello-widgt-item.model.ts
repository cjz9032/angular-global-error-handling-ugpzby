import { WidgetItem } from './widget-item.model';
import { WindowsHello, EventTypes } from '@lenovo/tan-client-bridge';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';

export class WindowsHelloWidgetItem extends WidgetItem {
	constructor(windowsHello: WindowsHello, commonService: CommonService, private translateService: TranslateService) {
		super({
			id: 'sa-widget-lnk-wh',
			path: 'ms-settings:signinoptions',
			type: 'security',
			isSystemLink: true,
			metricsItemName: 'fingerPrint'
		}, translateService);
		this.translateService.stream('common.securityAdvisor.fingerPrint').subscribe((value) => {
			this.title = value;
		});
		const cacheStatus: string = commonService.getLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus);
		if (cacheStatus) {
			this.status = cacheStatus === 'enrolled' ? 0 : 1;
			this.detail = cacheStatus;
			this.translateStatus(this.detail);
		}
		if (windowsHello.fingerPrintStatus) {
			const active = windowsHello.fingerPrintStatus === 'active';
			this.status = active ? 0 : 1;
			this.detail = active ? 'enrolled' : 'notEnrolled';
			commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus, this.detail);
			this.translateStatus(this.detail);
		}

		windowsHello.on(EventTypes.helloFingerPrintStatusEvent, (fpStatus) => {
			this.status = fpStatus === 'active' ? 0 : 1;
			this.detail = fpStatus === 'active' ? 'enrolled' : 'notEnrolled';
			commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus, this.detail);
			this.translateStatus(this.detail);
		});
	}

	translateStatus(status: string) {
		const translateKey = status === 'enrolled' ? 'common.securityAdvisor.enrolled' : 'common.securityAdvisor.notEnrolled';
		this.translateService.stream(translateKey).subscribe((value) => {
			this.detail = value;
		});
	}
}
