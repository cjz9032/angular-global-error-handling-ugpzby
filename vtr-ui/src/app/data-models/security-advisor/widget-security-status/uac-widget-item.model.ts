import { EventTypes, UAC } from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';
import { WidgetItem } from './widget-item.model';

export class UACWidgetItemViewModel extends WidgetItem {
	translateString: any;
	public launch() {}
	constructor(uac: UAC, private commonService: CommonService, private translate: TranslateService) {
		super({
			id: 'sa-widget-lnk-uac',
			type: 'security',
			metricItemName: 'UAC',
		}, translate);
		uac.on(EventTypes.uacStatusEvent, (data) => {
			this.setWaStatus(data);
		});
		const cacheStatus = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityUacStatus);
		translate.stream([
			'common.securityAdvisor.enabled',
			'common.securityAdvisor.disabled',
			'security.landing.uacTitles',
		]).subscribe((res: any) => {
			this.translateString = res;
			this.title = res['security.landing.uacTitles'];
			this.launch = uac.launch.bind(uac);
			if (uac.status !== 'unknown') {
				this.setWaStatus(uac.status);
			} else if (cacheStatus) {
				this.setWaStatus(cacheStatus);
			}
		});
	}

	setWaStatus(status: string) {
		if (!this.translateString) {
			return;
		}
		this.detail = this.translateString[`common.securityAdvisor.${status === 'enable' ? 'enabled' : 'disabled'}`];
		this.status = status === 'enable' ? 0 : 1;
		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityUacStatus, status);
	}
}
