import { Component, OnInit, HostListener } from '@angular/core';
import { MockService } from 'src/app/services/mock/mock.service';
import { PasswordManager, EventTypes } from '@lenovo/tan-client-bridge';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { CMSService } from '../../../services/cms/cms.service';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';

@Component({
	selector: 'vtr-page-security-password',
	templateUrl: './page-security-password.component.html',
	styleUrls: ['./page-security-password.component.scss']
})
export class PageSecurityPasswordComponent implements OnInit {

	title = 'Password Health';

	passwordManager: PasswordManager;
	statusItem: any;
	cardContentPositionA: any;

	constructor(
		public mockService: MockService,
		private commonService: CommonService,
		private cmsService: CMSService,
		vantageShellService: VantageShellService
	) {
		this.passwordManager = vantageShellService.getSecurityAdvisor().passwordManager;
		this.statusItem = {
			title: 'DASHLANE PASSWORD MANAGER'
		};
		const cacheStatus = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityPasswordManagerStatus);
		if (cacheStatus) {
			this.statusItem.status = cacheStatus;
		}
		if (this.passwordManager && this.passwordManager.status) {
			this.statusItem.status = this.passwordManager.status;
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityPasswordManagerStatus, this.statusItem.status);
		}
		this.passwordManager.on(EventTypes.pmStatusEvent, (status: string) => {
			this.statusItem.status = status;
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityPasswordManagerStatus, this.statusItem.status);
		});
		this.fetchCMSArticles();
	}

	ngOnInit() { }

	getDashLane(): void {
		this.passwordManager.download();
	}

	openDashLane(): void {
		this.passwordManager.launch();
	}

	@HostListener('window:focus')
	onFocus(): void {
		this.passwordManager.refresh();
	}

	fetchCMSArticles() {
		const queryOptions = {
			'Page': 'password-protection',
			'Lang': 'EN',
			'GEO': 'US',
			'OEM': 'Lenovo',
			'OS': 'Windows',
			'Segment': 'SMB',
			'Brand': 'Lenovo'
		};

		this.cmsService.fetchCMSContent(queryOptions).then(
			(response: any) => {
				this.cardContentPositionA = this.cmsService.getOneCMSContent(response, 'inner-page-right-side-article-image-background', 'position-A')[0];

				this.cardContentPositionA.BrandName = this.cardContentPositionA.BrandName.split('|')[0];
			},
			error => {
				console.log('fetchCMSContent error', error);
			}
		);
	}
}
