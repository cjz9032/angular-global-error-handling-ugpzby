import { WidgetItem } from './widget-item.model';
import { PasswordManager, EventTypes, WifiSecurity } from '@lenovo/tan-client-bridge';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';

export class PassWordManagerWidgetItem extends WidgetItem {
	constructor(passwordManager: PasswordManager, commonService: CommonService, private translateService: TranslateService) {
		super({
			id: 'password-manager',
			path: 'security/password-protection',
			type: 'security'
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
		this.detail = status;
		this.status = status === 'installed' ? 2 : 1;

		const translateKey = status === 'installed' ? 'common.securityAdvisor.installed' : 'common.securityAdvisor.notInstalled';
		this.translateService.stream(translateKey).subscribe((value) => {
			this.detail = value;
		});
	}
}
