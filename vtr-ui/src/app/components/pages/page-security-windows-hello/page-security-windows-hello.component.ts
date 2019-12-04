import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { WindowsHello, EventTypes, SecurityAdvisor } from '@lenovo/tan-client-bridge';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { CMSService } from '../../../services/cms/cms.service';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';
import { GuardService } from 'src/app/services/guard/guardService.service';

@Component({
	selector: 'vtr-page-security-windows-hello',
	templateUrl: './page-security-windows-hello.component.html',
	styleUrls: ['./page-security-windows-hello.component.scss']
})
export class PageSecurityWindowsHelloComponent implements OnInit, OnDestroy {

	windowsHello: WindowsHello;
	statusItem: any;
	cardContentPositionA: any = {};
	securityAdvisor: SecurityAdvisor;
	isOnline = this.commonService.isOnline;
	notificationSubscription: Subscription;

	constructor(
		private cmsService: CMSService,
		private commonService: CommonService,
		private guard: GuardService,
		public vantageShellService: VantageShellService,
		private router: Router
	) {	}

	ngOnInit() {
		this.securityAdvisor = this.vantageShellService.getSecurityAdvisor();
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

		this.notificationSubscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});

		if (!this.guard.previousPageName.startsWith('Security')) {
			this.windowsHello.refresh();
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
			Page: 'windows-hello'
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
