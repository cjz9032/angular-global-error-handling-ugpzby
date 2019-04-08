import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { MockService } from 'src/app/services/mock/mock.service';
import { Vpn, EventTypes, SecurityAdvisor } from '@lenovo/tan-client-bridge';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { CMSService } from '../../../services/cms/cms.service';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';

@Component({
	selector: 'vtr-page-security-internet',
	templateUrl: './page-security-internet.component.html',
	styleUrls: ['./page-security-internet.component.scss']
})
export class PageSecurityInternetComponent implements OnInit {

	vpn: Vpn;
	statusItem: any;
	cardContentPositionA: any;
	securityAdvisor: SecurityAdvisor;

	constructor(
		public mockService: MockService,
		private cmsService: CMSService,
		private commonService: CommonService,
		vantageShellService: VantageShellService
	) {
		this.securityAdvisor = vantageShellService.getSecurityAdvisor();
		this.statusItem = {
			title: 'security.vpn.statusTitle'
		};
		this.vpn = vantageShellService.getSecurityAdvisor().vpn;
		const cacheStatus: string = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityVPNStatus);
		if (cacheStatus) {
			this.statusItem.status = cacheStatus;
		}
		if (this.vpn && this.vpn.status) {
			this.statusItem.status = this.vpn.status;
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityVPNStatus, this.statusItem.status);
		}
		this.vpn.on(EventTypes.vpnStatusEvent, (status: string) => {
			this.statusItem.status = status;
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityVPNStatus, this.statusItem.status);
		});
		this.fetchCMSArticles();
	}

	ngOnInit() { }

	getSurfEasy(): void {
		this.vpn.download();
	}

	openSurfEasy(): void {
		this.vpn.launch();
	}

	@HostListener('window:focus')
	onFocus(): void {
		this.vpn.refresh();
	}

	fetchCMSArticles() {
		const queryOptions = {
			'Page': 'internet-protection',
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
