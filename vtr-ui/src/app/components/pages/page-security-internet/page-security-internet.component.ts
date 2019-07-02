import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { MockService } from 'src/app/services/mock/mock.service';
import { Vpn, EventTypes, SecurityAdvisor } from '@lenovo/tan-client-bridge';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { CMSService } from '../../../services/cms/cms.service';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { RegionService } from 'src/app/services/region/region.service';
import { SecurityAdvisorMockService } from 'src/app/services/security/securityMock.service';

@Component({
	selector: 'vtr-page-security-internet',
	templateUrl: './page-security-internet.component.html',
	styleUrls: ['./page-security-internet.component.scss']
})
export class PageSecurityInternetComponent implements OnInit {

	vpn: Vpn;
	statusItem: any;
	cardContentPositionA: any = {};
	securityAdvisor: SecurityAdvisor;
	backId = 'sa-vpn-btn-back';
	isOnline = true;

	constructor(
		public mockService: MockService,
		private cmsService: CMSService,
		private commonService: CommonService,
		public regionService: RegionService,
		vantageShellService: VantageShellService,
		private securityAdvisorMockService: SecurityAdvisorMockService
	) {
		this.securityAdvisor = vantageShellService.getSecurityAdvisor();
		if (!this.securityAdvisor) {
			this.securityAdvisor = this.securityAdvisorMockService.getSecurityAdvisor();
		}
		this.statusItem = {
			title: 'security.vpn.statusTitle',
			status: 'loading'
		};
		this.vpn = this.securityAdvisor.vpn;
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

	ngOnInit() {
		this.isOnline = this.commonService.isOnline;
		this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
	}

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
			'Page': 'internet-protection'
		};

		this.cmsService.fetchCMSContent(queryOptions).then(
			(response: any) => {
				const cardContentPositionA = this.cmsService.getOneCMSContent(response, 'inner-page-right-side-article-image-background', 'position-A')[0];
				if (cardContentPositionA) {
					this.cardContentPositionA = cardContentPositionA;
					if (this.cardContentPositionA.BrandName) {
						this.cardContentPositionA.BrandName = this.cardContentPositionA.BrandName.split('|')[0];
					}
				}
			},
			error => {
				console.log('fetchCMSContent error', error);
			}
		);
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case NetworkStatus.Online:
				case NetworkStatus.Offline:
					this.isOnline = notification.payload.isOnline;
					break;
				default:
					break;
			}
		}
	}
}
