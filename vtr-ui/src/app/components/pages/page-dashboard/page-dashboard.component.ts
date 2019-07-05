import { Component, OnInit, SecurityContext } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { SecurityAdvisor } from '@lenovo/tan-client-bridge';

import { MockService } from '../../../services/mock/mock.service';
import { QaService } from '../../../services/qa/qa.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { Status } from 'src/app/data-models/widgets/status.model';
import { CommonService } from 'src/app/services/common/common.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { LenovoIdKey } from 'src/app/enums/lenovo-id-key.enum';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { FeedbackFormComponent } from '../../feedback-form/feedback-form/feedback-form.component';
import { SystemUpdateService } from 'src/app/services/system-update/system-update.service';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { UserService } from '../../../services/user/user.service';
import { QA } from 'src/app/data-models/qa/qa.model';
import { AndroidService } from 'src/app/services/android/android.service';

@Component({
	selector: 'vtr-page-dashboard',
	templateUrl: './page-dashboard.component.html',
	styleUrls: ['./page-dashboard.component.scss'],
	providers: [NgbModalConfig, NgbModal]
})
export class PageDashboardComponent implements OnInit {
	firstName = 'User';
	submit = this.translate.instant('dashboard.feedback.form.button');
	feedbackButtonText = this.submit;
	securityAdvisor: SecurityAdvisor;
	public systemStatus: Status[] = [];
	public securityStatus: Status[] = [];
	public isOnline = true;

	heroBannerItems = [];
	cardContentPositionA: any = {};
	cardContentPositionB: any = {};
	cardContentPositionC: any = {};
	cardContentPositionD: any = {};
	cardContentPositionE: any = {};
	cardContentPositionF: any = {};

	/*forwardLink = {
		path: 'dashboard-customize',
		label: 'Customize Dashboard'
	};*/

	constructor(
		private router: Router,
		public dashboardService: DashboardService,
		public mockService: MockService,
		public qaService: QaService,
		private modalService: NgbModal,
		config: NgbModalConfig,
		private commonService: CommonService,
		private configService: ConfigService,
		public deviceService: DeviceService,
		private cmsService: CMSService,
		private systemUpdateService: SystemUpdateService,
		public userService: UserService,
		private translate: TranslateService,
		vantageShellService: VantageShellService,
		public androidService: AndroidService,
		private sanitizer: DomSanitizer
	) {
		config.backdrop = 'static';
		config.keyboard = false;
		this.securityAdvisor = vantageShellService.getSecurityAdvisor();

		this.setDefaultSystemStatus();
		this.setDefaultSecurityStatus();

		translate.stream('dashboard.feedback.form.button').subscribe((value) => {
			this.submit = value;
			this.feedbackButtonText = this.submit;
		});
		// Evaluate the translations for QA on language Change
		this.qaService.setTranslationService(this.translate);
		this.qaService.setCurrentLangTranslations();

	}

	ngOnInit() {
		// reroute default application's default URL if gaming device
		if (this.deviceService.isGaming) {
			this.router.navigateByUrl(this.configService.getMenuItems(this.deviceService.isGaming)[0].path);
		}

		const self = this;
		this.translate.stream('lenovoId.user').subscribe((value) => {
			if (!self.userService.auth) {
				self.firstName = value;
			} else {
				self.firstName = this.userService.firstName;
			}
		});
		this.isOnline = this.commonService.isOnline;
		if (this.dashboardService.isShellAvailable) {
			console.log('PageDashboardComponent.getSystemInfo');
			this.getSystemInfo();
			// this.getSecurityStatus();
		}

		this.setDefaultCMSContent();

		const queryOptions = {
			'Page': 'dashboard',
			'Lang': 'EN',
			'GEO': 'US',
			'OEM': 'Lenovo',
			'OS': 'Windows',
			'Segment': 'SMB',
			'Brand': 'Lenovo'
		};

		this.cmsService.fetchCMSContent(queryOptions).then(
			(response: any) => {
				const heroBannerItems = this.cmsService.getOneCMSContent(response, 'home-page-hero-banner', 'position-A').map((record, index) => {
					return {
						'albumId': 1,
						'id': record.Id,
						'source': this.sanitizer.sanitize(SecurityContext.HTML, record.Title),
						'title': this.sanitizer.sanitize(SecurityContext.HTML, record.Description),
						'url': record.FeatureImage,
						'ActionLink': record.ActionLink
					};
				});
				if (heroBannerItems && heroBannerItems.length) {
					this.heroBannerItems = heroBannerItems;
				}

				const cardContentPositionB = this.cmsService.getOneCMSContent(response, 'half-width-title-description-link-image', 'position-B')[0];
				if (cardContentPositionB) {
					this.cardContentPositionB = cardContentPositionB;
					if (this.cardContentPositionB.BrandName) {
						this.cardContentPositionB.BrandName = this.cardContentPositionB.BrandName.split('|')[0];
					}
				}

				const cardContentPositionC = this.cmsService.getOneCMSContent(response, 'half-width-title-description-link-image', 'position-C')[0];
				if (cardContentPositionC) {
					this.cardContentPositionC = cardContentPositionC;
					if (this.cardContentPositionC.BrandName) {
						this.cardContentPositionC.BrandName = this.cardContentPositionC.BrandName.split('|')[0];
					}
				}

				const cardContentPositionD = this.cmsService.getOneCMSContent(response, 'full-width-title-image-background', 'position-D')[0];
				if (cardContentPositionD) {
					this.cardContentPositionD = cardContentPositionD;
				}

				const cardContentPositionE = this.cmsService.getOneCMSContent(response, 'half-width-top-image-title-link', 'position-E')[0];
				if (cardContentPositionE) {
					this.cardContentPositionE = cardContentPositionE;
				}

				const cardContentPositionF = this.cmsService.getOneCMSContent(response, 'half-width-top-image-title-link', 'position-F')[0];
				if (cardContentPositionF) {
					this.cardContentPositionF = cardContentPositionF;
				}
			},
			error => {
				console.log('fetchCMSContent error', error);
			}
		);

		this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});

	}

	onFeedbackModal() {
		this.modalService.open(FeedbackFormComponent, {
			backdrop: 'static',
			size: 'lg',
			centered: true,
			windowClass: 'feedback-modal'
		});
	}

	public onConnectivityClick($event: any) {
	}

	private setDefaultCMSContent() {
		this.heroBannerItems = [{
			albumId: 1,
			id: 1,
			source: 'Vantage Beta',
			title: 'Welcome to the next generation of Lenovo Vantage!',
			url: './../../../../assets/cms-cache/Vantage3Hero-zone0.jpg',
			ActionLink: null
		}];

		this.cardContentPositionB = {
			Title: '',
			ShortTitle: '',
			Description: '',
			FeatureImage: './../../../../assets/cms-cache/Alexa4x3-zone1.jpg',
			Action: '',
			ActionType: 'External',
			ActionLink: null,
			BrandName: '',
			BrandImage: '',
			Priority: 'P1',
			Page: 'dashboard',
			Template: 'half-width-title-description-link-image',
			Position: 'position-B',
			ExpirationDate: null,
			Filters: null
		};

		this.cardContentPositionC = {
			Title: '',
			ShortTitle: '',
			Description: '',
			FeatureImage: './../../../../assets/cms-cache/Security4x3-zone2.jpg',
			Action: '',
			ActionType: 'External',
			ActionLink: null,
			BrandName: '',
			BrandImage: '',
			Priority: 'P1',
			Page: 'dashboard',
			Template: 'half-width-title-description-link-image',
			Position: 'position-C',
			ExpirationDate: null,
			Filters: null
		};

		this.cardContentPositionD = {
			Title: '',
			ShortTitle: '',
			Description: '',
			FeatureImage: './../../../../assets/cms-cache/Gamestore8x3-zone3.jpg',
			Action: '',
			ActionType: 'External',
			ActionLink: null,
			BrandName: '',
			BrandImage: '',
			Priority: 'P1',
			Page: 'dashboard',
			Template: 'full-width-title-image-background',
			Position: 'position-D',
			ExpirationDate: null,
			Filters: null
		};

		this.cardContentPositionE = {
			Title: '',
			ShortTitle: '',
			Description: '',
			FeatureImage: './../../../../assets/cms-cache/content-card-4x4-support.jpg',
			Action: '',
			ActionType: 'External',
			ActionLink: null,
			BrandName: '',
			BrandImage: '',
			Priority: 'P1',
			Page: 'dashboard',
			Template: 'half-width-top-image-title-link',
			Position: 'position-E',
			ExpirationDate: null,
			Filters: null
		};

		this.cardContentPositionF = {
			Title: '',
			ShortTitle: '',
			Description: '',
			FeatureImage: './../../../../assets/cms-cache/content-card-4x4-award.jpg',
			Action: '',
			ActionType: 'External',
			ActionLink: null,
			BrandName: '',
			BrandImage: '',
			Priority: 'P1',
			Page: 'dashboard',
			Template: 'half-width-top-image-title-link',
			Position: 'position-F',
			ExpirationDate: null,
			Filters: null
		};
	}

	// private getFormatedTitle(title) {
	// 	var formatedTitle = 'Looking energized today ' + title + '!';
	// 	return formatedTitle;
	// }

	private getSystemInfo() {
		this.dashboardService.getSystemInfo()
			.then((value: any) => {
				this.systemStatus = this.mapSystemInfoResponse(value);
				console.log('getSystemInfo.then', value, this.systemStatus);
			}).catch(error => {
				console.error('getSystemInfo', error);
			});
	}

	private getSecurityStatus() {
		this.dashboardService.getSecurityStatus()
			.then((value: any) => {
				this.securityStatus = this.mapSecurityStatusResponse(value);
				console.log('getSecurityStatus.then', value);
			}).catch(error => {
				console.error('getSecurityStatus', error);
			});
	}

	private setDefaultSystemStatus() {
		const memory = new Status();
		memory.status = 4;
		memory.id = 'memory';

		this.translate.stream('dashboard.systemStatus.memory.title').subscribe((value) => {
			memory.title = value;
		});

		this.translate.stream('dashboard.systemStatus.memory.detail.notFound').subscribe((value) => {
			memory.detail = value;
		});

		memory.path = 'ms-settings:about';
		memory.asLink = false;
		memory.isSystemLink = true;
		memory.type = 'system';
		this.systemStatus[0] = memory;

		const disk = new Status();
		disk.status = 4;
		disk.id = 'disk';

		this.translate.stream('dashboard.systemStatus.diskSpace.title').subscribe((value) => {
			disk.title = value;
		});

		this.translate.stream('dashboard.systemStatus.diskSpace.detail.notFound').subscribe((value) => {
			disk.detail = value;
		});

		disk.path = 'ms-settings:storagesense';
		disk.asLink = false;
		disk.isSystemLink = true;
		disk.type = 'system';
		this.systemStatus[1] = disk;


		const warranty = new Status();
		warranty.status = 4;
		warranty.id = 'warranty';

		this.translate.stream('dashboard.systemStatus.warranty.title').subscribe((value) => {
			warranty.title = value;
		});

		this.translate.stream('dashboard.systemStatus.warranty.detail.notFound').subscribe((value) => {
			warranty.detail = value;
		});


		warranty.path = '/support';
		warranty.asLink = false;
		/* warranty.isSystemLink = true; */
		warranty.isSystemLink = false;
		warranty.type = 'system';
		this.systemStatus[2] = warranty;

		const systemUpdate = new Status();
		systemUpdate.status = 4;
		systemUpdate.id = 'systemupdate';

		this.translate.stream('dashboard.systemStatus.systemUpdate.title').subscribe((value) => {
			systemUpdate.title = value;
		});

		this.translate.stream('dashboard.systemStatus.systemUpdate.detail.update').subscribe((value) => {
			systemUpdate.detail = value;
		});


		systemUpdate.path = 'device/system-updates';
		systemUpdate.asLink = true;
		systemUpdate.isSystemLink = false;
		systemUpdate.type = 'system';
		this.systemStatus[3] = systemUpdate;

	}
	private mapSystemInfoResponse(response: any): Status[] {
		const systemStatus: Status[] = [];
		if (response) {
			const memory = new Status();
			memory.status = 1;
			memory.id = 'memory';

			memory.title = this.translate.instant('dashboard.systemStatus.memory.title'); // 'Memory';

			memory.detail = this.translate.instant('dashboard.systemStatus.memory.detail.notFound'); // 'Memory not found';
			this.translate.stream('dashboard.systemStatus.memory.title').subscribe((value) => {
				memory.title = value;
			});
			this.translate.stream('dashboard.systemStatus.memory.detail.notFound').subscribe((value) => {
				memory.detail = value;
			});
			memory.path = 'ms-settings:about';
			memory.asLink = false;
			memory.isSystemLink = true;
			memory.type = 'system';

			if (response.memory) {
				const { total, used } = response.memory;
				memory.detail = `${this.commonService.formatBytes(used, 1)} ${this.translate.instant('dashboard.systemStatus.memory.detail.of')} ${this.commonService.formatBytes(total, 1)}`;
				const percent = parseInt(((used / total) * 100).toFixed(0), 10);
				// const percent = (used / total) * 100;
				if (percent > 70) {
					memory.status = 1;
				} else {
					memory.status = 0;
				}
			}
			systemStatus.push(memory);

			const disk = new Status();
			disk.status = 1;
			disk.id = 'disk';

			disk.title = this.translate.instant('dashboard.systemStatus.diskSpace.title'); // 'Disk Space';
			disk.detail = this.translate.instant('dashboard.systemStatus.diskSpace.detail.notFound'); // 'Disk not found';

			this.translate.stream('dashboard.systemStatus.diskSpace.title').subscribe((value) => {
				disk.title = value;
			});

			this.translate.stream('dashboard.systemStatus.diskSpace.detail.notFound').subscribe((value) => {
				disk.detail = value;
			});

			disk.path = 'ms-settings:storagesense';
			disk.asLink = false;
			disk.isSystemLink = true;
			disk.type = 'system';

			if (response.disk) {
				const { total, used } = response.disk;
				disk.detail = `${this.commonService.formatBytes(used, 1)} ${this.translate.instant('dashboard.systemStatus.diskSpace.detail.of')} ${this.commonService.formatBytes(total, 1)}`;
				const percent = parseInt(((used / total) * 100).toFixed(0), 10);
				// const percent = (used / total) * 100;
				if (percent > 90) {
					disk.status = 1;
				} else {
					disk.status = 0;
				}
			}
			systemStatus.push(disk);

			const warranty = new Status();
			warranty.status = 1;
			warranty.id = 'warranty';
			warranty.title = this.translate.instant('dashboard.systemStatus.warranty.title'); // 'Warranty';
			warranty.detail = this.translate.instant('dashboard.systemStatus.warranty.detail.notFound'); // 'Warranty not found';

			this.translate.stream('dashboard.systemStatus.warranty.title').subscribe((value) => {
				warranty.title = value;
			});
			this.translate.stream('dashboard.systemStatus.warranty.detail.notFound').subscribe((value) => {
				warranty.detail = value;
			});

			warranty.path = '/support';
			warranty.asLink = false;
			/* warranty.isSystemLink = true; */
			warranty.isSystemLink = false;
			warranty.type = 'system';

			if (response.warranty) {
				const warrantyDate = this.commonService.formatDate(response.warranty.expired);
				// in warranty
				if (response.warranty.status === 0) {
					warranty.detail = `${this.translate.instant('dashboard.systemStatus.warranty.detail.until')} ${warrantyDate}`; // `Until ${warrantyDate}`;
					warranty.status = 0;
				} else if (response.warranty.status === 1) {
					warranty.detail = `${this.translate.instant('dashboard.systemStatus.warranty.detail.expiredOn')} ${warrantyDate}`; // `Warranty expired on ${warrantyDate}`;
					warranty.status = 1;
				} else {
					warranty.detail = this.translate.instant('dashboard.systemStatus.warranty.detail.notAvailable'); // 'Warranty not available';
					warranty.status = 1;
				}
			}
			systemStatus.push(warranty);

			const systemUpdate = new Status();
			systemUpdate.status = 1;
			systemUpdate.id = 'systemupdate';
			systemUpdate.title = this.translate.instant('dashboard.systemStatus.systemUpdate.title'); // 'System Update';
			systemUpdate.detail = this.translate.instant('dashboard.systemStatus.systemUpdate.detail.update'); // 'Update';
			this.translate.stream('dashboard.systemStatus.systemUpdate.title').subscribe((value) => {
				systemUpdate.title = value;
			});
			this.translate.stream('dashboard.systemStatus.systemUpdate.detail.update').subscribe((value) => {
				systemUpdate.detail = value;
			});
			systemUpdate.path = 'device/system-updates';
			systemUpdate.asLink = false;
			systemUpdate.isSystemLink = false;
			systemUpdate.type = 'system';

			if (response.systemupdate) {
				const lastUpdate = response.systemupdate.lastupdate;
				const diffInDays = this.systemUpdateService.dateDiffInDays(lastUpdate);
				const { status } = response.systemupdate;
				if (status === 1) {
					if (diffInDays > 30) {
						systemUpdate.status = 1;
					} else {
						systemUpdate.status = 0;
					}
				} else {
					systemUpdate.status = 1;
				}
			}
			systemStatus.push(systemUpdate);
		}
		return systemStatus;
	}

	private setDefaultSecurityStatus() {
		const antiVirus = new Status();
		antiVirus.status = 4;
		antiVirus.id = 'anti-virus';

		this.translate.stream('common.securityAdvisor.antiVirus').subscribe((value) => {
			antiVirus.title = value; // 'Anti-Virus';
		});

		this.translate.stream('common.securityAdvisor.disabled').subscribe((value) => {
			antiVirus.detail = value; // 'Disabled';
		});

		antiVirus.path = 'security/anti-virus';
		antiVirus.type = 'security';
		this.securityStatus[0] = antiVirus;

		const wiFi = new Status();
		wiFi.status = 4;
		wiFi.id = 'wifi-security';

		this.translate.stream('common.securityAdvisor.wifi').subscribe((value) => {
			wiFi.title = value; // 'WiFi Security';
		});

		this.translate.stream('common.securityAdvisor.disabled').subscribe((value) => {
			wiFi.detail = value; // 'Disabled';
		});

		wiFi.path = 'security/wifi-security';
		wiFi.type = 'security';
		this.securityStatus[1] = wiFi;

		const passwordManager = new Status();
		passwordManager.status = 4;
		passwordManager.id = 'pwdmgr';

		this.translate.stream('common.securityAdvisor.pswdMgr').subscribe((value) => {
			passwordManager.title = value; // 'Password Manager';
		});

		this.translate.stream('common.securityAdvisor.notInstalled').subscribe((value) => {
			passwordManager.detail = value; // 'Not Installed';
		});

		passwordManager.path = 'security/password-protection';
		passwordManager.type = 'security';
		this.securityStatus[2] = passwordManager;

		const vpn = new Status();
		vpn.status = 4;
		vpn.id = 'vpn';
		this.translate.stream('common.securityAdvisor.vpn').subscribe((value) => {
			vpn.title = value; // 'VPN';
		});

		this.translate.stream('common.securityAdvisor.notInstalled').subscribe((value) => {
			vpn.detail = value; // 'Not Installed';
		});

		vpn.path = 'security/internet-protection';
		vpn.type = 'security';
		this.securityStatus[3] = vpn;

		const windowsHello = new Status();
		windowsHello.status = 4;
		windowsHello.id = 'windows-hello';
		this.translate.stream('common.securityAdvisor.windowsHello').subscribe((value) => {
			windowsHello.title = value; // 'Windows Hello';
		});

		this.translate.stream('common.securityAdvisor.disabled').subscribe((value) => {
			windowsHello.detail = value; // 'Not Installed';
		});

		windowsHello.path = 'security/windows-hello';
		windowsHello.type = 'security';
		this.securityStatus[4] = windowsHello;
	}

	private mapSecurityStatusResponse(response: any): Status[] {
		const securityStatus: Status[] = [];
		if (response) {
			const antiVirus = new Status();
			antiVirus.status = 1;
			antiVirus.id = 'anti-virus';
			antiVirus.title = this.translate.instant('common.securityAdvisor.antiVirus'); // 'Anti-Virus';
			antiVirus.detail = this.translate.instant('common.securityAdvisor.disabled'); // 'Disabled';
			antiVirus.path = 'security/anti-virus';
			antiVirus.type = 'security';

			if (response.antiVirus) {
				if (response.antiVirus.status) {
					antiVirus.status = 0;
					antiVirus.detail = this.translate.instant('common.securityAdvisor.enabled'); // 'Enabled';
				} else {
					antiVirus.status = 1;
				}
			}
			securityStatus.push(antiVirus);

			const wiFi = new Status();
			wiFi.status = 1;
			wiFi.id = 'wifi-security';
			wiFi.title = this.translate.instant('common.securityAdvisor.wifi'); // 'WiFi Security';
			wiFi.detail = this.translate.instant('common.securityAdvisor.disabled'); // 'Disabled';
			wiFi.path = 'security/wifi-security';
			wiFi.type = 'security';

			if (response.wifiSecurity) {
				if (response.wifiSecurity.status) {
					wiFi.status = 0;
					wiFi.detail = this.translate.instant('common.securityAdvisor.enabled'); // 'Enabled';
				} else {
					wiFi.status = 1;
				}
			}
			securityStatus.push(wiFi);

			const passwordManager = new Status();
			passwordManager.status = 1;
			passwordManager.id = 'pwdmgr';
			passwordManager.title = this.translate.instant('common.securityAdvisor.pswdMgr'); // 'Password Manager';
			passwordManager.detail = this.translate.instant('common.securityAdvisor.notInstalled'); // 'Not Installed';
			passwordManager.path = 'security/password-protection';
			passwordManager.type = 'security';

			if (response.passwordManager) {
				if (response.passwordManager.installed) {
					passwordManager.status = 2;
					passwordManager.detail = this.translate.instant('common.securityAdvisor.installed'); // 'Installed';
				} else {
					passwordManager.status = 1;
				}
			}
			securityStatus.push(passwordManager);

			const vpn = new Status();
			vpn.status = 1;
			vpn.id = 'vpn';
			vpn.title = this.translate.instant('common.securityAdvisor.vpn'); // 'VPN';
			vpn.detail = this.translate.instant('common.securityAdvisor.notInstalled'); // 'Not Installed';
			vpn.path = 'security/internet-protection';
			vpn.type = 'security';

			if (response.VPN) {
				if (response.VPN.installed) {
					vpn.status = 2;
					vpn.detail = this.translate.instant('common.securityAdvisor.installed'); // 'Installed';
				} else {
					vpn.status = 1;
				}
			}
			securityStatus.push(vpn);

			const windowsHello = new Status();
			windowsHello.status = 1;
			windowsHello.id = 'windows-hello';
			windowsHello.title = this.translate.instant('common.securityAdvisor.windowsHello'); // 'Windows Hello';
			windowsHello.detail = this.translate.instant('common.securityAdvisor.disabled'); // 'Disabled';
			windowsHello.path = 'security/windows-hello';
			windowsHello.type = 'security';

			if (response.windowsHello) {
				if (response.windowsHello) {
					windowsHello.status = 0;
					windowsHello.detail = this.translate.instant('common.securityAdvisor.enabled'); // 'Enabled';
				} else {
					windowsHello.status = 1;
				}
			}
			securityStatus.push(windowsHello);
		}
		return securityStatus;
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case NetworkStatus.Online:
				case NetworkStatus.Offline:
					this.isOnline = notification.payload.isOnline;
					break;
				case LenovoIdKey.FirstName:
					this.firstName = notification.payload;
					break;
				default:
					break;
			}
		}
	}

}
