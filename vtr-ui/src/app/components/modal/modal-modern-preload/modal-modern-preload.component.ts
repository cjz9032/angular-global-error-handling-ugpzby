import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModernPreloadService, AppItem } from 'src/app/services/modern-preload/modern-preload.service';
import { CommonService } from 'src/app/services/common/common.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { ModernPreloadEnum } from 'src/app/enums/modern-preload.enum';
import { NetworkStatus } from 'src/app/enums/network-status.enum';

@Component({
	selector: 'vtr-modal-modern-preload',
	templateUrl: './modal-modern-preload.component.html',
	styleUrls: ['./modal-modern-preload.component.scss']
})
export class ModalModernPreloadComponent implements OnInit, OnDestroy, AfterViewInit {

	private notificationSubscription: Subscription;
	isOnline: boolean;
	isAppInstallError = false;
	nowInstallingAppID = '';
	appList: AppItem[] = [];
	checkedAppList: any[] = [];
	page: number;
	downloadButtonStatus: number;
	PageNames = { LOADING: 0, APP: 1, ERROR: -1 };
	downloadButtonStatusEnum = {
		DOWNLOAD: 1,
		RESTART_DOWNLOAD: 2,
		DOWNLOADING: 3
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
		public activeModal: NgbActiveModal,
		private commonService: CommonService,
		private modernPreloadService: ModernPreloadService,
	) { }

	ngOnInit() {
		this.getAppList();
		this.isOnline = this.commonService.isOnline;
		this.checkNetWork();
		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});
	}

	ngAfterViewInit() {

	}

	ngOnDestroy() {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			const { type, payload } = notification;
			switch (type) {
				case ModernPreloadEnum.GetEntitledAppListRespond:
					this.initAppList(notification.payload);
					const showAppPageTimeout = setTimeout(() => {
						this.page = this.PageNames.APP;
						clearTimeout(showAppPageTimeout);
					}, 100);
					break;
				case ModernPreloadEnum.InstallEntitledAppResult:
					this.downloadButtonStatus = this.downloadButtonStatusEnum.RESTART_DOWNLOAD;
					this.UpdateAppStatus(notification.payload, true);
					break;
				case ModernPreloadEnum.InstallEntitledAppProgress:
					this.UpdateAppStatus(notification.payload);
					break;
				case ModernPreloadEnum.InstallationCancelled:
					this.installationCancelled();
					break;
				case ModernPreloadEnum.CommonException:
					this.page = this.PageNames.ERROR;
					break;
				case NetworkStatus.Online:
				case NetworkStatus.Offline:
					this.isOnline = notification.payload.isOnline;
					this.checkNetWork();
					break;
			}
		}
	}

	getAppList() {
		this.page = this.PageNames.LOADING;
		this.modernPreloadService.getAppList();
	}

	initAppList(apps: AppItem[]) {
		this.appList = [];
		apps.forEach((app: AppItem) => {
			Object.assign(app, { isChecked: false, showStatus: this.statusEnum.NOT_INSTALL });
			if (app.status === ModernPreloadEnum.StatusInstalled) {
				app.showStatus = this.statusEnum.INSTALLED;
			} else {
				app.showStatus = this.statusEnum.NOT_INSTALL;
				app.isChecked = true;
			}
			this.appList.push(app);
		});
		this.checkedApp();
		this.downloadButtonStatus = this.downloadButtonStatusEnum.DOWNLOAD;
	}
	UpdateAppStatus(apps: AppItem[], isResult?: boolean) {
		let isInstallError = false;
		apps.forEach((app: AppItem) => {
			const setApp = this.appList.find(a => a.appID === app.appID);
			this.nowInstallingAppID = app.appID;
			setApp.progress = app.progress;
			switch (app.status) {
				case ModernPreloadEnum.StatusInstalled:
					setApp.showStatus = this.statusEnum.INSTALLED;
					break;
				case ModernPreloadEnum.StatusNotInstalled:
					setApp.showStatus = this.statusEnum.FAILED_INSTALL;
					isInstallError = true;
					if (app.appID === this.checkedAppList[this.checkedAppList.length - 1].appID) {
						this.downloadButtonStatus = this.downloadButtonStatusEnum.RESTART_DOWNLOAD;
					}
					break;
				case ModernPreloadEnum.StatusDownloaded:
					setApp.showStatus = this.statusEnum.DOWNLOAD_COMPLETE;
					break;
				case ModernPreloadEnum.StatusDownloading:
					setApp.showStatus = this.statusEnum.DOWNLOADING;
					break;
				case ModernPreloadEnum.StatusInstalling:
					setApp.showStatus = this.statusEnum.INSTALLING;
					break;
			}
		});
		if (isResult && isInstallError) {
			this.isAppInstallError = true;
		}
	}
	installationCancelled() {
		if (this.nowInstallingAppID !== '') {
			const setApp = this.appList.find(a => a.appID === this.nowInstallingAppID);
			if (setApp.showStatus !== this.statusEnum.INSTALLED) {
				setApp.status = ModernPreloadEnum.StatusNotInstalled;
				setApp.showStatus = this.statusEnum.FAILED_INSTALL;
			}
			this.nowInstallingAppID = '';
		}
	}

	checkedApp() {
		this.checkedAppList = [];
		this.appList.forEach(app => {
			if (app.isChecked) {
				this.checkedAppList.push(app);
			}
		});
	}

	installEntitledApp() {
		const sendAppList: AppItem[] = [];
		this.checkedAppList.forEach(app => {
			sendAppList.push({ appID: app.appID, status: app.status });
		});
		console.log(sendAppList);
		this.isAppInstallError = false;
		this.modernPreloadService.installEntitledApp(sendAppList);
		this.downloadButtonStatus = this.downloadButtonStatusEnum.DOWNLOADING;
	}

	retry() {
		this.getAppList();
	}

	cancel() {
		this.modernPreloadService.cancelInstall();
		this.downloadButtonStatus = this.downloadButtonStatusEnum.RESTART_DOWNLOAD;
		this.installationCancelled();
	}

	checkNetWork() {
		if (!this.isOnline && this.page === this.PageNames.LOADING) {
			this.page = this.PageNames.ERROR;
		}
	}

	closeModal() {
		this.activeModal.close('close');
	}
}
