import { SupportService } from './../../../services/support/support.service';
import { Component, OnInit, DoCheck, OnDestroy, SecurityContext } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { SecurityAdvisor } from '@lenovo/tan-client-bridge';
import { QaService } from '../../../services/qa/qa.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { Status } from 'src/app/data-models/widgets/status.model';
import { CommonService } from 'src/app/services/common/common.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { FeedbackFormComponent } from '../../feedback-form/feedback-form/feedback-form.component';
import { SystemUpdateService } from 'src/app/services/system-update/system-update.service';
import { UserService } from 'src/app/services/user/user.service';
import { AndroidService } from 'src/app/services/android/android.service';
import { UPEService } from 'src/app/services/upe/upe.service';
import { SecurityAdvisorMockService } from 'src/app/services/security/securityMock.service';
import { LenovoIdDialogService } from 'src/app/services/dialog/lenovoIdDialog.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { ModalModernPreloadComponent } from '../../modal/modal-modern-preload/modal-modern-preload.component';
import { HypothesisService } from 'src/app/services/hypothesis/hypothesis.service';
import { AdPolicyService } from 'src/app/services/ad-policy/ad-policy.service';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';

@Component({
	selector: 'vtr-page-dashboard',
	templateUrl: './page-dashboard.component.html',
	styleUrls: ['./page-dashboard.component.scss']
})
export class PageDashboardComponent implements OnInit, DoCheck, OnDestroy {
	submit = this.translate.instant('dashboard.feedback.form.button');
	feedbackButtonText = this.submit;
	securityAdvisor: SecurityAdvisor;
	public systemStatus: Status[] = [];
	public isOnline = true;
	public brand;
	private protocalAction: any;
	private isUPEFailed = false;
	private isCmsLoaded = false;


	warrantyData: { info: any; cache: boolean };

	heroBannerItems = [];
	cardContentPositionA: any = {};
	cardContentPositionB: any = {};
	cardContentPositionBCms: any = {};
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
		public qaService: QaService,
		private modalService: NgbModal,
		config: NgbModalConfig,
		public commonService: CommonService,
		public deviceService: DeviceService,
		private cmsService: CMSService,
		private upeService: UPEService,
		private systemUpdateService: SystemUpdateService,
		public userService: UserService,
		private translate: TranslateService,
		private vantageShellService: VantageShellService,
		public androidService: AndroidService,
		private securityAdvisorMockService: SecurityAdvisorMockService,
		private activatedRoute: ActivatedRoute,
		private lenovoIdDialogService: LenovoIdDialogService,
		private loggerService: LoggerService,
		private hypService: HypothesisService,
		public supportService: SupportService,
		private adPolicyService: AdPolicyService,
		private sanitizer: DomSanitizer
	) {
		config.backdrop = 'static';
		config.keyboard = false;
		this.securityAdvisor = vantageShellService.getSecurityAdvisor();
		if (!this.securityAdvisor) {
			this.securityAdvisor = this.securityAdvisorMockService.getSecurityAdvisor();
		}
		this.deviceService.getMachineInfo().then(() => {
			this.setDefaultSystemStatus();
		});
		// this.brand = this.deviceService.getMachineInfoSync().brand;
		this.brand = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType, -1);
		translate.stream('dashboard.feedback.form.button').subscribe((value) => {
			this.submit = value;
			this.feedbackButtonText = this.submit;
		});
		// Evaluate the translations for QA on language Change
		// this.qaService.setTranslationService(this.translate);
		// this.qaService.setCurrentLangTranslations();
		this.isUPEFailed = false;  // init UPE request status
		this.isCmsLoaded = false;
		this.qaService.getQATranslation(translate); // VAN-5872, server switch feature
		this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
			this.fetchContent();
		});

		this.isOnline = this.commonService.isOnline;
		this.warrantyData = this.supportService.warrantyData;
	}

	ngOnInit() {
		this.commonService.setSessionStorageValue(SessionStorageKey.DashboardInDashboardPage, true);
		this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});

		this.isOnline = this.commonService.isOnline;
		if (this.dashboardService.isShellAvailable) {
			console.log('PageDashboardComponent.getSystemInfo');
			this.getSystemInfo();
		}

		this.getPreviousContent();
		this.fetchContent();
		// VAN-5872, server switch feature on language change
		this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
			this.fetchContent();
		});
	}

	ngDoCheck(): void {
		const lastAction = this.protocalAction;
		this.protocalAction = this.activatedRoute.snapshot.queryParams.action;
		if (lastAction !== this.protocalAction) {
			if (this.protocalAction.toLowerCase() === 'lenovoid') {
				this.lenovoIdDialogService.openLenovoIdDialog();
			} else if (this.protocalAction.toLowerCase() === 'modernpreload') {
				this.openModernPreloadModal();
			}
		}
	}

	ngOnDestroy() {
		this.commonService.setSessionStorageValue(SessionStorageKey.DashboardInDashboardPage, false);
		if (
			this.router.routerState.snapshot.url.indexOf('security') === -1 &&
			this.router.routerState.snapshot.url.indexOf('dashboard') === -1
		) {
			if (this.securityAdvisor && this.securityAdvisor.wifiSecurity) {
				this.securityAdvisor.wifiSecurity.cancelGetWifiSecurityState();
			}
		}
		this.qaService.destroyChangeSubscribed();
	}

	private fetchContent(lang?: string) {
		const callCmsStartTime: any = new Date();
		let queryOptions: any = {
			Page: 'dashboard'
		};
		if (lang) {
			queryOptions = {
				Page: 'dashboard',
				Lang: lang,
				GEO: 'US'
			};
		}
		this.getTileBSource().then((source) => {
			this.cmsService.fetchCMSContent(queryOptions).subscribe(
				(response: any) => {
					const callCmsEndTime: any = new Date();
					const callCmsUsedTime = callCmsEndTime - callCmsStartTime;
					if (response && response.length > 0) {
						this.loggerService.info(`Performance: Dashboard page get cms content, ${callCmsUsedTime}ms`);
						const heroBannerItems = this.cmsService.getOneCMSContent(response, 'home-page-hero-banner', 'position-A').map((record, index) => {
							return {
								albumId: 1,
								id: record.Id,
								source: this.sanitizer.sanitize(SecurityContext.HTML, record.Title),
								title: this.sanitizer.sanitize(SecurityContext.HTML, record.Description),
								url: record.FeatureImage,
								ActionLink: record.ActionLink
							};
						});
						if (heroBannerItems && heroBannerItems.length) {
							this.heroBannerItems = heroBannerItems;
							this.dashboardService.heroBannerItems = heroBannerItems;
						}

						const cardContentPositionB = this.cmsService.getOneCMSContent(
							response,
							'half-width-title-description-link-image',
							'position-B'
						)[0];
						if (cardContentPositionB) {
							if (this.cardContentPositionB.BrandName) {
								this.cardContentPositionB.BrandName = this.cardContentPositionB.BrandName.split(
									'|'
								)[0];
							}
							cardContentPositionB.DataSource = 'cms';

							this.cardContentPositionBCms = cardContentPositionB;
							this.isCmsLoaded = true;
							if (this.isUPEFailed || source === 'CMS') {
								this.cardContentPositionB = this.cardContentPositionBCms;
								this.dashboardService.cardContentPositionB = this.cardContentPositionBCms;
							}
						}

						const cardContentPositionC = this.cmsService.getOneCMSContent(
							response,
							'half-width-title-description-link-image',
							'position-C'
						)[0];
						if (cardContentPositionC) {
							this.cardContentPositionC = cardContentPositionC;
							if (this.cardContentPositionC.BrandName) {
								this.cardContentPositionC.BrandName = this.cardContentPositionC.BrandName.split('|')[0];
							}
							this.dashboardService.cardContentPositionC = cardContentPositionC;
						}

						const cardContentPositionD = this.cmsService.getOneCMSContent(
							response,
							'full-width-title-image-background',
							'position-D'
						)[0];
						if (cardContentPositionD) {
							this.cardContentPositionD = cardContentPositionD;
							this.dashboardService.cardContentPositionD = cardContentPositionD;
						}

						const cardContentPositionE = this.cmsService.getOneCMSContent(
							response,
							'half-width-top-image-title-link',
							'position-E'
						)[0];
						if (cardContentPositionE) {
							this.cardContentPositionE = cardContentPositionE;
							this.dashboardService.cardContentPositionE = cardContentPositionE;
						}

						const cardContentPositionF = this.cmsService.getOneCMSContent(
							response,
							'half-width-top-image-title-link',
							'position-F'
						)[0];
						if (cardContentPositionF) {
							this.cardContentPositionF = cardContentPositionF;
							this.dashboardService.cardContentPositionF = cardContentPositionF;
						}
					} else {
						const msg = `Performance: Dashboard page not have this language contents, ${callCmsUsedTime}ms`;
						this.loggerService.info(msg);
						this.fetchContent('en');
					}
				},
				(error) => {
					console.log('fetchCMSContent error', error);
				}
			);

			if (source === 'UPE') {
				const upeParam = {
					position: 'position-B'
				};
				this.upeService.fetchUPEContent(upeParam).subscribe((upeResp) => {
					const cardContentPositionB = this.upeService.getOneUPEContent(
						upeResp,
						'half-width-title-description-link-image',
						'position-B'
					)[0];
					if (cardContentPositionB) {
						this.cardContentPositionB = cardContentPositionB;
						if (this.cardContentPositionB.BrandName) {
							this.cardContentPositionB.BrandName = this.cardContentPositionB.BrandName.split('|')[0];
						}
						cardContentPositionB.DataSource = 'upe';
						this.dashboardService.cardContentPositionB = cardContentPositionB;
						this.isUPEFailed = false;
					}
				}, (err) => {
					this.loggerService.info(`Cause by error: ${err}, position-B load CMS content.`);
					this.isUPEFailed = true;
					if (this.isCmsLoaded) {
						this.cardContentPositionB = this.cardContentPositionBCms;
						this.dashboardService.cardContentPositionB = this.cardContentPositionBCms;
					}
				});
			}
		});
	}

	onFeedbackModal() {
		this.modalService.open(FeedbackFormComponent, {
			backdrop: true,
			size: 'lg',
			centered: true,
			windowClass: 'feedback-modal'
		});
	}

	openModernPreloadModal() {
		const modernPreloadModal: NgbModalRef = this.modalService.open(ModalModernPreloadComponent, {
			backdrop: 'static',
			size: 'lg',
			centered: true,
			windowClass: 'modern-preload-modal',
			keyboard: false,
			beforeDismiss: () => {
				if (modernPreloadModal.componentInstance.onBeforeDismiss) {
					modernPreloadModal.componentInstance.onBeforeDismiss();
				}
				return true;
			}
		});
	}

	private getTileBSource() {
		return new Promise((resolve) => {
			this.hypService.getFeatureSetting('TileBSource').then((source) => {
				if (source === 'UPE') {
					resolve('UPE');
				} else {
					resolve('CMS');
				}
			}, () => {
				resolve('CMS');
			});
		});
	}

	private getPreviousContent() {
		this.heroBannerItems = this.dashboardService.heroBannerItems;
		this.cardContentPositionA = this.dashboardService.cardContentPositionA;
		this.cardContentPositionB = this.dashboardService.cardContentPositionB;
		this.cardContentPositionC = this.dashboardService.cardContentPositionC;
		this.cardContentPositionD = this.dashboardService.cardContentPositionD;
		this.cardContentPositionE = this.dashboardService.cardContentPositionE;
		this.cardContentPositionF = this.dashboardService.cardContentPositionF;
	}

	private setDefaultSystemStatus() {
		const memory = new Status();
		memory.status = 4;
		memory.id = 'memory';
		memory.metricsItemName = 'Memory';

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
		disk.metricsItemName = 'Disk Space';

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
		warranty.metricsItemName = 'Warranty';

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

		if (this.deviceService && !this.deviceService.isSMode && this.adPolicyService && this.adPolicyService.IsSystemUpdateEnabled) {
			const systemUpdate = new Status();
			systemUpdate.status = 4;
			systemUpdate.id = 'systemupdate';
			systemUpdate.metricsItemName = 'System Update';

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
	}

	private getSystemInfo() {
		// ram and disk
		this.dashboardService.getMemoryDiskUsage().then((value) => {
			if (value) {
				const memory = this.systemStatus[0];
				const totalRam = value.memory.total;
				const usedRam = value.memory.used;
				const percentRam = parseInt((usedRam / totalRam * 100).toFixed(0), 10);
				if (percentRam > 70) {
					memory.status = 1;
				} else {
					memory.status = 0;
				}
				const disk = this.systemStatus[1];
				const totalDisk = value.disk.total;
				const usedDisk = value.disk.used;
				this.translate.stream('dashboard.systemStatus.memory.detail.of').subscribe((re) => {
					memory.detail = `${this.commonService.formatBytes(
						usedRam,
						1
					)} ${re} ${this.commonService.formatBytes(totalRam, 1)}`;
					disk.detail = `${this.commonService.formatBytes(
						usedDisk,
						1
					)} ${re} ${this.commonService.formatBytes(totalDisk, 1)}`;
				});
				const percent = parseInt((usedDisk / totalDisk * 100).toFixed(0), 10);
				if (percent > 90) {
					disk.status = 1;
				} else {
					disk.status = 0;
				}
			}
		});

		// warranty
		this.dashboardService.getWarrantyInfo().subscribe((value) => {
			if (value) {
				const warranty = this.systemStatus[2];
				const warrantyDate = this.commonService.formatDate(value.expired);
				// in warranty
				if (value.status === 0) {
					this.translate.stream('dashboard.systemStatus.warranty.detail.until').subscribe((re) => {
						warranty.detail = `${re} ${warrantyDate}`; // `Until ${warrantyDate}`;
					});
					warranty.status = 0;
				} else if (value.status === 1) {
					this.translate.stream('dashboard.systemStatus.warranty.detail.expiredOn').subscribe((re) => {
						warranty.detail = `${re} ${warrantyDate}`; // `Warranty expired on ${warrantyDate}`;
					});
					warranty.status = 1;
				} else {
					this.translate.stream('dashboard.systemStatus.warranty.detail.notAvailable').subscribe((re) => {
						warranty.detail = `${re}`; //  'Warranty not available';
					});
					warranty.status = 1;
				}
				warranty.isHidden = !this.deviceService.showWarranty;
			}
		});

		// system update
		if (this.deviceService && !this.deviceService.isSMode && this.adPolicyService && this.adPolicyService.IsSystemUpdateEnabled) {
			this.dashboardService.getRecentUpdateInfo().subscribe(value => {
				if (value) {
					const systemUpdate = this.systemStatus[3];
					const diffInDays = this.systemUpdateService.dateDiffInDays(value.lastupdate);
					if (value.status === 1) {
						if (diffInDays > 30) {
							systemUpdate.status = 1;
						} else {
							systemUpdate.status = 0;
						}
					} else {
						systemUpdate.status = 1;
					}
				}
			});
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
}
