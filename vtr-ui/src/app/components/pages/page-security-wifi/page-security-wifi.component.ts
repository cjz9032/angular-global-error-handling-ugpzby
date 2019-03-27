import { Component, OnInit, HostListener } from '@angular/core';
import { MockWifiSecurity } from '../../../services/mock/mockWifiSecurity.service';
import { ModalWifiSecuriryLocationNoticeComponent } from '../../modal/modal-wifi-securiry-location-notice/modal-wifi-securiry-location-notice.component';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as phoenix from '@lenovo/tan-client-bridge';
import { EventTypes, WifiSecurity, HomeProtection, HomeProtectionDeviceInfo, DeviceInfo } from '@lenovo/tan-client-bridge';
import { CMSService } from 'src/app/services/cms/cms.service';
import { Title } from '@angular/platform-browser';
import { forEach } from '@angular/router/src/utils/collection';

interface DevicePostureDetail {
	status: number; // 1,2
	title: string; // name
	detail: string; // faied,passed
}
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
		private cmsService: CMSService,
		public mockWifiSecurity: MockWifiSecurity
		) {
		this.securityAdvisor = shellService.getSecurityAdvisor();
		this.wifiSecurity = this.securityAdvisor.wifiSecurity;
		this.homeProtection = this.securityAdvisor.homeProtection;
		this.wifiSecurity.refresh();
		this.homeProtection.refresh();
		this.homeProtection.getActivateDeviceState(this.ShowInvitationhandler.bind(this));
		this.homeProtection.getDevicePosture(this.startGetDevicePosture);
		this.isShowInvitationCode = !(this.homeProtection.status === 'joined');
		this.wifiHomeViewModel = new WifiHomeViewModel(this.wifiSecurity, this.homeProtection);
		this.securityHealthViewModel = new SecurityHealthViewModel(this.wifiSecurity, this.homeProtection);
		this.fetchCMSArticles();
	}

	ngOnInit() {
	}

	ShowInvitationhandler(res: HomeProtectionDeviceInfo) {
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
		try {
			if (this.wifiSecurity) {
				if (this.wifiSecurity.isLocationServiceOn) {
					this.wifiSecurity.enableWifiSecurity();
					// this.wifiSecurity.enableWifiSecurity().then((value) => {
					// 	if (value) {
					// 		this.homeProtection.refresh();
					// 	}
					// });
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
		} catch (err) {
			throw new Error('wifiSecurity is null');
		}
	}
}

export class WifiHomeViewModel {
	wifiSecurity: WifiSecurity;
	homeProtection: HomeProtection;
	isLWSEnabled: boolean; // JS library 为 enabled， disabled 和 never used，但never used 没用，可以改为boolean
	allHistorys: Array<phoenix.WifiDetail>;
	historys: Array<phoenix.WifiDetail>;
	tryNowUrl: string;

	constructor(wifiSecurity: phoenix.WifiSecurity, homeProtection: phoenix.HomeProtection) {
		try {
			this.wifiSecurity = wifiSecurity;
			if (wifiSecurity.state) {
				this.isLWSEnabled = (wifiSecurity.state === 'enabled');
			}
			if (wifiSecurity.wifiHistory) {
				this.allHistorys = wifiSecurity.wifiHistory;
				this.allHistorys = this.mappingHistory(this.allHistorys);
				this.historys = wifiSecurity.wifiHistory.slice(0, 4); // 显示4个history
				this.historys = this.mappingHistory(this.historys);
			}
			if (homeProtection.chsConsoleUrl) {
				this.tryNowUrl = homeProtection.chsConsoleUrl;
			}
		} catch (err) {
			console.log(`${err}`);
		}
		wifiSecurity.on(EventTypes.wsStateEvent, (value) => {
			this.isLWSEnabled = (value === 'enabled');
		});
		wifiSecurity.on(EventTypes.wsWifiHistoryEvent, (value) => {
			this.allHistorys = wifiSecurity.wifiHistory;
			this.allHistorys = this.mappingHistory(this.allHistorys);
			this.historys = wifiSecurity.wifiHistory.slice(0, 4); // 显示4个history
			this.historys = this.mappingHistory(this.historys);
		});
		homeProtection.on(EventTypes.homeChsConsoleUrlEvent, (value) => {
			this.tryNowUrl = value;
		});
	}

	mappingHistory(historys: Array<phoenix.WifiDetail>): Array<phoenix.WifiDetail> {
		const Historys = [];
		historys.forEach( (item) => {
			let i = {ssid: '',
				info: '',
				good: null};
			i = item;
			if (i.info.indexOf('Connected') === -1) {
				const info = i.info.replace(/T/g, ' ');
				const information = 'Connected last' + info;
				i.info = information;
			}
			Historys.push(i);
		});
		return Historys;
	}
}

export class SecurityHealthViewModel {
	isLWSEnabled: boolean;
	homeDevicePosture: Array<DevicePostureDetail> = [];

	constructor(wifiSecurity: phoenix.WifiSecurity, homeProtection: phoenix.HomeProtection) {
		try {
			if (wifiSecurity.state) {
				this.isLWSEnabled = (wifiSecurity.state === 'enabled');
			}
			if (homeProtection.devicePosture) {
				this.homeDevicePosture = [];
				homeProtection.devicePosture.forEach((item) => {
					const it: DevicePostureDetail = {
						status: 0,
						title: '',
						detail: ''
					};
					it.status = item.vulnerable === 'true' ? 2 : 1;
					it.title = this.mappingDevicePosture(item.config);
					it.detail = item.vulnerable === 'true' ? 'PASSED' : 'FAILED';
					this.homeDevicePosture.push(it);
				});
			}
		} catch (err) {
			console.log(`${err}`);
		}
		wifiSecurity.on(EventTypes.wsStateEvent, (value) => {
			this.isLWSEnabled = (value === 'enabled');
		});
		homeProtection.on(EventTypes.homeDevicePostureEvent, (value) => {
			this.homeDevicePosture = [];
			value.forEach((item) => {
				const it: DevicePostureDetail = {
					status: 0,
					title: '',
					detail: ''
				};
				it.status = item.vulnerable === 'true' ? 2 : 1;
				it.title = this.mappingDevicePosture(item.config);
				it.detail = item.vulnerable === 'true' ? 'PASSED' : 'FAILED';
				if (it.title !== 'other') {
					this.homeDevicePosture.push(it);
				}
			});
		});
	}

	mappingDevicePosture(config: string): string {
		let titles: Array<string>;
		let title: string;
		titles = ['Apps from unknown sources', 'Developer mode', 'UAC Notification', 'Anti-Virus availability', 'Drive encryption',
		'Firewall availability', 'Not Activated Windows', 'Security Updates Availability', 'Pin or Password', 'AutomaticUpdatesServiceAvailability'];
		config = config.toLowerCase();
		if (config.indexOf('apps') !== -1) {
			title = titles[0];
		} else if (config.indexOf('developer') !== -1) {
			title = titles[1];
		} else if (config.indexOf('uac') !== -1) {
			title = titles[2];
		} else if (config.indexOf('antivirus') !== -1) {
			title = titles[3];
		} else if (config.indexOf('drive') !== -1) {
			title = titles[4];
		} else if (config.indexOf('firewall') !== -1) {
			title = titles[5];
		} else if (config.indexOf('windows') !== -1) {
			title = titles[6];
		} else if (config.indexOf('security') !== -1) {
			title = titles[7];
		} else if ((config.indexOf('pin') !== -1) || (config.indexOf('password') !== -1)) {
			title = titles[8];
		} else if ((config.indexOf('automatic') !== -1)) {
			title = titles[9];
		} else {
			title = 'other';
		}
		return title;
	}
}
