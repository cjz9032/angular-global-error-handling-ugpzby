import { Component, OnInit } from '@angular/core';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { Subscription } from 'rxjs/internal/Subscription';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { AppsForYouEnum } from 'src/app/enums/apps-for-you.enum';
import { AppsForYouService, AppDetails } from 'src/app/services/apps-for-you/apps-for-you.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'vtr-page-apps-for-you',
	templateUrl: './page-apps-for-you.component.html',
	styleUrls: ['./page-apps-for-you.component.scss']
})
export class PageAppsForYouComponent implements OnInit {

	title = 'Lenovo Migration Assistant';
	isOnline: boolean;
	notificationSubscription: Subscription;
	backId = 'apps-for-you-page-btn-back';
	isCategoryArticlesShow: true;
	systemUpdateBridge: any;
	appDetails: AppDetails;
	installButtonStatus: number;
	public appGuid: any;

	installButtonStatusEnum = {
		INSTALL: 1,
		INSTALLING: 2,
		LAUNCH: 3,
		SEEMORE: 4
	};

	statusEnum = {
		NOT_INSTALL: 1,
		INSTALLED: 2,
		DOWNLOADING: 3,
		DOWNLOAD_COMPLETE: 4,
		INSTALLING: 5,
		FAILED_INSTALL: -1,
	};

	constructor(
		private route: ActivatedRoute,
		private commonService: CommonService,
		private loggerService: LoggerService,
		private shellService: VantageShellService,
		private appsForYouService: AppsForYouService
	) {
		// TODO: pass appGuid in route link
		this.appGuid = 'FCF9F618-10F4-4230-99DD-F9B1CCB316AF'; // this.route.queryParams;
		this.isOnline = this.commonService.isOnline;
		this.systemUpdateBridge = shellService.getSystemUpdate();
	}

	ngOnInit() {
		this.appsForYouService.getAppDetails();
		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});
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
					this.installButtonStatus = this.installButtonStatusEnum.INSTALLING;
					break;
				case AppsForYouEnum.InstallAppResult:
					if (notification.payload === 'InstallDone') {
						this.appDetails.showStatus = this.statusEnum.INSTALLED;
						this.installButtonStatus = this.installButtonStatusEnum.LAUNCH;
					} else {
						this.appDetails.showStatus = this.statusEnum.INSTALLED;
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
		this.installButtonStatus = this.installButtonStatusEnum.INSTALL;
	}

	async clickInstallButton() {
		switch (this.installButtonStatus) {
			case this.installButtonStatusEnum.SEEMORE:
				break;
			case this.installButtonStatusEnum.LAUNCH:
				const path = this.systemUpdateBridge.getLaunchPath(this.appGuid);
				break;
			case this.installButtonStatusEnum.INSTALL:
			default:
				await this.appsForYouService.installApp(this.appGuid);
				break;
		}
	}

	onInnerBack() {

	}

	copyObjectArray(obj: any) {
		return JSON.parse(JSON.stringify(obj));
	}

}
