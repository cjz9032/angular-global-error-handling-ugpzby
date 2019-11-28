import { Component, OnInit, HostListener, Inject, OnDestroy } from '@angular/core';
import { MockService } from 'src/app/services/mock/mock.service';
import { Vpn, EventTypes, SecurityAdvisor } from '@lenovo/tan-client-bridge';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { CMSService } from '../../../services/cms/cms.service';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { GuardService } from '../../../services/guard/guardService.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';

@Component({
	selector: 'vtr-page-security-internet',
	templateUrl: './page-security-internet.component.html',
	styleUrls: ['./page-security-internet.component.scss']
})
export class PageSecurityInternetComponent implements OnInit, OnDestroy {

	vpn: Vpn;
	statusItem: any;
	cardContentPositionA: any = {};
	securityAdvisor: SecurityAdvisor;
	backId = 'sa-vpn-btn-back';
	isOnline = true;
	notificationSubscription: Subscription;

	constructor(
		public mockService: MockService,
		private cmsService: CMSService,
		private commonService: CommonService,
		public vantageShellService: VantageShellService,
		private guard: GuardService,
		private router: Router
	) {	}

	ngOnInit() {
		this.securityAdvisor = this.vantageShellService.getSecurityAdvisor();
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

		this.isOnline = this.commonService.isOnline;
		this.notificationSubscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});

		if (!this.guard.previousPageName.startsWith('Security')) {
			this.vpn.refresh();
		}
	}

	ngOnDestroy() {
		if (this.router.routerState.snapshot.url.indexOf('security') === -1) {
			if (this.securityAdvisor.wifiSecurity) {
				this.securityAdvisor.wifiSecurity.cancelGetWifiSecurityState();
			}
		}
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
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
			Page: 'internet-protection'
		};

		this.cmsService.fetchCMSContent(queryOptions).subscribe(
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
