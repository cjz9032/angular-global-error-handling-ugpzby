import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MockService } from '../../../services/mock/mock.service';
import { QaService } from '../../../services/qa/qa.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Status } from 'src/app/data-models/widgets/status.model';
import { CommonService } from 'src/app/services/common/common.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { LenovoIdKey } from 'src/app/enums/lenovo-id-key.enum';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { SystemUpdateService } from 'src/app/services/system-update/system-update.service';
import { SecurityAdvisor } from '@lenovo/tan-client-bridge';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { UserService } from '../../../services/user/user.service';
import { TranslateService } from '@ngx-translate/core';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { Title } from '@angular/platform-browser';
import { DialogService } from 'src/app/services/dialog/dialog.service';

@Component({
	selector: 'vtr-page-device-gaming',
	templateUrl: './page-device-gaming.component.html',
	styleUrls: [ './page-device-gaming.component.scss' ],
	providers: [ NgbModalConfig, NgbModal ]
})
export class PageDeviceGamingComponent implements OnInit, DoCheck {
	public static allCapablitiyFlag = false;
	submit = 'Submit';
	feedbackButtonText = this.submit;
	securityAdvisor: SecurityAdvisor;
	public systemStatus: Status[] = [];
	public securityStatus: Status[] = [];
	public isOnline = true;
	private protocolAction: any;
	cardContentPositionD: any = {};
	// TODO Lite Gaming
	public liteGaming = false;
	public desktopType = false;

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
		private loggerService: LoggerService,
		private activatedRoute: ActivatedRoute,
		private dialogService: DialogService,
		private gamingAllCapabilitiesService: GamingAllCapabilitiesService,
		vantageShellService: VantageShellService,
		private titleService: Title
	) {
		config.backdrop = 'static';
		config.keyboard = false;
		this.securityAdvisor = vantageShellService.getSecurityAdvisor();
		// TODO Lite Gaming
		this.desktopType = this.commonService.getLocalStorageValue(LocalStorageKey.desktopType);
		this.liteGaming = this.gamingAllCapabilitiesService.getCapabilityFromCache(LocalStorageKey.liteGaming);
	}

	ngOnInit() {
		this.isOnline = this.commonService.isOnline;
		if (this.dashboardService.isShellAvailable) {
			this.getSystemInfo();
		}

		if (!PageDeviceGamingComponent.allCapablitiyFlag) {
			this.gamingAllCapabilitiesService
				.getCapabilities()
				.then((response) => {
					this.gamingAllCapabilitiesService.setCapabilityValuesGlobally(response);
					PageDeviceGamingComponent.allCapablitiyFlag = true;
					// TODO Lite Gaming
					this.desktopType = response.desktopType;
					this.liteGaming = response.liteGaming;
					// this.desktopType = this.gamingAllCapabilitiesService.getCapabilityFromCache(LocalStorageKey.desktopType);
					// this.liteGaming = this.gamingAllCapabilitiesService.getCapabilityFromCache(LocalStorageKey.liteGaming);
				})
				.catch((err) => {});
		}
		this.translate
			.stream([
				'dashboard.offlineInfo.welcomeToVantage',
				'common.menu.support',
				'settings.settings',
				'dashboard.offlineInfo.systemHealth',
				'common.securityAdvisor.wifi',
				'systemUpdates.title',
				'systemUpdates.readMore'
			])
			.subscribe((result) => {
				this.dashboardService.translateString = result;
				this.dashboardService.setDefaultCMSContent();
				this.getPreviousContent();
				this.fetchCmsContents();
			});

		this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
	}

	ngDoCheck(): void {
		const lastAction = this.protocolAction;
		this.protocolAction = this.activatedRoute.snapshot.queryParams.action;
		if (this.protocolAction && lastAction !== this.protocolAction) {
			if (this.protocolAction.toLowerCase() === 'lenovoid') {
				setTimeout(() => this.dialogService.openLenovoIdDialog());
			} else if (this.protocolAction.toLowerCase() === 'modernpreload') {
				setTimeout(() => this.dialogService.openModernPreloadModal());
			}
		}
	}

	fetchCmsContents(lang?: string) {
		const callCmsStartTime: any = new Date();
		const queryOptions: any = {
			Page: 'dashboard'
		};
		if (this.isOnline) {
			if (this.dashboardService.onlineCardContent.positionD) {
				this.cardContentPositionD = this.dashboardService.onlineCardContent.positionD;
			}
		}
		this.cmsService.fetchCMSContent(queryOptions).subscribe(
			(response: any) => {
				const callCmsEndTime: any = new Date();
				const callCmsUsedTime = callCmsEndTime - callCmsStartTime;
				if (response && response.length > 0) {
					if (!this.dashboardService.onlineCardContent.positionD) {
						const cardContentPositionD = this.cmsService.getOneCMSContent(
							response,
							'full-width-title-image-background',
							'position-D'
						)[0];
						if (cardContentPositionD) {
							this.cardContentPositionD = cardContentPositionD;
							this.dashboardService.onlineCardContent.positionD = cardContentPositionD;
						}
					} else {
						this.cardContentPositionD = this.dashboardService.onlineCardContent.positionD;
					}
				} else {
					const msg = `Performance: Dashboard page not have this language contents, ${callCmsUsedTime}ms`;
					this.loggerService.info(msg);
					this.fetchCmsContents('en');
				}
			},
			(error) => {}
		);
	}

	public onConnectivityClick($event: any) {}

	private getPreviousContent() {
		this.cardContentPositionD = this.dashboardService.offlineCardContent.positionD;
	}

	private getSystemInfo() {
		this.dashboardService
			.getSystemInfo()
			.then((value: any) => {
				this.systemStatus = this.mapSystemInfoResponse(value);
			})
			.catch((error) => {});
	}

	private getSecurityStatus() {
		this.dashboardService
			.getSecurityStatus()
			.then((value: any) => {
				this.securityStatus = this.mapSecurityStatusResponse(value);
			})
			.catch((error) => {});
	}

	private mapSystemInfoResponse(response: any): Status[] {
		const systemStatus: Status[] = [];
		if (response) {
			const memory = new Status();
			memory.status = 1;
			memory.id = 'memory';
			memory.title = this.translate.instant('dashboard.systemStatus.memory.title'); // 'Memory';
			memory.detail = this.translate.instant('dashboard.systemStatus.memory.detail.notFound'); // 'Memory not found';
			memory.path = 'ms-settings:about';
			memory.asLink = false;
			memory.isSystemLink = true;
			memory.type = 'system';

			if (response.memory) {
				const { total, used } = response.memory;
				memory.detail = `${this.commonService.formatBytes(used, 1)} ${this.translate.instant(
					'dashboard.systemStatus.memory.detail.of'
				)} ${this.commonService.formatBytes(total, 1)}`;
				const percent = parseInt((used / total * 100).toFixed(0), 10);
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
			disk.path = 'ms-settings:storagesense';
			disk.asLink = false;
			disk.isSystemLink = true;
			disk.type = 'system';

			if (response.disk) {
				const { total, used } = response.disk;
				disk.detail = `${this.commonService.formatBytes(used, 1)} ${this.translate.instant(
					'dashboard.systemStatus.diskSpace.detail.of'
				)} ${this.commonService.formatBytes(total, 1)}`;
				const percent = parseInt((used / total * 100).toFixed(0), 10);
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
			warranty.path = '/support';
			warranty.asLink = false;
			/* warranty.isSystemLink = true; */
			warranty.isSystemLink = false;
			warranty.type = 'system';

			if (response.warranty) {
				const warrantyDate = this.commonService.formatUTCDate(response.warranty.expired);
				// in warranty
				if (response.warranty.status === 0) {
					warranty.detail = `${this.translate.instant(
						'dashboard.systemStatus.warranty.detail.until'
					)} ${warrantyDate}`; // `Until ${warrantyDate}`;
					warranty.status = 0;
				} else if (response.warranty.status === 1) {
					warranty.detail = `${this.translate.instant(
						'dashboard.systemStatus.warranty.detail.expiredOn'
					)} ${warrantyDate}`; // `Warranty expired on ${warrantyDate}`;
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
			systemUpdate.path = 'device/system-updates';
			systemUpdate.asLink = true;
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
					if (!this.isOnline) {
						this.getPreviousContent();
					} else {
						this.fetchCmsContents();
					}
					break;
				default:
					break;
			}
		}
	}

}
