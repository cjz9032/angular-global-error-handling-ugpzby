import { Component, OnInit, OnDestroy } from '@angular/core';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { Subscription } from 'rxjs';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { AppsForYouEnum } from 'src/app/enums/apps-for-you.enum';
import { AppsForYouService, AppDetails } from 'src/app/services/apps-for-you/apps-for-you.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalAppsForYouScreenshotComponent } from '../../modal/modal-apps-for-you-screenshot/modal-apps-for-you-screenshot.component';
import { TranslateService } from '@ngx-translate/core';
import { WinRT } from '@lenovo/tan-client-bridge';

@Component({
	selector: 'vtr-page-apps-for-you',
	templateUrl: './page-apps-for-you.component.html',
	styleUrls: ['./page-apps-for-you.component.scss']
})
export class PageAppsForYouComponent implements OnInit, OnDestroy {

	title = '';
	headerTitle = '';
	isOnline: boolean;
	notificationSubscription: Subscription;
	backId = 'apps-for-you-page-btn-back';

	systemUpdateBridge: any;
	appDetails: AppDetails;
	errorMessage: any;
	installButtonStatus: number;
	public appGuid: any;
	metricsParent = '';

	installButtonStatusEnum = {
		INSTALL: 1,
		DOWNLOADING: 2,
		INSTALLING: 3,
		LAUNCH: 4,
		SEEMORE: 5,
		UNKNOWN: -1
	};

	statusEnum = {
		NOT_INSTALL: 1,
		INSTALLED: 2,
		DOWNLOADING: 3,
		DOWNLOAD_COMPLETE: 4,
		INSTALLING: 5,
		FAILED_INSTALL: -1
	};

	// mockScreenShots = [
	// 	{
	// 		id: 'apps-for-you-screenshot-1',
	// 		imageUrl: 'assets/images/apps-for-you/screenshot1(1).png',
	// 		position: 1,
	// 		isRepeat: false,
	// 		show: 'show',
	// 	},
	// ];
	screenshotInterval: any;
	showArrows = false;
	arrowClickable = true;

	constructor(
		private route: ActivatedRoute,
		private commonService: CommonService,
		private loggerService: LoggerService,
		private vantageShellService: VantageShellService,
		public modalService: NgbModal,
		private appsForYouService: AppsForYouService,
		private translateService: TranslateService
	) {
		this.isOnline = this.commonService.isOnline;
		this.systemUpdateBridge = vantageShellService.getSystemUpdate();
		this.route.params.subscribe((params) => {
			if (!this.appGuid || this.appGuid !== params.id) {
				this.appDetails = undefined;
				this.installButtonStatus = undefined;
				this.appGuid = params.id;
			}
			this.appsForYouService.getAppDetails(this.appGuid);
			if (this.appGuid === AppsForYouEnum.AppGuidLenovoMigrationAssistant) {
				this.metricsParent = 'AppsForYou.LMA';
				this.headerTitle = 'appsForYou.menuText.lenovoMigrationAssistant';
			} else if (this.appGuid === AppsForYouEnum.AppGuidAdobeCreativeCloud) {
				this.metricsParent = 'AppsForYou.Adobe';
				this.headerTitle = 'appsForYou.menuText.adobeRedemption';
			} else {
				this.metricsParent = 'AppsForYou';
			}
			this.route.snapshot.data.pageName = this.metricsParent;
		});
	}

	ngOnInit() {
		this.errorMessage = '';
		this.installButtonStatus = this.installButtonStatusEnum.UNKNOWN;
		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});
	}

	ngOnDestroy() {
		clearInterval(this.screenshotInterval);
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
	}

	startScreenshotAutoSwipe() {
		clearInterval(this.screenshotInterval);
		this.screenshotInterval = setInterval(() => {
			this.swipeRightToLeft();
		}, 5000);
	}

	clickRightArrow() {
		clearInterval(this.screenshotInterval);
		this.swipeRightToLeft();
		this.startScreenshotAutoSwipe();
	}

	clickLeftArrow() {
		clearInterval(this.screenshotInterval);
		this.swipeLeftToRight();
		// this.startScreenshotAutoSwipe();
	}

	swipeRightToLeft() {
		if (!this.arrowClickable) { return false; }
		this.arrowClickable = false;
		const screenshotNumber = this.appDetails.screenshots.length;
		const preScreenShotIndex = this.appDetails.screenshots.findIndex(m => m.position === 0);
		if (preScreenShotIndex > -1) {
			const temp = JSON.parse(JSON.stringify(this.appDetails.screenshots[preScreenShotIndex]));
			this.appDetails.screenshots.splice(preScreenShotIndex, 1);
			temp.position = screenshotNumber;
			this.appDetails.screenshots.push(temp);
		}
		setTimeout(() => {
			this.appDetails.screenshots.forEach(ss => {
				ss.position--;
			});
			this.arrowClickable = true;
		}, 20);
	}
	swipeLeftToRight() {
		if (!this.arrowClickable) { return false; }
		this.arrowClickable = false;
		const screenshotNumber = this.appDetails.screenshots.length;
		const lastScreenShotIndex = this.appDetails.screenshots.findIndex(m => m.position === screenshotNumber);
		if (lastScreenShotIndex > -1) {
			const temp = JSON.parse(JSON.stringify(this.appDetails.screenshots[lastScreenShotIndex]));
			this.appDetails.screenshots.splice(lastScreenShotIndex, 1);
			temp.position = 0;
			this.appDetails.screenshots.push(temp);
		}
		const timeout = setTimeout(() => {
			this.appDetails.screenshots.forEach(ss => {
				ss.position++;
			});
			this.arrowClickable = true;
			clearTimeout(timeout);
		}, 20);
	}

	onNotification(notification: AppNotification) {
		if (notification) {
			const { type, payload } = notification;
			switch (type) {
				case NetworkStatus.Online:
				case NetworkStatus.Offline:
					const currentOnline = notification.payload.isOnline;
					if (this.isOnline !== currentOnline) {
						this.isOnline = currentOnline;
						if (!currentOnline) {
							this.appsForYouService.cancelInstall();
						} else {
							this.appsForYouService.resetCancelInstall();
						}
					}
					break;
				case AppsForYouEnum.GetAppDetailsRespond:
					this.initAppDetails(notification.payload);
					break;
				case AppsForYouEnum.InstallAppProgress:
					if (this.appDetails && this.appDetails.installtype.id.indexOf(AppsForYouEnum.AppTypeNativeId) !== -1) {
						if (notification.payload < 85) {
							this.appDetails.showStatus = this.statusEnum.DOWNLOADING;
							this.installButtonStatus = this.installButtonStatusEnum.DOWNLOADING;
						} else {
							this.appDetails.showStatus = this.statusEnum.INSTALLING;
							this.installButtonStatus = this.installButtonStatusEnum.INSTALLING;
						}
					}
					break;
				case AppsForYouEnum.InstallAppResult:
					if (this.appDetails && this.appDetails.installtype.id.indexOf(AppsForYouEnum.AppTypeNativeId) !== -1) {
						if (notification.payload === 'InstallDone' || notification.payload === 'InstalledBefore') {
							this.appDetails.showStatus = this.statusEnum.INSTALLED;
							this.installButtonStatus = this.installButtonStatusEnum.LAUNCH;
						} else if (notification.payload === 'NotFinished') {
							this.errorMessage = this.translateService.instant('appsForYou.common.errorMessage.installationFailed');
							this.appDetails.showStatus = this.statusEnum.NOT_INSTALL;
							this.installButtonStatus = this.installButtonStatusEnum.INSTALL;
						} else if (notification.payload === 'Downloading') {
							this.appDetails.showStatus = this.statusEnum.DOWNLOADING;
							this.installButtonStatus = this.installButtonStatusEnum.DOWNLOADING;
						} else if (notification.payload === 'InstallerRunning') {
							this.appDetails.showStatus = this.statusEnum.INSTALLING;
							this.installButtonStatus = this.installButtonStatusEnum.INSTALLING;
						} else {
							this.errorMessage = this.translateService.instant('appsForYou.common.errorMessage.installationFailed');
							this.appDetails.showStatus = this.statusEnum.NOT_INSTALL;
							this.installButtonStatus = this.installButtonStatusEnum.INSTALL;
						}
					}
					break;
				case AppsForYouEnum.InstallationCancelled:
					this.appsForYouService.resetCancelInstall();
					break;
				case AppsForYouEnum.GetAppStatusResult:
					this.updateInstallButtonStatus(notification.payload);
					break;
				default:
					break;
			}
		}
	}

	initAppDetails(appDetails: AppDetails) {
		Object.assign(appDetails, { showStatus: this.statusEnum.NOT_INSTALL });
		this.appDetails = appDetails;
		this.title = appDetails.title;
		if (this.appDetails.installtype.title.indexOf(AppsForYouEnum.AppTypeWeb) !== -1
			|| this.appDetails.installtype.id.indexOf(AppsForYouEnum.AppTypeWebId) !== -1) {
			this.appDetails.showStatus = this.statusEnum.NOT_INSTALL;
			this.installButtonStatus = this.installButtonStatusEnum.SEEMORE;
		} else {
			this.appsForYouService.getAppStatus(this.appGuid);
		}
		if (this.appDetails.screenshots.length > 3) {
			this.showArrows = true;
			this.startScreenshotAutoSwipe();
		}
	}

	updateInstallButtonStatus(status) {
		if (this.appDetails && status) {
			if (this.appDetails.installtype.title.indexOf(AppsForYouEnum.AppTypeDesktop) !== -1
				|| this.appDetails.installtype.title.indexOf(AppsForYouEnum.AppTypeNative) !== -1
				|| this.appDetails.installtype.id.indexOf(AppsForYouEnum.AppTypeNativeId) !== -1) {
				if (status === 'InstallDone' || status === 'InstalledBefore') {
					this.appDetails.showStatus = this.statusEnum.INSTALLED;
					this.installButtonStatus = this.installButtonStatusEnum.LAUNCH;
				} else if (status === 'Downloading') {
					this.appDetails.showStatus = this.statusEnum.DOWNLOADING;
					this.installButtonStatus = this.installButtonStatusEnum.DOWNLOADING;
				} else if (status === 'InstallerRunning') {
					this.appDetails.showStatus = this.statusEnum.INSTALLING;
					this.installButtonStatus = this.installButtonStatusEnum.INSTALLING;
				} else {
					this.appDetails.showStatus = this.statusEnum.NOT_INSTALL;
					this.installButtonStatus = this.installButtonStatusEnum.INSTALL;
				}
			} else {
				// TODO: Should be Windows Store App
			}
		}
	}

	// This is version compare function which takes version numbers of any length and any number size per segment.
	// Return values:
	// - negative number if v1 < v2
	// - positive number if v1 > v2
	// - zero if v1 = v2
	private compareVersion(v1: string, v2: string) {
		const regExStrip0 = '/(\.0+)+$/';
		const segmentsA = v1.replace(regExStrip0, '').split('.');
		const segmentsB = v2.replace(regExStrip0, '').split('.');
		const min = Math.min(segmentsA.length, segmentsB.length);
		for (let i = 0; i < min; i++) {
			const diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
			if (diff) {
				return diff;
			}
		}
		return segmentsA.length - segmentsB.length;
	}

	private isLMASupportUriProtocol() {
		return new Promise(resovle => {
			const regUtil = this.vantageShellService.getRegistryUtil();
			if (regUtil) {
				const regPath = 'HKEY_LOCAL_MACHINE\\Software\\Lenovo\\Lenovo Migration Assistant';
				regUtil.queryValue(regPath).then(val => {
					if (!val || (val.keyList || []).length === 0) {
						resovle(false);
					} else {
						let support = false;
						for (const key of val.keyList) {
							const child = key.keyChildren.find(item => item.name === 'DisplayVersion');
							if (child && child.value) {
								const version = child.value;
								if (this.compareVersion(version, '2.0.1.15') >= 0) {
									support = true;
									break;
								}
							}
						}
						resovle(support);
					}
				}).catch((e) => {
					resovle(false);
				});
			} else {
				resovle(false);
			}
		});
	}

	async clickInstallButton() {
		switch (this.installButtonStatus) {
			case this.installButtonStatusEnum.SEEMORE:
				this.appsForYouService.openSeeMoreUrl(this.appGuid, this.appDetails.downloadlink);
				break;
			case this.installButtonStatusEnum.LAUNCH:
				this.isLMASupportUriProtocol().then(async (support) => {
					if (support) {
						WinRT.launchUri('lenovo-migration-assistant:vantage');
					} else {
						// If installed LMA does not support launch by URL protocol, try to launch it by GCP
						const launchPath = await this.systemUpdateBridge.getLaunchPath(this.appGuid);
						if (launchPath) {
							const paths = launchPath.split('|');
							for (const path of paths) {
								const result = await this.systemUpdateBridge.launchApp(path);
								if (result) {
									break;
								}
							}
						}
					}
				});
				break;
			case this.installButtonStatusEnum.INSTALL:
			default:
				this.errorMessage = '';
				this.appDetails.showStatus = this.statusEnum.DOWNLOADING;
				this.installButtonStatus = this.installButtonStatusEnum.DOWNLOADING;
				await this.appsForYouService.installApp(this.appGuid);
				break;
		}
	}

	openScreenshotModal(imgUrl: string) {
		const screenshotModal: NgbModalRef = this.modalService.open(ModalAppsForYouScreenshotComponent, {
			backdrop: true,
			size: 'lg',
			centered: true,
			windowClass: 'apps-for-you-dialog',
			keyboard: false,
			beforeDismiss: () => {
				if (screenshotModal.componentInstance.onBeforeDismiss) {
					screenshotModal.componentInstance.onBeforeDismiss();
				}
				return true;
			}
		});
		screenshotModal.componentInstance.metricsParent = this.metricsParent;
		screenshotModal.componentInstance.image = imgUrl;
		setTimeout(() => { document.getElementById('apps-for-you-screenshot-dialog').parentElement.parentElement.parentElement.parentElement.focus(); }, 0);
	}

	copyObjectArray(obj: any) {
		return JSON.parse(JSON.stringify(obj));
	}

}
