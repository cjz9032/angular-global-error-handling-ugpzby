import {
	Component,
	OnInit,
	HostListener,
	OnDestroy
} from '@angular/core';
import {
	VantageShellService
} from '../../../services/vantage-shell/vantage-shell.service';
import {
	CMSService
} from '../../../services/cms/cms.service';
import {
	CommonService
} from 'src/app/services/common/common.service';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { Subscription } from 'rxjs/internal/Subscription';
import { LandingView } from 'src/app/data-models/security-advisor/widegt-security-landing/landing-view.model';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { SecurityAdvisor } from '@lenovo/tan-client-bridge';
import { getSecurityLevel, SecurityFeature, securityStatus, retryAntivirus } from 'src/app/data-models/security-advisor/security-status';
import { WindowsHelloService } from 'src/app/services/security/windowsHello.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { toLower } from 'lodash';
import { HypothesisService } from 'src/app/services/hypothesis/hypothesis.service';
import { AntivirusService } from 'src/app/services/security/antivirus.service';
import { TranslateService } from '@ngx-translate/core';


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
	currentPage: string;
	securityAdvisor: SecurityAdvisor;
	securityFeature: SecurityFeature = {
		pluginSupport: false,
		pwdSupport: false,
		vpnSupport: false,
		fingerSupport: false
	};
	haveOwnList: any;
	translations: any;
	securityLevel: any;

	constructor(
		public vantageShellService: VantageShellService,
		private cmsService: CMSService,
		private commonService: CommonService,
		private localCacheService: LocalCacheService,
		private windowsHelloService: WindowsHelloService,
		private deviceService: DeviceService,
		private hypSettings: HypothesisService,
		private antivirusService: AntivirusService,
		private translate: TranslateService
	) {}

	@HostListener('window: focus')
	onFocus(): void {
		this.refreshAll();
	}

	ngOnInit() {
		this.isOnline = this.commonService.isOnline;
		this.landingStatus = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityLandingLevel, { status: 0, fullyProtected: false, percent: 0 });
		this.notificationSubscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
		this.securityAdvisor = this.vantageShellService.getSecurityAdvisor();
		this.refreshAll();
		if (this.securityAdvisor.wifiSecurity) {
			this.securityAdvisor.wifiSecurity.getWifiSecurityState();
		}
		const wsCacheShowOwn: boolean = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityLandingWifiSecurityShowOwn, false);
		const vpnCacheShowOwn: boolean = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityLandingVPNShowOwn, false);
		const pmCacheShowOwn: boolean = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityLandingPasswordManagerShowOwn, false);
		this.haveOwnList = {
			passwordManager: pmCacheShowOwn,
			wifiSecurity: wsCacheShowOwn,
			vpn: vpnCacheShowOwn
		};
		this.securityLevel = {
			landingStatus: this.landingStatus,
			basicView: [securityStatus.avStatus, securityStatus.fwStatus, this.securityFeature.pluginSupport ? securityStatus.waStatus : undefined].filter(i => i !== undefined),
			intermediateView: [this.securityFeature.pwdSupport ? securityStatus.pmStatus : undefined, this.securityFeature.fingerSupport ? securityStatus.whStatus : undefined, this.securityFeature.pluginSupport ? securityStatus.uacStatus : undefined].filter(i => i !== undefined),
			advancedView: [this.securityAdvisor.wifiSecurity.isSupported ? securityStatus.wfStatus : undefined, this.securityFeature.vpnSupport ? securityStatus.vpnStatus : undefined].filter(i => i !== undefined)};
		this.deviceService.getMachineInfo().then(result => {
			this.securityFeature.vpnSupport = true;
			this.securityFeature.pwdSupport = true;
			if (toLower(result && result.country ? result.country : 'US') === 'cn') {
				this.securityFeature.vpnSupport = false;
				this.securityFeature.pwdSupport = false;
			}
		}).catch(e => {
			this.securityFeature.vpnSupport = true;
			this.securityFeature.pwdSupport = true;
		}).finally(() => {
			this.hypSettings.getFeatureSetting('SecurityAdvisor').then((result) => {
				this.securityFeature.pluginSupport = result === 'true';
			})
			.catch((e) => {
				this.securityFeature.pluginSupport = false;
			}).finally(() => {
				this.securityFeature.fingerSupport = this.windowsHelloService.showWindowsHello(this.securityAdvisor.windowsHello);
				this.translate.stream([
					'common.securityAdvisor.loading',
					'common.securityAdvisor.enrolled',
					'common.securityAdvisor.notEnrolled',
					'common.securityAdvisor.installed',
					'common.securityAdvisor.installing',
					'common.securityAdvisor.notInstalled',
					'common.securityAdvisor.enabled',
					'common.securityAdvisor.disabled',
					'common.securityAdvisor.wifi',
					'common.securityAdvisor.antiVirus',
					'common.ui.failedLoad',
					'security.landing.fingerprint',
					'security.landing.fingerprintContent',
					'security.landing.visitFingerprint',
					'security.landing.pwdHealth',
					'security.landing.passwordContent',
					'security.landing.haveOwnPassword',
					'security.landing.goPassword',
					'security.landing.uac',
					'security.landing.uacContent',
					'security.landing.visitUac',
					'security.landing.vpnVirtual',
					'security.landing.haveOwnVpn',
					'security.landing.vpnContent',
					'security.landing.goVpn',
					'security.landing.goWifi',
					'security.landing.wifiContent',
					'security.landing.haveOwnWifi',
					'security.landing.windows',
					'security.landing.windowsActiveContent',
					'security.landing.visitWindows',
					'security.landing.firewall',
					'security.landing.antivirusContent',
					'security.landing.goAntivirus',
					'security.landing.firewallContent',
					'security.landing.goFirewall',
				]).subscribe((trans: any) => {
					this.translations = trans;
					this.securityAdvisor.on('*', () => {
						this.securityLevel = getSecurityLevel(
							this.securityAdvisor,
							this.translations,
							this.haveOwnList,
							this.securityFeature,
							this.antivirusService,
							this.localCacheService);
					});
				});
			});
		});
		this.fetchCMSArticles();
	}

	updateStatus(haveOwnList: any) {
		this.haveOwnList = haveOwnList;
		this.securityAdvisor.refresh().then(() => {
			this.securityLevel = getSecurityLevel(
				this.securityAdvisor,
				this.translations,
				haveOwnList,
				this.securityFeature,
				this.antivirusService,
				this.localCacheService);
		});
	}

	ngOnDestroy() {
		if (this.securityAdvisor.wifiSecurity) {
			this.securityAdvisor.wifiSecurity.cancelGetWifiSecurityState();
		}
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
	}

	refreshAll() {
		this.securityAdvisor.refresh().then(() => {
			this.securityLevel = getSecurityLevel(
				this.securityAdvisor,
				this.translations,
				this.haveOwnList,
				this.securityFeature,
				this.antivirusService,
				this.localCacheService);
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

	retry(id: any) {
		retryAntivirus(id, this.securityAdvisor);
	}
}
