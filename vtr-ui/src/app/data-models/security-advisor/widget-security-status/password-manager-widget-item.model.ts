import { WidgetItem } from './widget-item.model';
import { PasswordManager, EventTypes, WifiSecurity } from '@lenovo/tan-client-bridge';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';

export class PassWordManagerWidgetItem extends WidgetItem {
	constructor(passwordManager: PasswordManager, commonService: CommonService, private translateService: TranslateService) {
		super({
			id: 'sa-widget-lnk-pm',
			path: 'security/password-protection',
			type: 'security',
			isSystemLink: false,
			metricsItemName: 'Password Manager'
		}, translateService);
		this.translateService.stream('common.securityAdvisor.pswdMgr').subscribe((value) => {
			this.title = value;
		});
		const cacheStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityPasswordManagerStatus);
		if (cacheStatus) {
			this.updateStatus(cacheStatus);
		}
		if (passwordManager.status) {
			this.updateStatus(passwordManager.status);
			commonService.setLocalStorageValue(LocalStorageKey.SecurityPasswordManagerStatus, passwordManager.status);
		}

		passwordManager.on(EventTypes.pmStatusEvent, (status) => {
			this.updateStatus(status);
			commonService.setLocalStorageValue(LocalStorageKey.SecurityPasswordManagerStatus, status);
		});
	}

	updateStatus(status: string) {
		let translateKey: string;
		switch (status) {
			case 'installed':
				translateKey = 'common.securityAdvisor.installed';
				this.status = 5;
				break;
			case 'installing':
				translateKey = 'common.securityAdvisor.installing';
				this.status = 4;
				break;
			default:
				translateKey = 'common.securityAdvisor.notInstalled';
				this.status = 5;
		}
		this.translateService.stream(translateKey).subscribe((value: string) => {
			this.detail = value;
		});
	}
}
