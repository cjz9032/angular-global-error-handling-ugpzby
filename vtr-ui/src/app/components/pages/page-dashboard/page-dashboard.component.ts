import { Component, OnInit, SecurityContext, DoCheck } from '@angular/core';
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
import { SecurityAdvisorMockService } from 'src/app/services/security/securityMock.service';
import { LenovoIdDialogService } from 'src/app/services/dialog/lenovoIdDialog.service';

@Component({
	selector: 'vtr-page-dashboard',
	templateUrl: './page-dashboard.component.html',
	styleUrls: ['./page-dashboard.component.scss'],
	providers: [NgbModalConfig, NgbModal]
})
export class PageDashboardComponent implements OnInit, DoCheck {
	firstName = 'User';
	submit = this.translate.instant('dashboard.feedback.form.button');
	feedbackButtonText = this.submit;
	securityAdvisor: SecurityAdvisor;
	public systemStatus: Status[] = [];
	public isOnline = true;
	private protocalAction: any;

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
		private sanitizer: DomSanitizer,
		private securityAdvisorMockService: SecurityAdvisorMockService,
		private activatedRoute: ActivatedRoute,
		private lenovoIdDialogService: LenovoIdDialogService
	) {
		config.backdrop = 'static';
		config.keyboard = false;
		this.securityAdvisor = vantageShellService.getSecurityAdvisor();
		if (!this.securityAdvisor) {
			this.securityAdvisor = this.securityAdvisorMockService.getSecurityAdvisor();
		}

		this.setDefaultSystemStatus();

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

	ngDoCheck(): void {
		const lastAction = this.protocalAction;
		this.protocalAction = this.activatedRoute.snapshot.queryParams['action'];
		if (lastAction !== this.protocalAction) {
			if (this.protocalAction.toLowerCase() === 'lenovoid') {
				this.lenovoIdDialogService.openLenovoIdDialog();
			}
		}
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

	private getSystemInfo() {
		// ram and disk
		this.dashboardService.getMemoryDiskUsage().then(value => {
			if (value) {
				const memory = this.systemStatus[0];
				const totalRam = value.memory.total;
				const usedRam = value.memory.used;
				const percentRam = parseInt(((usedRam / totalRam) * 100).toFixed(0), 10);
				if (percentRam > 70) {
					memory.status = 1;
				} else {
					memory.status = 0;
				}
				const disk = this.systemStatus[1];
				const totalDisk = value.disk.total;
				const usedDisk  = value.disk.used;
				this.translate.stream('dashboard.systemStatus.memory.detail.of').subscribe((re) => {
					memory.detail = `${this.commonService.formatBytes(usedRam, 1)} ${re} ${this.commonService.formatBytes(totalRam, 1)}`;
					disk.detail = `${this.commonService.formatBytes(usedDisk, 1)} ${re} ${this.commonService.formatBytes(totalDisk, 1)}`;
				});
				const percent = parseInt(((usedDisk / totalDisk) * 100).toFixed(0), 10);
				if (percent > 90) {
					disk.status = 1;
				} else {
					disk.status = 0;
				}
			}
		});

		// warranty
		this.dashboardService.getWarrantyInfo().then(value => {
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
			}
		});

		// system update
		this.dashboardService.getRecentUpdateInfo().subscribe(value => {
			if (value) {
				const systemUpdate = this.systemStatus[3];
				const diffInDays = this.systemUpdateService.dateDiffInDays( value.lastupdate);
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
