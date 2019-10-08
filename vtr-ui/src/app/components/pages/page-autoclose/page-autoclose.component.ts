import { position } from './../page-privacy/common/components/tooltip/tooltip.component';
import { GamingAutoCloseService } from './../../../services/gaming/gaming-autoclose/gaming-autoclose.service';
import { Component, OnInit } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { isUndefined } from 'util';
import { AutoCloseStatus } from 'src/app/data-models/gaming/autoclose/autoclose-status.model';
import { AutoCloseNeedToAsk } from 'src/app/data-models/gaming/autoclose/autoclose-need-to-ask.model';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { UPEService } from 'src/app/services/upe/upe.service';
import { HypothesisService } from 'src/app/services/hypothesis/hypothesis.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';

@Component({
	selector: 'vtr-page-autoclose',
	templateUrl: './page-autoclose.component.html',
	styleUrls: [ './page-autoclose.component.scss' ]
})
export class PageAutocloseComponent implements OnInit {
	public showTurnOnModal: boolean = false;
	public showAppsModal: boolean = false;
	public autoCloseAppList: any;
	// Toggle status
	isOnline = true;
	toggleStatus: boolean;
	needToAsk: any;
	getNeedStatus: boolean;
	autoCloseStatusObj: AutoCloseStatus = new AutoCloseStatus();
	needToAskStatusObj: AutoCloseNeedToAsk = new AutoCloseNeedToAsk();

	// CMS Content block
	cardContentPositionA: any = {
		FeatureImage: './../../../../assets/cms-cache/content-card-4x4-support.jpg'
	};
	cardContentPositionB: any = {
		FeatureImage: './../../../../assets/cms-cache/Security4x3-zone2.jpg'
	};
	cardContentPositionBCms: any = {};
	private isUPEFailed = false;
	private isCmsLoaded = false;
	backId = 'vtr-gaming-autoclose-btn-back';

	constructor(
		private cmsService: CMSService,
		private gamingAutoCloseService: GamingAutoCloseService,
		private commonService: CommonService,
		private titleService: Title,
		public dashboardService: DashboardService,
		private upeService: UPEService,
		private loggerService: LoggerService,
		private hypService: HypothesisService,
		private translate: TranslateService
	) {
		this.titleService.setTitle('gaming.common.narrator.pageTitle.autoClose');
		this.isUPEFailed = false; // init UPE request status
		this.isCmsLoaded = false;
		this.fetchCMSArticles();
		// VAN-5872, server switch feature on language change
		this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
			this.fetchCMSArticles();
		});
		this.isOnline = this.commonService.isOnline;
	}

	ngOnInit() {
		this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});

		// AutoClose Init
		this.refreshAutoCloseList();
		this.toggleStatus = this.gamingAutoCloseService.getAutoCloseStatusCache();
		this.needToAsk = this.gamingAutoCloseService.getNeedToAskStatusCache();
	}

	private onNotification(notification: AppNotification) {
		if (
			notification &&
			(notification.type === NetworkStatus.Offline || notification.type === NetworkStatus.Online)
		) {
			this.isOnline = notification.payload.isOnline;
		}
		if (this.isOnline === undefined) {
			this.isOnline = true;
		}
	}
	// Get the CMS content for the container card
	fetchCMSArticles() {
		this.isOnline = this.commonService.isOnline;
		const queryOptions = {
			Page: 'dashboard'
		};
		this.getTileBSource().then((source) => {
			this.cmsService.fetchCMSContent(queryOptions).subscribe((response: any) => {
				const cardContentPositionA = this.cmsService.getOneCMSContent(
					response,
					'half-width-top-image-title-link',
					'position-F'
				)[0];
				if (cardContentPositionA) {
					this.cardContentPositionA = cardContentPositionA;
				}

				const cardContentPositionB = this.cmsService.getOneCMSContent(
					response,
					'half-width-title-description-link-image',
					'position-B'
				)[0];
				if (cardContentPositionB) {
					if (this.cardContentPositionB.BrandName) {
						this.cardContentPositionB.BrandName = this.cardContentPositionB.BrandName.split('|')[0];
					}
					cardContentPositionB.DataSource = 'cms';

					this.cardContentPositionBCms = cardContentPositionB;
					this.isCmsLoaded = true;
					if (this.isUPEFailed || source === 'CMS') {
						this.cardContentPositionB = this.cardContentPositionBCms;
						this.dashboardService.cardContentPositionB = this.cardContentPositionBCms;
					}
				}
			});
			if (source === 'UPE') {
				const upeParam = {
					position: 'position-B'
				};
				this.upeService.fetchUPEContent(upeParam).subscribe(
					(upeResp) => {
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
					},
					(err) => {
						this.loggerService.info(`Cause by error: ${err}, position-B load CMS content.`);
						this.isUPEFailed = true;
						if (this.isCmsLoaded) {
							this.cardContentPositionB = this.cardContentPositionBCms;
							this.dashboardService.cardContentPositionB = this.cardContentPositionBCms;
						}
					}
				);
			}
		});
	}

	private getTileBSource() {
		return new Promise((resolve) => {
			this.hypService.getFeatureSetting('TileBSource').then(
				(source) => {
					if (source === 'UPE') {
						resolve('UPE');
					} else {
						resolve('CMS');
					}
				},
				() => {
					resolve('CMS');
				}
			);
		});
	}

	openTargetModal() {
		try {
			this.needToAsk = this.gamingAutoCloseService.getNeedToAskStatusCache();
			this.needToAsk = this.needToAsk === undefined || isNaN(this.needToAsk) ? false : this.needToAsk;
			this.gamingAutoCloseService.setNeedToAskStatusCache(this.needToAsk);
			this.hiddenScroll(true);
			if (this.toggleStatus || this.needToAsk) {
				this.showAppsModal = true;
			} else {
				this.showTurnOnModal = true;
			}
		} catch (error) {
			return undefined;
		}
	}

	doNotShowAction(status: any) {
		try {
			this.getNeedStatus = status;
			this.gamingAutoCloseService.setNeedToAskStatusCache(this.getNeedStatus);
		} catch (error) {}
	}

	initTurnOnAction() {
		this.setAutoCloseStatus(true);
		this.showAppsModal = true;
		this.hiddenScroll(true);
	}

	initNotNowAction(notNowStatus: boolean) {
		this.showAppsModal = true;
		this.hiddenScroll(true);
	}

	modalCloseTurnOn(action: boolean) {
		this.showTurnOnModal = action;
		this.hiddenScroll(false);
		this.showAppsModal = true;
	}

	modalCloseAddApps(action: boolean) {
		this.showAppsModal = action;
		this.hiddenScroll(false);
	}

	hiddenScroll(action: boolean) {
		if (action) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	}

	toggleAutoClose(event: any) {
		this.setAutoCloseStatus(event.switchValue);
	}

	setAutoCloseStatus(status: boolean) {
		this.gamingAutoCloseService.setAutoCloseStatus(status).then((response: boolean) => {
			if (response) {
				this.gamingAutoCloseService.setAutoCloseStatusCache(status);
				this.toggleStatus = status;
			}
		});
	}

	public refreshAutoCloseList() {
		this.autoCloseAppList = this.gamingAutoCloseService.getAutoCloseListCache();
		try {
			this.gamingAutoCloseService.getAppsAutoCloseList().then((appList: any) => {
				if (!isUndefined(appList.processList)) {
					this.autoCloseAppList = appList.processList;
					this.gamingAutoCloseService.setAutoCloseListCache(appList.processList);
					console.log('get Auto close List', appList.processList);
					console.log('Total Auto close List Apps', appList.processList.length);
				}
			});
		} catch (error) {
			return undefined;
		}
	}

	public addAppDataToList(event: any) {
		if (event.checked) {
			const addApp = event.app;
			try {
				this.gamingAutoCloseService.addAppsAutoCloseList(addApp).then((success: any) => {
					if (success) {
						this.refreshAutoCloseList();
						this.gamingAutoCloseService.setAutoCloseListCache(this.autoCloseAppList);
					}
				});
			} catch (error) {}
		} else {
			const remApp = event.app;
			this.gamingAutoCloseService.delAppsAutoCloseList(remApp).then((response: boolean) => {
				if (response) {
					this.refreshAutoCloseList();
					this.gamingAutoCloseService.setAutoCloseListCache(this.autoCloseAppList);
				}
			});
		}
	}

	async deleteAppFromList(appData: any) {
		try {
			// this.autoCloseAppList.splice(appData.index, 1);
			await this.gamingAutoCloseService.delAppsAutoCloseList(appData.name).then((response: boolean) => {
				if (response) {
					this.refreshAutoCloseList();
					this.gamingAutoCloseService.setAutoCloseListCache(this.autoCloseAppList);
				}
			});
		} catch (err) {}
	}
}
