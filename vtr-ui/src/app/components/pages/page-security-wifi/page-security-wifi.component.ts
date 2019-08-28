import { Component, OnInit, HostListener, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as phoenix from '@lenovo/tan-client-bridge';
import { DeviceInfo, PluginMissingError, EventTypes } from '@lenovo/tan-client-bridge';
import { CMSService } from 'src/app/services/cms/cms.service';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
import { WifiHomeViewModel, SecurityHealthViewModel, } from 'src/app/data-models/security-advisor/wifisecurity.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ModalArticleDetailComponent } from '../../modal/modal-article-detail/modal-article-detail.component';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { SecurityAdvisorMockService } from 'src/app/services/security/securityMock.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { GuardService } from '../../../services/guard/security-guardService.service';
import { Subscription } from 'rxjs/internal/Subscription';

interface DevicePostureDetail {
	status: number; // 1,2
	title: string; // name
	detail: string; // faied,passed
}

interface WifiSecurityState {
	state: string; // enabled,disabled,never-used
	isLocationServiceOn: boolean; // true,false
	isLWSPluginInstalled: boolean; // true,false
}

interface HomeProtectionDeviceInfo {
	error: string;
	familyId: string;
	nickName: string;
	imageUrl: string;
}

@Component({
	selector: 'vtr-page-security-wifi',
	templateUrl: './page-security-wifi.component.html',
	styleUrls: ['./page-security-wifi.component.scss']
})
export class PageSecurityWifiComponent implements OnInit, OnDestroy, AfterViewInit {
	backarrow = '< ';
	backId = 'sa-ws-btn-back';
	viewSecChkRoute = 'viewSecChkRoute';
	cardContentPositionA: any = {};
	wifiIsShowMore: boolean;
	securityAdvisor: phoenix.SecurityAdvisor;
	wifiSecurity: phoenix.WifiSecurity;
	homeProtection: phoenix.HomeProtection;
	isShowInvitationCode: boolean;
	wifiHomeViewModel: WifiHomeViewModel;
	securityHealthViewModel: SecurityHealthViewModel;
	securityHealthArticleId = '9CEBB4794F534648A64C5B376FBC2E39';
	securityHealthArticleCategory: string;
	cancelClick = false;
	isOnline = true;
	notificationSubscription: Subscription;

	constructor(
		public activeRouter: ActivatedRoute,
		private commonService: CommonService,
		private dialogService: DialogService,
		public modalService: NgbModal,
		public shellService: VantageShellService,
		private cmsService: CMSService,
		public translate: TranslateService,
		private ngZone: NgZone,
		private securityAdvisorMockService: SecurityAdvisorMockService,
		private guard: GuardService,
		private router: Router
	) {
		this.securityAdvisor = shellService.getSecurityAdvisor();
		if (!this.securityAdvisor) {
			this.securityAdvisor = this.securityAdvisorMockService.getSecurityAdvisor();
		}
		this.wifiSecurity = this.securityAdvisor.wifiSecurity;
		this.homeProtection = this.securityAdvisor.homeProtection;
		this.wifiHomeViewModel = new WifiHomeViewModel(this.wifiSecurity, this.homeProtection, this.commonService, this.ngZone, this.dialogService);
		this.securityHealthViewModel = new SecurityHealthViewModel(this.wifiSecurity, this.homeProtection, this.commonService, this.translate, this.ngZone);
		const cacheHomeStatus = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityHomeProtectionStatus);
		if (this.homeProtection.status) {
			this.isShowInvitationCode = !(this.homeProtection.status === 'joined');
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityHomeProtectionStatus, this.homeProtection.status);
		} else if (cacheHomeStatus) {
			this.isShowInvitationCode = !(cacheHomeStatus === 'joined');
		}
		this.wifiSecurity.on('cancelClick', () => {
			this.cancelClick = true;
		}).on('cancelClickFinish', () => {
			this.cancelClick = false;
		});
		this.fetchCMSArticles();
	}

	ngOnInit() {
		this.isOnline = this.commonService.isOnline;
		this.notificationSubscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
		this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityInWifiPage, true);
		this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowPluginMissingDialog, true);
		if (this.homeProtection) {
			this.homeProtection.refresh().catch((err) => this.handleError(err));
		}

		if (this.wifiSecurity) {
			if (this.guard.previousPageName !== 'Dashboard' && !this.guard.previousPageName.startsWith('Security')) {
				this.wifiSecurity.refresh().catch((err) => this.handleError(err));
				this.wifiSecurity.getWifiSecurityState().catch((err) => this.handleError(err));
			}
			this.wifiSecurity.getWifiState().then((res) => { }, (error) => {
				this.dialogService.wifiSecurityLocationDialog(this.wifiSecurity);
			});
		}
		this.wifiIsShowMore = this.activeRouter.snapshot.queryParams.isShowMore;
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
			this.wifiSecurity.refresh().catch((err) => this.handleError(err));
		}
		if (this.homeProtection) {
			this.homeProtection.refresh().catch((err) => this.handleError(err));
		}
	}

	ngOnDestroy() {
		this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityInWifiPage, false);
		this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowPluginMissingDialog, false);
		if (this.router.routerState.snapshot.url.indexOf('security') === -1 && this.router.routerState.snapshot.url.indexOf('dashboard') === -1) {
			if (this.securityAdvisor.wifiSecurity) {
				this.securityAdvisor.wifiSecurity.cancelGetWifiSecurityState();
			}
		}
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
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

	ShowInvitationhandler(res: HomeProtectionDeviceInfo) {
		if (res.error.toLowerCase() === 'success') {
			if (res.familyId) {
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityHomeProtectionStatus, 'joined');
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityHomeProtectionFamilyId, res.familyId);
				this.homeProtection.familyId = res.familyId;
				this.homeProtection.status = 'joined';
				this.isShowInvitationCode = false;
			} else {
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityHomeProtectionStatus, 'unjoined');
				this.homeProtection.status = 'unjoined';
				this.isShowInvitationCode = true;
			}
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
			error => {
				console.log('fetchCMSContent error', error);
			}
		);

		this.cmsService.fetchCMSArticle(this.securityHealthArticleId, { Lang: 'EN' }).then((response: any) => {
			if (response && response.Results && response.Results.Category) {
				this.securityHealthArticleCategory = response.Results.Category.map((category: any) => category.Title).join(' ');
			}
		});
	}

	enableWiFiSecurity(event): void {
		if (this.wifiSecurity) {
			this.wifiSecurity.enableWifiSecurity().then((res) => {
				if (res === true) {
					this.wifiHomeViewModel.isLWSEnabled = true;
				} else {
					this.wifiHomeViewModel.isLWSEnabled = false;
				}
			}
				, (error) => {
					this.dialogService.wifiSecurityLocationDialog(this.wifiSecurity);
				});
		}
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
}
