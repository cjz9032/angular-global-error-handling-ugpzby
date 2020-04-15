import { Component, OnInit, HostListener, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as phoenix from '@lenovo/tan-client-bridge';
import { EventTypes, PluginMissingError } from '@lenovo/tan-client-bridge';
import { CMSService } from 'src/app/services/cms/cms.service';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
import { WifiHomeViewModel } from 'src/app/data-models/security-advisor/wifisecurity.model';
import { ActivatedRoute, Router } from '@angular/router';
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
import { SecurityAdvisorNotifications } from 'src/app/enums/security-advisor-notifications.enum';

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
	wifiHomeViewModel: WifiHomeViewModel;
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
	wsPluginMissingEventHandler = () => {
		this.handleError(new PluginMissingError());
	};
	wsStateEventHandler = (value) => {
		if (value) {
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState, value);
			this.wifiHomeViewModel = new WifiHomeViewModel(this.wifiSecurity, this.commonService);
		}
	};
	wsIsLocationServiceOnEventHandler = (value) => {
		this.ngZone.run(() => {
			if (value !== undefined) {
				this.wifiHomeViewModel = new WifiHomeViewModel(this.wifiSecurity, this.commonService);
				if (!value && this.wifiSecurity.state === 'enabled' && this.wifiSecurity.hasSystemPermissionShowed) {
					this.dialogService.wifiSecurityLocationDialog(this.wifiSecurity);
				} else if (value) {
					if (this.commonService.getSessionStorageValue(SessionStorageKey.SecurityWifiSecurityLocationFlag) === 'yes') {
						this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityLocationFlag, 'no');
						this.wifiSecurity.enableWifiSecurity();
					}
				}
			}
		});
	};

	constructor(
		public activeRouter: ActivatedRoute,
		private commonService: CommonService,
		private dialogService: DialogService,
		public modalService: NgbModal,
		public shellService: VantageShellService,
		private cmsService: CMSService,
		public translate: TranslateService,
		private ngZone: NgZone,
		private router: Router,
		public configService: ConfigService,
		public deviceService: DeviceService,
		private localInfoService: LocalInfoService
	) { }

	ngOnInit() {
		this.securityAdvisor = this.shellService.getSecurityAdvisor();
		this.homeSecurity = this.shellService.getConnectedHomeSecurity();
		this.segment = this.commonService.getLocalStorageValue(LocalStorageKey.LocalInfoSegment, this.segmentConst.Consumer);
		this.wifiSecurity = this.securityAdvisor.wifiSecurity;
		this.wifiHomeViewModel = new WifiHomeViewModel(this.wifiSecurity, this.commonService);
		this.localInfoService.getLocalInfo().then(result => {
			this.region = result.GEO;
		}).catch(e => {
			this.region = 'us';
		});
		this.fetchCMSArticles();

		this.wifiSecurity.on(EventTypes.wsPluginMissingEvent, this.wsPluginMissingEventHandler)
			.on(EventTypes.wsStateEvent, this.wsStateEventHandler)
			.on(EventTypes.wsIsLocationServiceOnEvent, this.wsIsLocationServiceOnEventHandler);

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
		}
		if (!this.intervalId) {
			this.pullCHS();
		}
	}

	ngOnDestroy() {
		this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityInWifiPage, false);
		this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowPluginMissingDialog, false);
		if (this.wifiSecurity) {
			this.wifiSecurity.cancelGetWifiHistory();
			this.wifiSecurity.cancelGetWifiSecurityState();
			this.wifiSecurity.off(EventTypes.wsPluginMissingEvent, this.wsPluginMissingEventHandler);
			this.wifiSecurity.off(EventTypes.wsStateEvent, this.wsStateEventHandler);
			this.wifiSecurity.off(EventTypes.wsIsLocationServiceOnEvent, this.wsIsLocationServiceOnEventHandler);
		}
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
		window.clearInterval(this.intervalId);
	}

	getActivateDeviceStateHandler(value: WifiSecurityState) {
		if (value.state) {
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState, value.state);
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
			if (this.wifiHomeViewModel.isLWSEnabled) {
				this.wifiSecurity.disableWifiSecurity();
			} else {
				this.wifiSecurity.enableWifiSecurity().then(() => {
					this.commonService.sendNotification(SecurityAdvisorNotifications.WifiSecurityTurnedOn);
				})
					.catch(() => {
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
}
