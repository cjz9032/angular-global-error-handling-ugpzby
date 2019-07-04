import { Component, OnInit, HostListener } from '@angular/core';
import { MockService } from 'src/app/services/mock/mock.service';
import { WindowsHello, EventTypes, SecurityAdvisor } from '@lenovo/tan-client-bridge';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { CMSService } from '../../../services/cms/cms.service';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { RegionService } from 'src/app/services/region/region.service';
import { SecurityAdvisorMockService } from 'src/app/services/security/securityMock.service';

@Component({
	selector: 'vtr-page-security-windows-hello',
	templateUrl: './page-security-windows-hello.component.html',
	styleUrls: ['./page-security-windows-hello.component.scss']
})
export class PageSecurityWindowsHelloComponent implements OnInit {

	windowsHello: WindowsHello;
	statusItem: any;
	cardContentPositionA: any = {};
	securityAdvisor: SecurityAdvisor;
	backId = 'sa-wh-btn-back';
	isOnline = this.commonService.isOnline;

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
			title: 'security.windowsHello.statusTitle',
			status: 'loading'
		};
		this.windowsHello = this.securityAdvisor.windowsHello;
		this.updateStatus();
		this.windowsHello.on(EventTypes.helloFingerPrintStatusEvent, () => {
			this.updateStatus();
		});
		this.fetchCMSArticles();
	}

	ngOnInit() {
		this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});

	}

	setUpWindowsHello(): void {
		this.windowsHello.launch();
	}

	@HostListener('window:focus')
	onFocus(): void {
		this.windowsHello.refresh();
	}

	private updateStatus(): void {
		const cacheStatus = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus);
		if (cacheStatus) {
			this.statusItem.status = cacheStatus;
		}
		if (this.windowsHello && (this.windowsHello.fingerPrintStatus)) {
			if (this.windowsHello.fingerPrintStatus === 'active') {
				this.statusItem.status = 'enabled';
			} else {
				this.statusItem.status = 'disabled';
			}
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus, this.statusItem.status);
		}
	}

	fetchCMSArticles() {
		const queryOptions = {
			'Page': 'windows-hello'
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
