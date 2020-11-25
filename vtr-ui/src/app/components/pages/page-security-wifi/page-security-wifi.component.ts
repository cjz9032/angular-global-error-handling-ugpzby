import { Component, OnInit, HostListener, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as phoenix from '@lenovo/tan-client-bridge';
import { EventTypes, PluginMissingError } from '@lenovo/tan-client-bridge';
import { CMSService } from 'src/app/services/cms/cms.service';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
import { WifiSecurityService } from 'src/app/services/security/wifi-security.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ModalArticleDetailComponent } from '../../modal/modal-article-detail/modal-article-detail.component';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { Subscription } from 'rxjs/internal/Subscription';
import { ConfigService } from 'src/app/services/config/config.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { SegmentConst } from 'src/app/services/self-select/self-select.service';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { DialogData } from 'src/app/material/material-dialog/material-dialog.interface';
import { UserService } from 'src/app/services/user/user.service';
import { MatDialog } from '@lenovo/material/dialog';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { LenovoIdStatus } from 'src/app/enums/lenovo-id-key.enum';

interface WifiSecurityState {
	state: string; // enabled,disabled,never-used
	isLocationServiceOn: boolean; // true,false
	isLWSPluginInstalled: boolean; // true,false
}

@Component({
	selector: 'vtr-page-security-wifi',
	templateUrl: './page-security-wifi.component.html',
	styleUrls: ['./page-security-wifi.component.scss']
})
export class PageSecurityWifiComponent implements OnInit, OnDestroy, AfterViewInit {
	viewSecChkRoute = 'viewSecChkRoute';
	cardContentPositionA: any = {};
	securityAdvisor: phoenix.SecurityAdvisor;
	wifiSecurity: phoenix.WifiSecurity;
	homeSecurity: phoenix.ConnectedHomeSecurity;
	isShowInvitationCode: boolean;
	securityHealthArticleId = '9CEBB4794F534648A64C5B376FBC2E39';
	securityHealthArticleCategory: string;
	cancelClick = false;
	isOnline = true;
	notificationSubscription: Subscription;
	region = 'us';
	segment: string;
	intervalId: number;
	interval = 15000;
	segmentConst = SegmentConst;
	maxCanTrialTime = 31;
	wsPluginMissingEventHandler = () => {
		this.handleError(new PluginMissingError());
	}
	wsIsLocationServiceOnEventHandler = (value) => {
		this.ngZone.run(() => {
			if (value !== undefined) {
				if (!value && this.wifiSecurity.state === 'enabled' && this.wifiSecurity.hasSystemPermissionShowed) {
					this.dialogService.wifiSecurityLocationDialog(this.wifiSecurity);
				} else if (value) {
					if (this.commonService.getSessionStorageValue(SessionStorageKey.SecurityWifiSecurityLocationFlag) === 'yes') {
						this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityLocationFlag, 'no');
						this.wifiSecurity.enableWifiSecurity();
					}
					this.getTrialDay();
				}
			}
		});
	}
	wsTrialTimeOnEventHandler = (hasTrialDays: number) => {
		if (this.needOpenExpireDialog(hasTrialDays)) {
			this.openExpireDialog(hasTrialDays);
		}
	}
	wsStateEventHandler = (value) => {
		if (value === 'enabled') {
			this.getTrialDay();
		}
	}
	constructor(
		public activeRouter: ActivatedRoute,
		private commonService: CommonService,
		private dialogService: DialogService,
		public modalService: NgbModal,
		public shellService: VantageShellService,
		private cmsService: CMSService,
		public translate: TranslateService,
		private ngZone: NgZone,
		public configService: ConfigService,
		public deviceService: DeviceService,
		private localInfoService: LocalInfoService,
		private localCacheService: LocalCacheService,
		public wifiSecurityService: WifiSecurityService,
		public userService: UserService,
		private metrics: MetricService,
	) { }

	ngOnInit() {
		this.securityAdvisor = this.shellService.getSecurityAdvisor();
		this.homeSecurity = this.shellService.getConnectedHomeSecurity();
		this.segment = this.localCacheService.getLocalCacheValue(LocalStorageKey.LocalInfoSegment, this.segmentConst.ConsumerBase);
		if (this.securityAdvisor) {
			this.wifiSecurity = this.securityAdvisor.wifiSecurity;
		}
		this.localInfoService.getLocalInfo().then(result => {
			this.region = result.GEO;
		}).catch(e => {
			this.region = 'us';
		});
		this.fetchCMSArticles();

		this.wifiSecurity.on(EventTypes.wsPluginMissingEvent, this.wsPluginMissingEventHandler)
			.on(EventTypes.wsIsLocationServiceOnEvent, this.wsIsLocationServiceOnEventHandler)
			.on(EventTypes.wsTrialDaysOnEvent, this.wsTrialTimeOnEventHandler)
			.on(EventTypes.wsStateEvent, this.wsStateEventHandler);
		this.getTrialDay();
		this.sendMetrics();

		this.isOnline = this.commonService.isOnline;
		this.notificationSubscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
		this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityInWifiPage, true);
		this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowPluginMissingDialog, true);
		if (this.wifiSecurity) {
			this.wifiSecurity.refresh();
			this.wifiSecurity.getWifiSecurityState();
			this.wifiSecurity.getWifiHistory();
			this.wifiSecurity.getWifiState().then((res) => { }, (error) => {
				this.dialogService.wifiSecurityLocationDialog(this.wifiSecurity);
			});
		}
		this.pullCHS();
	}

	ngAfterViewInit() {
		const fragment = this.activeRouter.snapshot.queryParams.fragment;
		if (fragment) {
			document.getElementById(fragment).scrollIntoView();
			window.scrollBy(0, -100);
		}
	}

	@HostListener('window:focus')
	onFocus(): void {
		if (this.wifiSecurity) {
			this.wifiSecurity.refresh();
			this.getTrialDay();
		}
		if (!this.intervalId) {
			this.pullCHS();
		}
	}

	ngOnDestroy() {
		this.dialogService.closeDialog('wifi-security-expire-prompt-dialog');
		this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityInWifiPage, false);
		this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowPluginMissingDialog, false);
		if (this.wifiSecurity) {
			this.wifiSecurity.cancelGetWifiHistory();
			this.wifiSecurity.cancelGetWifiSecurityState();
			this.wifiSecurity.off(EventTypes.wsPluginMissingEvent, this.wsPluginMissingEventHandler);
			this.wifiSecurity.off(EventTypes.wsIsLocationServiceOnEvent, this.wsIsLocationServiceOnEventHandler);
			this.wifiSecurity.off(EventTypes.wsTrialDaysOnEvent, this.wsTrialTimeOnEventHandler);
			this.wifiSecurity.off(EventTypes.wsStateEvent, this.wsStateEventHandler);
		}
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
		window.clearInterval(this.intervalId);
	}

	getActivateDeviceStateHandler(value: WifiSecurityState) {
		if (value.state) {
			this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityWifiSecurityState, value.state);
			this.wifiSecurity.state = value.state;
		}
		if (value.isLocationServiceOn !== undefined) {
			this.wifiSecurity.isLocationServiceOn = value.isLocationServiceOn;
		}
	}

	fetchCMSArticles() {
		const queryOptions = {
			Page: 'wifi-security'
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
			error => { }
		);

		this.cmsService.fetchCMSArticle(this.securityHealthArticleId, { Lang: 'EN' }).then((response: any) => {
			if (response && response.Results && response.Results.Category) {
				this.securityHealthArticleCategory = response.Results.Category.map((category: any) => category.Title).join(' ');
			}
		});
	}

	openSecurityHealthArticle(): void {
		const articleDetailModal: NgbModalRef = this.modalService.open(ModalArticleDetailComponent, {
			size: 'lg',
			centered: true,
			windowClass: 'Article-Detail-Modal',
			keyboard: false,
			backdrop: true,
			beforeDismiss: () => {
				if (articleDetailModal.componentInstance.onBeforeDismiss) {
					articleDetailModal.componentInstance.onBeforeDismiss();
				}
				return true;
			}
		});

		articleDetailModal.componentInstance.articleId = this.securityHealthArticleId;
	}

	onToggleChange() {
		if (this.commonService.getSessionStorageValue(SessionStorageKey.SecurityWifiSecurityInWifiPage) === true) {
			if (this.wifiSecurityService.isLWSEnabled) {
				this.wifiSecurity.disableWifiSecurity();
			} else {
				this.wifiSecurity.enableWifiSecurity().catch(() => {
					this.dialogService.wifiSecurityLocationDialog(this.wifiSecurity);
				});
			}
		}
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case NetworkStatus.Online:
				case NetworkStatus.Offline:
					this.isOnline = notification.payload.isOnline;
					break;
				case LenovoIdStatus.SignedOut:
					if (notification.payload === false) {
						this.getTrialDay();
					}
					break;
				case LenovoIdStatus.SignedIn:
					if (notification.payload === true) {
						this.dialogService.closeDialog('wifi-security-expire-prompt-dialog');
					}
					break;
				default:
					break;
			}
		}
	}

	private handleError(err) {
		if (err && err instanceof PluginMissingError) {
			this.dialogService.wifiSecurityErrorMessageDialog();
		}
	}

	private pullCHS(): void {
		this.intervalId = window.setInterval(() => {
			this.homeSecurity.refresh().then(() => {
				this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowPluginMissingDialog, 'notShow');
			});
		}, this.interval);
	}

	private openExpireDialog(hasTrialDays: number) {
		const timeToExpire = this.maxCanTrialTime - hasTrialDays;
		const Dialogtitle = this.translate.instant('security.wifisecurity.expirePromptModal.title');
		const des1 = this.translate.instant('security.wifisecurity.expirePromptModal.description');
		const des2 =  this.translate.instant('security.wifisecurity.expirePromptModal.trialWillExpire');
		const signInButton = this.translate.instant('security.wifisecurity.expirePromptModal.signIn');
		const hasExpired = this.translate.instant('security.wifisecurity.expirePromptModal.hasExpired');
		const ignore = this.translate.instant('security.wifisecurity.expirePromptModal.ignore');
		const days = this.translate.instant('security.wifisecurity.expirePromptModal.days');

		const dialogData: DialogData = {
			title: Dialogtitle,
			subtitle: '',
			description: (hasTrialDays < this.maxCanTrialTime) ? `${des1}<br/>${des2}&nbsp;<b>${timeToExpire}&nbsp;${days}</b>` : hasExpired,
			buttonName: signInButton,
			linkButtonName: (hasTrialDays < this.maxCanTrialTime) ? ignore : '',
			showCloseButton: (hasTrialDays < this.maxCanTrialTime) ? true : false,
		};

		if (!this.dialogService.hasOpenDialog() && this.wifiSecurityService.isLWSEnabled) {
			this.dialogService.openWifiSecurityExpirePromptDialog(dialogData, (hasTrialDays >= this.maxCanTrialTime));
			this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityWifiSecurityPromptDialogPopUpDays, hasTrialDays);
		}
	}

	needOpenExpireDialog(hasTrialDays: number): boolean {
		const lastTrialTime = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityWifiSecurityPromptDialogPopUpDays, 1);
		if (hasTrialDays >= this.maxCanTrialTime) {
			return true;
		}
		return [7, 14, 21, 28].reduce((prev, cur) => {
			return prev || (hasTrialDays >= cur && lastTrialTime < cur);
		}, false);
	}

	sendMetrics() {
		const state = this.wifiSecurityService.isLWSEnabled ? 'enabled' : 'disabled';
		const loginState = this.userService.auth ? 'logged-in' : 'not-logged-in';
		const metricsData = {
			ItemParent: 'Security.wifisecurity',
			ItemName: `wifiSecurity-${state}-lenovoId-${loginState}`,
			ItemType: 'PageView'
		};
		this.metrics.sendMetrics(metricsData);
	}

	getTrialDay() {
		if (this.wifiSecurityService.isLWSEnabled && !this.userService.auth && this.userService.isLenovoIdSupported()) {
			this.wifiSecurity.getWifiSecurityTrialDays();
		}
	}
}
