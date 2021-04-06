import { WidgetItem } from './widget-item.model';
import { PasswordManager, EventTypes, WifiSecurity } from '@lenovo/tan-client-bridge';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';

export class PassWordManagerWidgetItem extends WidgetItem {
	constructor(
		passwordManager: PasswordManager,
		commonService: CommonService,
		private localCacheService: LocalCacheService,
		private translateService: TranslateService
	) {
		super(
			{
				id: 'sa-widget-lnk-pm',
				path: 'security/password-protection',
				type: 'security',
				isSystemLink: false,
				metricsItemName: 'Password Manager',
			},
			translateService
		);
		this.translateService.stream('common.securityAdvisor.pswdMgr').subscribe((value) => {
			this.title = value;
		});
		const cacheStatus = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.SecurityPasswordManagerStatus
		);
		if (cacheStatus) {
			this.updateStatus(cacheStatus);
		}
		if (passwordManager.status) {
			this.updateStatus(passwordManager.status);
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.SecurityPasswordManagerStatus,
				passwordManager.status
			);
		}

		passwordManager.on(EventTypes.pmStatusEvent, (status) => {
			this.updateStatus(status);
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.SecurityPasswordManagerStatus,
				status
			);
		});
	}

	updateStatus(status: string) {
		let translateKey: string;
		switch (status) {
			case 'installed':
				translateKey = 'common.securityAdvisor.installed';
				this.status = 'installState';
				break;
			case 'installing':
				translateKey = 'common.securityAdvisor.installing';
				this.status = 'loading';
				break;
			default:
				translateKey = 'common.securityAdvisor.notInstalled';
				this.status = 'installState';
		}
		this.translateService.stream(translateKey).subscribe((value: string) => {
			this.detail = value;
		});
	}
}
