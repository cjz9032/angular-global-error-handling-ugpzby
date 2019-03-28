import { Component, OnInit, HostListener } from '@angular/core';
import { MockWifiSecurity } from '../../../services/mock/mockWifiSecurity.service';
import { ModalWifiSecuriryLocationNoticeComponent } from '../../modal/modal-wifi-securiry-location-notice/modal-wifi-securiry-location-notice.component';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as phoenix from '@lenovo/tan-client-bridge';
import { EventTypes, WifiSecurity, HomeProtection, HomeProtectionDeviceInfo, DeviceInfo } from '@lenovo/tan-client-bridge';
import { CMSService } from 'src/app/services/cms/cms.service';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
import { WifiHomeViewModel, SecurityHealthViewModel, } from 'src/app/data-models/security-advisor/wifisecurity.model';

@Component({
	selector: 'vtr-page-security-wifi',
	templateUrl: './page-security-wifi.component.html',
	styleUrls: ['./page-security-wifi.component.scss']
})
export class PageSecurityWifiComponent implements OnInit {

	title = 'WiFi and Connected Home Security';
	back = 'BACK';
	backarrow = '< ';
	viewSecChkRoute = 'viewSecChkRoute';
	articles: [];
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
		public modalService: NgbModal,
		public shellService: VantageShellService,
		public mockWifiSecurity: MockWifiSecurity,
		private cmsService: CMSService,
		private commonService: CommonService,
		) {
		this.securityAdvisor = shellService.getSecurityAdvisor();
		this.wifiSecurity = this.securityAdvisor.wifiSecurity;
		this.homeProtection = this.securityAdvisor.homeProtection;
		this.wifiSecurity.refresh();
		this.homeProtection.refresh();
		this.homeProtection.getActivateDeviceState(this.ShowInvitationhandler.bind(this));
		this.homeProtection.getDevicePosture(this.startGetDevicePosture);
		const cacheHomeStatus = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityHomeProtectionStatus);
		if (this.homeProtection.status) {
			this.isShowInvitationCode = !(this.homeProtection.status === 'joined');
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityHomeProtectionStatus, this.homeProtection.status);
		} else if (cacheHomeStatus) {
			this.isShowInvitationCode = !(cacheHomeStatus === 'joined');
		}
		this.wifiHomeViewModel = new WifiHomeViewModel(this.wifiSecurity, this.homeProtection, this.commonService);
		this.securityHealthViewModel = new SecurityHealthViewModel(this.wifiSecurity, this.homeProtection, this.commonService);
		this.fetchCMSArticles();
	}

	ngOnInit() {
	}

	ShowInvitationhandler(res: HomeProtectionDeviceInfo) {
		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityHomeProtectionFamilyId, res.familyId);
		if (res.familyId) {
			this.isShowInvitationCode = false;
		} else {
			this.isShowInvitationCode = true;
		}
	}

	startGetDevicePosture(res: Array<DeviceInfo>) {}

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

		this.cmsService.fetchCMSArticles(queryOptions).then(
			(response: any) => {
				console.log('response', response);

				this.articles = response;
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
				if ('isLocationServiceOn' in this.wifiSecurity) {
					this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityIsLocationServiceOn, this.wifiSecurity.isLocationServiceOn);
					if (this.wifiSecurity.isLocationServiceOn) {
						this.wifiSecurity.enableWifiSecurity();
					} else {
						const modal = this.modalService.open(ModalWifiSecuriryLocationNoticeComponent,
							{
								backdrop: 'static'
								, windowClass: 'wifi-security-location-modal'
							});
						modal.componentInstance.header = 'Enable location services';
						modal.componentInstance.description = 'To use Lenovo WiFi Security, you need to enable location services for Lenovo Vantage. Would you like to enable location now?';
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
}
