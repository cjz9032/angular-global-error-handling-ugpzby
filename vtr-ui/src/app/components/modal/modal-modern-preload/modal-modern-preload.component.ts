import { Component, OnInit, OnDestroy, AfterViewInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModernPreloadService, AppItem, DownloadButtonStatusEnum } from 'src/app/services/modern-preload/modern-preload.service';
import { CommonService } from 'src/app/services/common/common.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { ModernPreloadEnum } from 'src/app/enums/modern-preload.enum';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { ClipboardService } from 'ngx-clipboard';

@Component({
	selector: 'vtr-modal-modern-preload',
	templateUrl: './modal-modern-preload.component.html',
	styleUrls: ['./modal-modern-preload.component.scss']
})
export class ModalModernPreloadComponent implements OnInit, OnDestroy, AfterViewInit {

	private notificationSubscription: Subscription;
	@ViewChild('redeemUrlCopy', {static: false}) redeemUrlCopy: ElementRef;
	@ViewChild('redeemCodeCopy', {static: false}) redeemCodeCopy: ElementRef;

	isOnline: boolean;
	isAppInstallError = false;
	appList: AppItem[] = [];
	checkedAppList: any[] = [];
	page: number;
	downloadButtonStatus: number;
	PageNames = { LOADING: 0, APP: 1, ERROR: -1 };
	DownloadButtonStatusEnum = DownloadButtonStatusEnum;
	statusEnum = {
		NOT_INSTALL: 1,
		INSTALLED: 2,
		DOWNLOADING: 3,
		DOWNLOAD_COMPLETE: 4,
		INSTALLING: 5,
		FAILED_INSTALL: -1,
	};

	successIconBase64 = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciI
		HZpZXdCb3g9IjAgMCAyMSAyMSI+PHRpdGxlPmltZ19teV9zb2Z0d2FyZV9ncmVlbl9jaGVjazwvdGl0bGU+PHBhdGggZD0iTTI
		wLjUsMTAuNWExMCwxMCwwLDEsMS0xMC0xMCwxMCwxMCwwLDAsMSwxMCwxMCIgc3R5bGU9ImZpbGw6IzRkYTM0NiIvPjxwYXRoI
		GQ9Ik0yMC41LDEwLjVhMTAsMTAsMCwxLDEtMTAtMTBBMTAsMTAsMCwwLDEsMjAuNSwxMC41WiIgc3R5bGU9ImZpbGw6bm9uZTt
		zdHJva2U6I2ZmZjtzdHJva2UtbWl0ZXJsaW1pdDoxMCIvPjxwb2x5bGluZSBwb2ludHM9IjUgMTAuOSA4LjYgMTQuOCAxNiA2L
		jkiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiNmZmY7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjJweCIvPjw
		vc3ZnPg==`;
	errorIconBase64 = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZ
		pZXdCb3g9IjAgMCAyMSAyMSI+PHRpdGxlPmltZ19teV9zb2Z0d2FyZV9mYWlsZWRfaW5zdGFsbDwvdGl0bGU+PHBhdGggZD0iT
		TIwLjUsMTAuNWExMCwxMCwwLDEsMS0xMC0xMGgwYTEwLDEwLDAsMCwxLDEwLDEwaDAiIHN0eWxlPSJmaWxsOiNkYWM0MjYiLz4
		8Y2lyY2xlIGN4PSIxMC41IiBjeT0iMTAuNSIgcj0iMTAiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiNmZmY7c3Ryb2tlLW1pd
		GVybGltaXQ6MTAiLz48ZyBzdHlsZT0iaXNvbGF0aW9uOmlzb2xhdGUiPjxwYXRoIGQ9Ik05LjgsMTIuOSw5LjEsNi44VjMuOWg
		yLjdWNi43bC0uNiw2LjFIOS44Wk05LjIsMTZWMTMuN2gyLjVWMTZaIiBzdHlsZT0iZmlsbDojZmZmIi8+PC9nPjwvc3ZnPg==`;
	downloadIconBase64 = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmci
		IHZpZXdCb3g9IjAgMCAyMSAyMSI+PHRpdGxlPmltZ19teV9zb2Z0d2FyZV9kb3dubG9hZF9hdmFpbGFibGU8L3RpdGxlPjxwYX
		RoIGQ9Ik0yMC41LDEwLjVhMTAsMTAsMCwxLDEtMTAtMTAsMTAsMTAsMCwwLDEsMTAsMTAiIHN0eWxlPSJmaWxsOiM0ZGEzNDYi
		Lz48cGF0aCBkPSJNMjAuNSwxMC41YTEwLDEwLDAsMSwxLTEwLTEwQTEwLDEwLDAsMCwxLDIwLjUsMTAuNVoiIHN0eWxlPSJmaW
		xsOm5vbmU7c3Ryb2tlOiNmZmY7c3Ryb2tlLW1pdGVybGltaXQ6MTAiLz48cmVjdCB4PSI4LjkiIHk9IjMuNyIgd2lkdGg9IjIu
		OSIgaGVpZ2h0PSI1LjciIHN0eWxlPSJmaWxsOiNmZmYiLz48cG9seWdvbiBwb2ludHM9IjcuNyA4LjkgMTMuNCA4LjkgMTAuNS
		AxMyA3LjcgOC45IiBzdHlsZT0iZmlsbDojZmZmIi8+PHBvbHlsaW5lIHBvaW50cz0iNS4zIDEwLjUgNS4zIDE0LjggMTYuMSAx
		NC44IDE2LjEgMTAuOCIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6I2ZmZjtzdHJva2UtbWl0ZXJsaW1pdDoxMCIvPjwvc3ZnPg
		==`;

	constructor(
		public activeModal: NgbActiveModal,
		private commonService: CommonService,
		public modernPreloadService: ModernPreloadService,
		private clipboardService: ClipboardService,
	) { }

	ngOnInit() {
		this.getAppList();
		if (this.modernPreloadService.IsInstalling && !this.modernPreloadService.IsCancelInstall) {
			this.modernPreloadService.DownloadButtonStatus = DownloadButtonStatusEnum.DOWNLOADING;
		}
		this.isOnline = this.commonService.isOnline;
		this.checkNetWork();
		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});
	}

	ngAfterViewInit() {
		setTimeout(() => { this.onFocus(); }, 0);
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
				case NetworkStatus.Online:
				case NetworkStatus.Offline:
					this.isOnline = notification.payload.isOnline;
					this.checkNetWork();
					break;
			}
		}
	}

	private responseHandler(response) {
		if (response) {
			const { type, payload } = response;
			switch (type) {
				case ModernPreloadEnum.GetEntitledAppListRespond:
					this.initAppList(payload);
					const showAppPageTimeout = setTimeout(() => {
						this.page = this.PageNames.APP;
						this.onFocus();
						clearTimeout(showAppPageTimeout);
					}, 100);
					break;
				case ModernPreloadEnum.InstallEntitledAppResult:
					this.UpdateAppStatus(payload, true);
					this.modernPreloadService.DownloadButtonStatus = DownloadButtonStatusEnum.RESTART_DOWNLOAD;
					break;
				case ModernPreloadEnum.InstallEntitledAppProgress:
					this.UpdateAppStatus(payload);
					break;
				case ModernPreloadEnum.InstallationCancelled:
					this.modernPreloadService.IsCancelInstall = false;
					break;
				case ModernPreloadEnum.CommonException:
					this.page = this.PageNames.ERROR;
					break;
			}
		}
	}

	copy(text: string, id: string) {
		this.clipboardService.copyFromContent(text);
		this[id].nativeElement.focus();
	}

	getAppList() {
		this.page = this.PageNames.LOADING;
		this.modernPreloadService.getAppList((response) => this.responseHandler(response));
	}

	initAppList(apps: AppItem[]) {
		this.appList = [];
		apps.forEach((app: AppItem) => {
			Object.assign(app, { showStatus: this.statusEnum.NOT_INSTALL });
			if (app.status === ModernPreloadEnum.StatusInstalled) {
				app.showStatus = this.statusEnum.INSTALLED;
			} else {
				app.showStatus = this.statusEnum.NOT_INSTALL;
			}
			this.appList.push(app);
		});
		this.setAppProps();
		this.checkedApp();
		this.modernPreloadService.DownloadButtonStatus = DownloadButtonStatusEnum.DOWNLOAD;
	}

	setAppProps() {
		this.appList.forEach(appItem => {
			if (appItem.activationCode) {
				appItem.hiddenCharacters = '';
				appItem.activationCode.split('').forEach(letter => {
					appItem.hiddenCharacters += `<span>${letter === '-' ? '-' : '●'}</span>`;
				});
			}
			appItem.isCheckDisabled = !(!appItem.activationCode && !appItem.redemptionURL);
		});
	}

	setRedeemStatus(appItem: AppItem) {
		appItem.isShowActiveCode = !appItem.isShowActiveCode;
	}

	UpdateAppStatus(apps: AppItem[], isResult?: boolean) {
		let isInstallError = false;
		apps.forEach((app: AppItem) => {
			const setApp = this.appList.find(a => a.appID === app.appID);
			this.modernPreloadService.CurrentInstallingId = app.appID;
			setApp.progress = app.progress;
			switch (app.status) {
				case ModernPreloadEnum.StatusInstalled:
					setApp.showStatus = this.statusEnum.INSTALLED;
					break;
				case ModernPreloadEnum.StatusNotInstalled:
					setApp.showStatus = this.statusEnum.FAILED_INSTALL;
					isInstallError = true;
					break;
				case ModernPreloadEnum.StatusDownloaded:
					setApp.showStatus = this.statusEnum.DOWNLOAD_COMPLETE;
					break;
				case ModernPreloadEnum.StatusDownloading:
					setApp.showStatus = this.statusEnum.DOWNLOADING;
					break;
				case ModernPreloadEnum.StatusInstalling:
					setApp.showStatus = this.statusEnum.DOWNLOAD_COMPLETE;
					break;
			}
		});
		if (isResult && isInstallError) {
			this.isAppInstallError = true;
		}
	}

	installationCancell() {
		if (this.modernPreloadService.CurrentInstallingId !== '') {
			const setApp = this.appList.find(a => a.appID === this.modernPreloadService.CurrentInstallingId);
			if (setApp.showStatus !== this.statusEnum.INSTALLED) {
				setApp.status = ModernPreloadEnum.StatusNotInstalled;
				setApp.showStatus = this.statusEnum.FAILED_INSTALL;
				this.isAppInstallError = true;
			}
			this.modernPreloadService.CurrentInstallingId = '';
		}
	}

	setAppCheckStatus(appItem: AppItem) {
		if (this.modernPreloadService.DownloadButtonStatus === DownloadButtonStatusEnum.DOWNLOADING || appItem.isCheckDisabled) {
			return false;
		}
		appItem.isChecked = !appItem.isChecked;
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
		this.modernPreloadService.installEntitledApp(sendAppList, (response) => this.responseHandler(response));
		this.modernPreloadService.DownloadButtonStatus = DownloadButtonStatusEnum.DOWNLOADING;
	}

	retry() {
		this.getAppList();
	}

	cancel() {
		this.modernPreloadService.cancelInstall();
		this.installationCancell();
	}

	checkNetWork() {
		if (!this.isOnline && this.page === this.PageNames.LOADING) {
			this.page = this.PageNames.ERROR;
		} else if (!this.isOnline && this.page === this.PageNames.APP && this.modernPreloadService.CurrentInstallingId !== '') {
			const setApp = this.appList.find(a => a.appID === this.modernPreloadService.CurrentInstallingId);
			if (setApp.showStatus === this.statusEnum.DOWNLOADING ||
				setApp.showStatus === this.statusEnum.INSTALLING) {
				this.cancel();
				this.isAppInstallError = true;
			}
		}
	}

	closeModal() {
		this.activeModal.close('close');
	}

	@HostListener('window: focus')
	onFocus(): void {
		const modal = document.querySelector('.modern-preload-modal') as HTMLElement;
		modal.focus();
	}
}
