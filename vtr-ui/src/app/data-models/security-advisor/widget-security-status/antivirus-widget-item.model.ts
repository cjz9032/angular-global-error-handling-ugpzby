import {
	WidgetItem
} from './widget-item.model';
import {
	Antivirus,
	EventTypes
} from '@lenovo/tan-client-bridge';
import {
	CommonService
} from '../../../services/common/common.service';
import {
	LocalStorageKey
} from '../../../enums/local-storage-key.enum';
import {
	TranslateService
} from '@ngx-translate/core';
import {
	AntivirusService
} from 'src/app/services/security/antivirus.service';
import { AntivirusCommonData } from '../antivirus-common.data.model';

export class AntivirusWidgetItem extends WidgetItem {
	currentPage: string;
	constructor(public antivirus: Antivirus, public commonService: CommonService, public translateService: TranslateService, public antivirusService: AntivirusService) {
		super({
			id: 'sa-widget-lnk-av',
			path: 'security/anti-virus',
			type: 'security',
			isSystemLink: false,
			metricsItemName: 'Anti-Virus',
		}, translateService);

		this.waitTimeout();
		this.translateService.stream('common.securityAdvisor.antiVirus').subscribe((value) => {
			this.title = value;
		});

		this.setWidgetUI(this.antivirusService.GetAntivirusStatus());

		antivirus.on(EventTypes.avRefreshedEvent, (av) => {
			this.setWidgetUI(this.antivirusService.GetAntivirusStatus());
		}).on(EventTypes.avStartRefreshEvent, () => {
			if (this.status === 7) {
				this.translateService.stream('common.securityAdvisor.loading').subscribe((value) => {
					this.detail = value;
					this.status = 4;
					this.retryText = undefined;
				});
				this.waitTimeout();
			}
		});
	}

	private setWidgetUI(antivirusCommonData: AntivirusCommonData) {
		this.currentPage = antivirusCommonData.currentPage;
		this.setAntivirusStatus(antivirusCommonData.antivirus, antivirusCommonData.firewall);
	}

	private setAntivirusStatus(av: boolean | undefined, fw: boolean | undefined) {
		if (typeof av !== 'boolean' && typeof fw !== 'boolean') {
			return;
		}
		if ((av && fw) ||
			(av && typeof fw !== 'boolean') ||
			(fw && typeof av !== 'boolean')) {
			this.translateService.stream('common.securityAdvisor.enabled').subscribe((value) => {
				this.detail = value;
				this.status = 0;
			});
		} else if (!av && !fw) {
			this.translateService.stream('common.securityAdvisor.disabled').subscribe((value) => {
				this.detail = value;
				this.status = 1;
			});
		} else {
			this.translateService.stream('common.securityAdvisor.partiallyProtected').subscribe((value) => {
				this.detail = value;
				this.status = 3;
			});
		}
	}

	retry() {
		this.translateService.stream('common.securityAdvisor.loading').subscribe((value) => {
			this.detail = value;
			this.status = 4;
			this.retryText = undefined;
		});
		this.waitTimeout();
		this.antivirus.refresh();
	}

	waitTimeout() {
		setTimeout(() => {
			if (this.status === 4) {
				this.status = 7;
				this.translateService.stream('common.ui.failedLoad').subscribe((value) => {
					this.detail = value;
				});
				this.translateService.stream('common.ui.retry').subscribe((value) => {
					this.retryText = value;
				});
			}
		}, 15000)
	}
}
