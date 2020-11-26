import { EventTypes, UAC } from '@lenovo/tan-client-bridge';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';
import { WidgetItem } from './widget-item.model';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';

export class UACWidgetItemViewModel extends WidgetItem {
	translateString: any;
	public launch() {}
	constructor(
		uac: UAC,
		private localCacheService: LocalCacheService,
		private translate: TranslateService
	) {
		super(
			{
				id: 'sa-widget-lnk-uac',
				type: 'security',
				metricItemName: 'UAC',
			},
			translate
		);
		uac.on(EventTypes.uacStatusEvent, (data) => {
			this.setWaStatus(data);
		});
		const cacheStatus = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.SecurityUacStatus
		);
		translate
			.stream([
				'common.securityAdvisor.enabled',
				'common.securityAdvisor.disabled',
				'security.landing.uacTitles',
			])
			.subscribe((res: any) => {
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
		this.detail = this.translateString[
			`common.securityAdvisor.${status === 'enable' ? 'enabled' : 'disabled'}`
		];
		this.status = status === 'enable' ? 0 : 1;
		this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityUacStatus, status);
	}
}
