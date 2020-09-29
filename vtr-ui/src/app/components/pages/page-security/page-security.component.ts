import {
	Component,
	OnInit,
	HostListener,
	OnDestroy
} from '@angular/core';
import {
	VantageShellService
} from '../../../services/vantage-shell/vantage-shell.service';
import * as phoenix from '@lenovo/tan-client-bridge';
import {
	CMSService
} from '../../../services/cms/cms.service';
import {
	AntiVirusLandingViewModel
} from '../../../data-models/security-advisor/widegt-security-landing/antivirus-landing.model';
import {
	PasswordManagerLandingViewModel
} from '../../../data-models/security-advisor/widegt-security-landing/passwordmanager-landing.model';
import {
	VpnLandingViewModel
} from '../../../data-models/security-advisor/widegt-security-landing/vpn-landing.model';
import {
	WifiSecurityLandingViewModel
} from '../../../data-models/security-advisor/widegt-security-landing/wifisecurity-landing.model';
import {
	CommonService
} from 'src/app/services/common/common.service';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { Subscription } from 'rxjs/internal/Subscription';
import { FingerPrintLandingViewModel } from 'src/app/data-models/security-advisor/widegt-security-landing/fingerPrint-landing.model';
import { WindowsActiveLandingViewModel } from 'src/app/data-models/security-advisor/widegt-security-landing/windowsActive-landing.model';
import { UacLandingViewModel } from 'src/app/data-models/security-advisor/widegt-security-landing/uac-landing.model';
import { BitLockerLandingViewModel } from 'src/app/data-models/security-advisor/widegt-security-landing/bitLocker-landing.model';
import { LandingView } from 'src/app/data-models/security-advisor/widegt-security-landing/landing-view.model';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { SecurityStatusService } from 'src/app/services/security/security-status.service';


@Component({
	selector: 'vtr-page-security',
	templateUrl: './page-security.component.html',
	styleUrls: ['./page-security.component.scss']
})

export class PageSecurityComponent implements OnInit, OnDestroy {
	cardContentPositionA: any = {};
	isOnline: boolean;
	notificationSubscription: Subscription;
	showVpn: boolean;
	showDashlane: boolean;
	baseItems = [];
	intermediateItems = [];
	advanceItems = [];
	landingStatus: LandingView = {
		status: 0,
		percent: 100,
		fullyProtected: false
	};
	pluginSupport = true;
	currentPage: string;

	constructor(
		public vantageShellService: VantageShellService,
		private cmsService: CMSService,
		private commonService: CommonService,
		private localCacheService: LocalCacheService,
		private securityStatus: SecurityStatusService,
	) {}

	@HostListener('window: focus')
	onFocus(): void {
		this.refreshAll();
	}

	ngOnInit() {
		this.isOnline = this.commonService.isOnline;
		this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityLandingLevel).then((data) => {
			this.landingStatus = data;
		});
		this.notificationSubscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
		if (this.securityStatus.wifiSecurity) {
			this.securityStatus.wifiSecurity.getWifiSecurityState();
		}
		this.refreshAll();
		this.securityStatus.setSecurityUI();
		// this.securityStatus.updateSecurityItems();
		this.securityStatus.init().then(() => {
			this.baseItems = this.securityStatus.baseItems;
			this.intermediateItems = this.securityStatus.intermediateItems;
			this.advanceItems = this.securityStatus.advanceItems;
			this.landingStatus = this.securityStatus.landingStatus;
			this.pluginSupport = this.securityStatus.pluginSupport;
		});
		this.fetchCMSArticles();
	}

	updateStatus(haveOwnList?: any) {
		this.securityStatus.updateStatus(haveOwnList);
		this.baseItems = this.securityStatus.baseItems;
		this.intermediateItems = this.securityStatus.intermediateItems;
		this.advanceItems = this.securityStatus.advanceItems;
		this.landingStatus = this.securityStatus.landingStatus;
		this.pluginSupport = this.securityStatus.pluginSupport;
	}

	ngOnDestroy() {
		if (this.securityStatus.wifiSecurity) {
			this.securityStatus.wifiSecurity.cancelGetWifiSecurityState();
		}
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
	}

	refreshAll() {
		this.securityStatus.refreshAll().then(() => {
			this.baseItems = this.securityStatus.baseItems;
			this.intermediateItems = this.securityStatus.intermediateItems;
			this.advanceItems = this.securityStatus.advanceItems;
			this.landingStatus = this.securityStatus.landingStatus;
			this.pluginSupport = this.securityStatus.pluginSupport;
		});
	}

	fetchCMSArticles() {
		const queryOptions = {
			Page: 'security'
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
			error => {}
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

	retry(id) {
		this.securityStatus.retry(id);
	}
}
