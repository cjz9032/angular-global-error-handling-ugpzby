import { WidgetItem } from './widget-item.model';
import { WindowsHello, EventTypes } from '@lenovo/tan-client-bridge';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';

export class WindowsHelloWidgetItem extends WidgetItem {
	constructor(windowsHello: WindowsHello, commonService: CommonService, private translateService: TranslateService) {
		super({
			id: 'sa-widget-lnk-wh',
			path: 'security/windows-hello',
			type: 'security'
		}, translateService);
		this.translateService.stream('common.securityAdvisor.windowsHello').subscribe((value) => {
			this.title = value;
		});
		const cacheStatus: string = commonService.getLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus);
		if (cacheStatus) {
			this.status = cacheStatus === 'enabled' ? 0 : 1;
			this.detail = cacheStatus;
			this.translateStatus(this.detail);
		}
		if (windowsHello.facialIdStatus || windowsHello.fingerPrintStatus) {
			const active = windowsHello.fingerPrintStatus === 'active' || windowsHello.facialIdStatus === 'active';
			this.status = active ? 0 : 1;
			this.detail = active ? 'enabled' : 'disabled';
			commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus, this.detail);
			this.translateStatus(this.detail);
		}

		windowsHello.on(EventTypes.helloFingerPrintStatusEvent, (fpStatus) => {
			this.status = fpStatus === 'active' ? 0 : 1;
			this.detail = fpStatus === 'active' ? 'enabled' : 'disabled';
			commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus, this.detail);
			this.translateStatus(this.detail);
		}).on(EventTypes.helloFacialIdStatusEvent, (faceIdStatus) => {
			this.status = faceIdStatus === 'active' ? 0 : 1;
			this.detail = faceIdStatus === 'active' ? 'enabled' : 'disabled';
			commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus, this.detail);
			this.translateStatus(this.detail);
		});
	}

	translateStatus(status: string) {
		const translateKey = status === 'enabled' ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
		this.translateService.stream(translateKey).subscribe((value) => {
			this.detail = value;
		});
	}
}
