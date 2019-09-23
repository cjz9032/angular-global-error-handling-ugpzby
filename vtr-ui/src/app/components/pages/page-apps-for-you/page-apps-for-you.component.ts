import { Component, OnInit, OnDestroy } from '@angular/core';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { Subscription } from 'rxjs/internal/Subscription';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { AppsForYouEnum } from 'src/app/enums/apps-for-you.enum';
import { AppsForYouService, AppDetails } from 'src/app/services/apps-for-you/apps-for-you.service';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalAppsForYouScreenshotComponent } from '../../modal/modal-apps-for-you-screenshot/modal-apps-for-you-screenshot.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'vtr-page-apps-for-you',
	templateUrl: './page-apps-for-you.component.html',
	styleUrls: ['./page-apps-for-you.component.scss']
})
export class PageAppsForYouComponent implements OnInit, OnDestroy {

	title = '';
	isOnline: boolean;
	notificationSubscription: Subscription;
	backId = 'apps-for-you-page-btn-back';

	systemUpdateBridge: any;
	appDetails: AppDetails;
	errorMessage: any;
	installButtonStatus: number;
	public appGuid: any;

	installButtonStatusEnum = {
		INSTALL: 1,
		INSTALLING: 2,
		LAUNCH: 3,
		SEEMORE: 4,
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

	mockScreenShots = [
		{
			id: 'apps-for-you-screenshot-1',
			imageUrl: 'assets/images/apps-for-you/screenshot1(1).png',
			position: 1,
			isRepeat: false,
			show: 'show',
		},
		{
			id: 'apps-for-you-screenshot-2',
			imageUrl: 'assets/images/apps-for-you/screenshot2[1].png',
			position: 2,
			isRepeat: false,
			show: 'show',
		},
		{
			id: 'apps-for-you-screenshot-3',
			imageUrl: 'assets/images/apps-for-you/screenshot3-3.png',
			position: 3,
			isRepeat: false,
			show: 'show',
		},
		{
			id: 'apps-for-you-screenshot-4',
			imageUrl: 'assets/images/apps-for-you/screenshot2[1].png',
			position: 4,
			isRepeat: false,
			show: 'show',
		},
		// {
		// 	id: 'apps-for-you-screenshot-5',
		// 	imageUrl: 'assets/images/apps-for-you/screenshot3-3.png',
		// 	position: 5,
		// 	isRepeat: false,
		// 	show: 'show',
		// },
	];
	screenshotInterval: any;
	showArrows = false;
	arrowClickable = true;

	constructor(
		private route: ActivatedRoute,
		private commonService: CommonService,
		private loggerService: LoggerService,
		private shellService: VantageShellService,
		public modalService: NgbModal,
		private appsForYouService: AppsForYouService,
		private translateService: TranslateService
	) {
		this.isOnline = this.commonService.isOnline;
		this.systemUpdateBridge = shellService.getSystemUpdate();
		this.route.params.subscribe((params) => {
			this.appGuid = params.id;
			this.appsForYouService.getAppDetails(this.appGuid);
		});
	}

	ngOnInit() {
		this.errorMessage = '';
		this.installButtonStatus = this.installButtonStatusEnum.UNKNOWN;
		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});
		if (this.mockScreenShots.length > 3) {
			this.showArrows = true;
			this.startScreenshotAutoSwipe();
		}
	}

	ngOnDestroy() {
		clearInterval(this.screenshotInterval);
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
	}

	startScreenshotAutoSwipe() {
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
		const screenshotNumber = this.mockScreenShots.length;
		const preScreenShotIndex = this.mockScreenShots.findIndex(m => m.position === 0);
		if (preScreenShotIndex > -1) {
			const temp = JSON.parse(JSON.stringify(this.mockScreenShots[preScreenShotIndex]));
			this.mockScreenShots.splice(preScreenShotIndex, 1);
			temp.position = screenshotNumber;
			this.mockScreenShots.push(temp);
		}
		setTimeout(() => {
			this.mockScreenShots.forEach(ss => {
				ss.position--;
			});
			this.arrowClickable = true;
		}, 20);
	}
	swipeLeftToRight() {
		if (!this.arrowClickable) { return false; }
		this.arrowClickable = false;
		const screenshotNumber = this.mockScreenShots.length;
		const lastScreenShotIndex = this.mockScreenShots.findIndex(m => m.position === screenshotNumber);
		if (lastScreenShotIndex > -1) {
			const temp = JSON.parse(JSON.stringify(this.mockScreenShots[lastScreenShotIndex]));
			this.mockScreenShots.splice(lastScreenShotIndex, 1);
			temp.position = 0;
			this.mockScreenShots.push(temp);
		}
		const timeout = setTimeout(() => {
			this.mockScreenShots.forEach(ss => {
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
					this.isOnline = notification.payload.isOnline;
					if (!this.isOnline) {
						this.appsForYouService.cancelInstall();
					}
					break;
				case AppsForYouEnum.GetAppDetailsRespond:
					this.initAppDetails(notification.payload);
					break;
				case AppsForYouEnum.InstallAppProgress:
					this.appDetails.showStatus = this.statusEnum.INSTALLING;
					this.installButtonStatus = this.installButtonStatusEnum.INSTALLING;
					break;
				case AppsForYouEnum.InstallAppResult:
					if (notification.payload === 'InstallDone' || notification.payload === 'InstalledBefore') {
						this.appDetails.showStatus = this.statusEnum.INSTALLED;
						this.installButtonStatus = this.installButtonStatusEnum.LAUNCH;
					} else if (notification.payload === 'NotFinished') {
						this.errorMessage = this.translateService.instant('appsForYou.common.installationFailed');
						this.appDetails.showStatus = this.statusEnum.NOT_INSTALL;
						this.installButtonStatus = this.installButtonStatusEnum.INSTALL;
					} else if (notification.payload === 'InstallerRunning') {
						this.appDetails.showStatus = this.statusEnum.INSTALLING;
						this.installButtonStatus = this.installButtonStatusEnum.INSTALLING;
					} else {
						this.errorMessage = this.translateService.instant('appsForYou.common.installationFailed');
						this.appDetails.showStatus = this.statusEnum.NOT_INSTALL;
						this.installButtonStatus = this.installButtonStatusEnum.INSTALL;
					}
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
		if (appDetails.installtype.title === AppsForYouEnum.AppTypeWeb) {
			this.appDetails.showStatus = this.statusEnum.NOT_INSTALL;
			this.installButtonStatus = this.installButtonStatusEnum.SEEMORE;
		} else if (appDetails.installtype.title === AppsForYouEnum.AppTypeDesktop) {
			this.updateInstallButtonStatus();
		} else {
			// TODO: Should be Windows Store App
		}
	}

	updateInstallButtonStatus() {
		this.systemUpdateBridge.getAppStatus(this.appGuid).then(status => {
			if (status === 'InstallDone' || status === 'InstalledBefore') {
				this.appDetails.showStatus = this.statusEnum.INSTALLED;
				this.installButtonStatus = this.installButtonStatusEnum.LAUNCH;
			} else if (status === 'InstallerRunning') {
				this.appDetails.showStatus = this.statusEnum.INSTALLING;
				this.installButtonStatus = this.installButtonStatusEnum.INSTALLING;
			} else {
				this.appDetails.showStatus = this.statusEnum.NOT_INSTALL;
				this.installButtonStatus = this.installButtonStatusEnum.INSTALL;
			}
		});
	}

	async clickInstallButton() {
		switch (this.installButtonStatus) {
			case this.installButtonStatusEnum.SEEMORE:
				this.appsForYouService.openSeeMoreUrl();
				break;
			case this.installButtonStatusEnum.LAUNCH:
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
				break;
			case this.installButtonStatusEnum.INSTALL:
			default:
				this.errorMessage = '';
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
		screenshotModal.componentInstance.image = imgUrl;
		setTimeout(() => { document.getElementById('apps-for-you-screenshot-dialog').parentElement.parentElement.parentElement.parentElement.focus(); }, 0);
	}

	copyObjectArray(obj: any) {
		return JSON.parse(JSON.stringify(obj));
	}

}
