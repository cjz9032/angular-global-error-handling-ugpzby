import { WidgetItem } from './widget-item.model';
import { WindowsHello, EventTypes } from '@lenovo/tan-client-bridge';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';

export class WindowsHelloWidgetItem extends WidgetItem {
	constructor(windowsHello: WindowsHello, commonService: CommonService, private translateService: TranslateService) {
		super({
			id: 'windows-hello',
			path: 'security/windows-hello',
			title: 'Windows Hello',
			type: 'security'
		});
		const cacheStatus: string = commonService.getLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus);
		if (cacheStatus) {
			this.status = cacheStatus === 'enabled' ? 0 : 1;
			this.detail = cacheStatus;
			this.translateString(this.detail);
		}
		if (windowsHello.facialIdStatus || windowsHello.fingerPrintStatus) {
			const active = windowsHello.fingerPrintStatus === 'active' || windowsHello.facialIdStatus === 'active';
			this.status = active ? 0 : 1;
			this.detail = active ? 'enabled' : 'disabled';
			this.translateString(this.detail);
			commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus, this.detail);
		}

		windowsHello.on(EventTypes.helloFingerPrintStatusEvent, (fpStatus) => {
			this.status = fpStatus === 'active' ? 0 : 1;
			this.detail = fpStatus === 'active' ? 'enabled' : 'disabled';
			this.translateString(this.detail);
			commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus, this.detail);
		}).on(EventTypes.helloFacialIdStatusEvent, (faceIdStatus) => {
			this.status = faceIdStatus === 'active' ? 0 : 1;
			this.detail = faceIdStatus === 'active' ? 'enabled' : 'disabled';
			this.translateString(this.detail);
			commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus, this.detail);
		});
	}

	translateString(status: string) {
		const translateKey = status === 'enabled' ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
		this.translateService.get(translateKey).subscribe((value) => {
			this.detail = value;
		});
	}
}
