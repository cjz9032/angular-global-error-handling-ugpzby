import { Component, OnInit, HostListener, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as phoenix from '@lenovo/tan-client-bridge';
import { EventTypes, WifiSecurity, HomeProtection, DeviceInfo } from '@lenovo/tan-client-bridge';
import { CMSService } from 'src/app/services/cms/cms.service';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
import { WifiHomeViewModel, SecurityHealthViewModel, } from 'src/app/data-models/security-advisor/wifisecurity.model';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ModalArticleDetailComponent } from '../../modal/modal-article-detail/modal-article-detail.component';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { SecurityService } from 'src/app/services/security/security.service';
import { RegionService } from 'src/app/services/region/region.service';
import { SecurityAdvisorMockService } from 'src/app/services/security/securityMock.service';

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

	@HostListener('window:focus')
	onFocus(): void {
		this.wifiSecurity.refresh();
		this.homeProtection.refresh();
	}
	constructor(
		public activeRouter: ActivatedRoute,
		private commonService: CommonService,
		private securityService: SecurityService,
		public modalService: NgbModal,
		public shellService: VantageShellService,
		private cmsService: CMSService,
		public translate: TranslateService,
		private ngZone: NgZone,
		public regionService: RegionService,
		private securityAdvisorMockService: SecurityAdvisorMockService
	) {
		this.securityAdvisor = shellService.getSecurityAdvisor();
		if (!this.securityAdvisor) {
			this.securityAdvisor = this.securityAdvisorMockService.getSecurityAdvisor();
		}
		this.wifiSecurity = this.securityAdvisor.wifiSecurity;
		this.homeProtection = this.securityAdvisor.homeProtection;
		this.wifiHomeViewModel = new WifiHomeViewModel(this.wifiSecurity, this.homeProtection, this.commonService, this.ngZone, this.securityService);
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
		this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityInWifiPage, 'true');
		this.wifiSecurity.refresh();
		this.homeProtection.refresh();
		this.wifiSecurity.getWifiState().then((res) => {}, (error) => {
			this.securityService.wifiSecurityLocationDialog(this.wifiSecurity);
		});
		this.wifiIsShowMore = this.activeRouter.snapshot.queryParams['isShowMore'];
	}

	ngAfterViewInit() {
		const fragment = this.activeRouter.snapshot.queryParams['fragment'];
		if (fragment) {
			document.getElementById(fragment).scrollIntoView();
			window.scrollBy(0, -100);
		}
	}

	ngOnDestroy() {
		this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityInWifiPage, 'false');
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

	startGetDevicePosture(res: Array<DeviceInfo>) {
		if (res !== undefined) {
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityHomeProtectionDevicePosture, res);
			this.securityHealthViewModel.createHomeDevicePosture(res);
		}
	}

	fetchCMSArticles() {
		const queryOptions = {
			'Page': 'wifi-security'
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

		this.cmsService.fetchCMSArticle(this.securityHealthArticleId, {'Lang': 'EN'}).then((response: any) => {
			if (response && response.Results && response.Results.Category) {
				this.securityHealthArticleCategory = response.Results.Category.map((category: any) => category.Title).join(' ');
			}
		});
	}

	enableWiFiSecurity(event): void {
		try {
			if (this.wifiSecurity) {
				this.wifiSecurity.enableWifiSecurity().then((res) => {
					if ( res === true) {
						this.wifiHomeViewModel.isLWSEnabled = true;
					} else {
						this.wifiHomeViewModel.isLWSEnabled = false;
					}
				}
				, (error) => {
					this.securityService.wifiSecurityLocationDialog(this.wifiSecurity);
				});
			}
		} catch (err) {
			throw new Error('wifiSecurity is null');
		}
	}

	openSecurityHealthArticle(): void {
		const articleDetailModal: NgbModalRef = this.modalService.open(ModalArticleDetailComponent, {
			size: 'lg',
			centered: true,
			windowClass: 'Article-Detail-Modal',
			keyboard : false,
			backdrop: true
		});

		articleDetailModal.componentInstance.articleId = this.securityHealthArticleId;
	}
}
