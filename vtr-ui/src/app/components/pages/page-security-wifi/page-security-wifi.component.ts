import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { ModalWifiSecuriryLocationNoticeComponent } from '../../modal/modal-wifi-securiry-location-notice/modal-wifi-securiry-location-notice.component';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as phoenix from '@lenovo/tan-client-bridge';
import { EventTypes, WifiSecurity, HomeProtection, DeviceInfo } from '@lenovo/tan-client-bridge';
import { CMSService } from 'src/app/services/cms/cms.service';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
import { WifiHomeViewModel, SecurityHealthViewModel, } from 'src/app/data-models/security-advisor/wifisecurity.model';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { forEach } from '@angular/router/src/utils/collection';
import { TranslateService } from '@ngx-translate/core';
import { ModalArticleDetailComponent } from '../../modal/modal-article-detail/modal-article-detail.component';

interface DevicePostureDetail {
	status: number; // 1,2
	title: string; // name
	detail: string; // faied,passed
}

interface WifiSecurityState {
	state: string; // enabled,disabled
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
export class PageSecurityWifiComponent implements OnInit, AfterViewInit {

	title = 'security.wifisecurity.header.title';
	back = 'security.wifisecurity.header.back';
	backarrow = '< ';
	viewSecChkRoute = 'viewSecChkRoute';
	cardContentPositionA: any;
	wifiIsShowMore: boolean;
	securityAdvisor: phoenix.SecurityAdvisor;
	wifiSecurity: phoenix.WifiSecurity;
	homeProtection: phoenix.HomeProtection;
	isShowInvitationCode: boolean;
	wifiHomeViewModel: WifiHomeViewModel;
	securityHealthViewModel: SecurityHealthViewModel;
	// chsConsoleUrl : string;

	@HostListener('window:focus')
	onFocus(): void {
		this.wifiSecurity.refresh();
		this.homeProtection.refresh();
	}
	constructor(
		public activeRouter: ActivatedRoute,
		private commonService: CommonService,
		public modalService: NgbModal,
		public shellService: VantageShellService,
		private cmsService: CMSService,
		public translate: TranslateService
	) {
		this.securityAdvisor = shellService.getSecurityAdvisor();
		this.wifiSecurity = this.securityAdvisor.wifiSecurity;
		this.homeProtection = this.securityAdvisor.homeProtection;
		// this.wifiSecurity.refresh();
		// this.homeProtection.refresh();
		this.wifiSecurity.getWifiSecurityState(this.getActivateDeviceStateHandler);
		this.homeProtection.getActivateDeviceState(this.ShowInvitationhandler.bind(this));
		this.homeProtection.getDevicePosture(this.startGetDevicePosture);
		const cacheHomeStatus = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityHomeProtectionStatus);
		let inStorageIsLocationServiceOn: any;
		try {
			inStorageIsLocationServiceOn = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityWifiSecurityIsLocationServiceOn);
		} catch (er) {
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityIsLocationServiceOn, true);
		}
		inStorageIsLocationServiceOn = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityWifiSecurityIsLocationServiceOn);
		if (this.homeProtection.status) {
			this.isShowInvitationCode = !(this.homeProtection.status === 'joined');
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityHomeProtectionStatus, this.homeProtection.status);
		} else if (cacheHomeStatus) {
			this.isShowInvitationCode = !(cacheHomeStatus === 'joined');
		}
		if (this.wifiSecurity.isLocationServiceOn !== undefined) {
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityIsLocationServiceOn, this.wifiSecurity.isLocationServiceOn);
			if (this.wifiSecurity.isLocationServiceOn === false && inStorageIsLocationServiceOn !== false) {
				const modal = this.modalService.open(ModalWifiSecuriryLocationNoticeComponent,
					{
						backdrop: 'static'
						, windowClass: 'wifi-security-location-modal'
					});
				modal.componentInstance.header = 'Enable location services';
				modal.componentInstance.description = 'To use Lenovo WiFi Security, you need to enable location services for Lenovo Vantage. Would you like to enable location now?';
				modal.componentInstance.url = 'ms-settings:privacy-location';
				// modal.componentInstance.isfirstOpen = true;
				this.wifiSecurity.on(EventTypes.wsIsLocationServiceOnEvent, (value: any) => {
					if (value !== undefined) {
						this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityIsLocationServiceOn, value);
					}
					if (value) {
						modal.close();
					}
				});
			}
		}
		this.wifiHomeViewModel = new WifiHomeViewModel(this.wifiSecurity, this.homeProtection, this.commonService);
		this.securityHealthViewModel = new SecurityHealthViewModel(this.wifiSecurity, this.homeProtection, this.commonService, this.translate);
		this.fetchCMSArticles();
	}

	ngOnInit() {
		this.wifiIsShowMore = this.activeRouter.snapshot.queryParams['isShowMore'];
	}

	ngAfterViewInit() {
		const fragment = this.activeRouter.snapshot.queryParams['fragment'];
		document.getElementById(fragment).scrollIntoView();
		window.scrollBy(0, -100);
	}

	getActivateDeviceStateHandler(value: WifiSecurityState) {
		if (value.state) {
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState, value.state);
		}
		if (value.isLocationServiceOn !== undefined) {
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityIsLocationServiceOn, value.isLocationServiceOn);
		}
	}

	ShowInvitationhandler(res: HomeProtectionDeviceInfo) {
		if (res.error.toLowerCase() === 'success') {
			if (res.familyId) {
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityHomeProtectionStatus, 'joined');
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityHomeProtectionFamilyId, res.familyId);
				this.isShowInvitationCode = false;
			} else {
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityHomeProtectionStatus, 'unjoined');
				this.isShowInvitationCode = true;
			}
		}
	}

	startGetDevicePosture(res: Array<DeviceInfo>) {
		if (res !== undefined) {
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityHomeProtectionDevicePosture, res);
		}
	}

	fetchCMSArticles() {
		const queryOptions = {
			'Page': 'wifi-security',
			'Lang': 'EN',
			'GEO': 'US',
			'OEM': 'Lenovo',
			'OS': 'Windows',
			'Segment': 'SMB',
			'Brand': 'Lenovo'
		};

		this.cmsService.fetchCMSContent(queryOptions).then(
			(response: any) => {
				this.cardContentPositionA = this.cmsService.getOneCMSContent(response, 'inner-page-right-side-article-image-background', 'position-A')[0];

				this.cardContentPositionA.BrandName = this.cardContentPositionA.BrandName.split('|')[0];
			},
			error => {
				console.log('fetchCMSContent error', error);
			}
		);
	}

	enableWiFiSecurity(event): void {
		const cacheIsLocationServiceOn = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityWifiSecurityIsLocationServiceOn);
		try {
			if (this.wifiSecurity) {
				if (this.wifiSecurity.isLocationServiceOn !== undefined) {
					this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityIsLocationServiceOn, this.wifiSecurity.isLocationServiceOn);
					if (this.wifiSecurity.isLocationServiceOn) {
						this.wifiSecurity.enableWifiSecurity();
					} else {
						const modal = this.modalService.open(ModalWifiSecuriryLocationNoticeComponent,
							{
								backdrop: 'static'
								, windowClass: 'wifi-security-location-modal'
							});
						modal.componentInstance.header = 'security.wifisecurity.locationmodal.title';
						modal.componentInstance.description = 'security.wifisecurity.locationmodal.describe';
						modal.componentInstance.url = 'ms-settings:privacy-location';
						this.wifiSecurity.on(EventTypes.wsIsLocationServiceOnEvent, (value) => {
							if (value) {
								modal.close();
							}
						});
					}
				}
			}
		} catch (err) {
			throw new Error('wifiSecurity is null');
		}
	}

	openSecurityHealthArticle(): void {
		const articleDetailModal: NgbModalRef = this.modalService.open(ModalArticleDetailComponent, {
			size: 'lg',
			centered: true,
			windowClass: 'Article-Detail-Modal'
		});

		articleDetailModal.componentInstance.articleId = '9CEBB4794F534648A64C5B376FBC2E39';
	}
}
