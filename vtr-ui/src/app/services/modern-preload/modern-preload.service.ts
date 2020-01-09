import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { CommonService } from '../common/common.service';
import { ModernPreloadEnum } from 'src/app/enums/modern-preload.enum';
import { DeviceService } from '../device/device.service';
import { CMSService } from '../cms/cms.service';
import { LoggerService } from '../logger/logger.service';

@Injectable({
	providedIn: 'root'
})
export class ModernPreloadService {

	constructor(
		private vantageShellService: VantageShellService,
		private cmsService: CMSService,
		private deviceService: DeviceService,
		private commonService: CommonService,
		private logService: LoggerService
	) {
		this.modernPreloadBridge = this.vantageShellService.getModernPreload();
		this.initialize();
	}

	public IsEntitled = false;
	public EntitledAppList: any;
	public IsInstalling = false;
	public IsCancelInstall = false;
	public CurrentInstallingId = '';
	public DownloadButtonStatus: number;
	private modernPreloadBridge: any;
	private isInitialized = false;
	private cancelToken = undefined;
	private cmsAppList: any;
	private installingAppList: any;

	private initialize() {
		let machineInfo = this.deviceService.getMachineInfoSync();
		if (!machineInfo) {
			this.deviceService.getMachineInfo().then((info) => {
				machineInfo = info;
				this.mpBridgeInitialize(machineInfo);
			});
		} else {
			this.mpBridgeInitialize(machineInfo);
		}
	}

	private mpBridgeInitialize(machineInfo: any) {
		if (this.modernPreloadBridge && machineInfo.serialnumber) {
			this.isInitialized = this.modernPreloadBridge.initialize(machineInfo.serialnumber);
			this.getIsEntitled();
		}
	}

	public getIsEntitled() {
		if (this.isInitialized) {
			this.modernPreloadBridge.getIsEntitled().then((response) => {
				if (response.result !== undefined) {
					this.IsEntitled = response.result;
				} else {
					this.logService.error('ModernPreloadService.getIsEntitled result undefined.', JSON.stringify(response));
				}
				this.commonService.sendNotification(ModernPreloadEnum.GetIsEntitledRespond, this.IsEntitled);
			}).catch((error) => {
				this.logService.error('ModernPreloadService.getIsEntitled error.', JSON.stringify(error));
				this.commonService.sendNotification(ModernPreloadEnum.GetIsEntitledRespond, this.IsEntitled);
			});
		}
	}

	getAppList(responseHandler) {
		if (this.IsInstalling) {
			const entitledAppList = this.checkInstallingApps();
			this.sendResponseNotification(ModernPreloadEnum.GetEntitledAppListRespond, entitledAppList, responseHandler);
		} else if (this.isInitialized && (!this.cmsAppList || this.cmsAppList.length < 1)) {
			Promise.all([this.cmsService.fetchCMSEntitledAppList({ Lang: 'EN' }),
			this.modernPreloadBridge.getEntitledAppList()])
				.then((responses) => {
					this.cmsAppList = responses[0];
					this.logService.info('ModernPreloadService.getAppList cms response.', JSON.stringify(this.cmsAppList));
					this.handleGetAppListResponse(responses[1].appList, responseHandler);
				})
				.catch((error) => {
					this.logService.error('ModernPreloadService.getAppList error.', JSON.stringify(error));
					this.sendResponseNotification(ModernPreloadEnum.CommonException, error, responseHandler);
				});
		} else if (this.isInitialized) {
			this.modernPreloadBridge.getEntitledAppList().then((response) => {
				this.handleGetAppListResponse(response.appList, responseHandler);
			}).catch((error) => {
				this.logService.error('ModernPreloadService.getAppList error.', JSON.stringify(error));
				this.sendResponseNotification(ModernPreloadEnum.CommonException, error, responseHandler);
			});
		}
	}

	private checkInstallingApps() {
		if (this.IsInstalling && !this.IsCancelInstall) {
			const entitledAppList = this.EntitledAppList.map(entitledApp => {
				const installingApp = this.installingAppList.find(x => x.appID === entitledApp.appID);
				if (installingApp && installingApp.appID) {
					entitledApp.isChecked = true;
				} else {
					entitledApp.isChecked = false;
				}
				return entitledApp;
			});
			return entitledAppList;
		} else if (this.IsInstalling && this.IsCancelInstall) {
			const entitledAppList = this.EntitledAppList.map(entitledApp => {
				if (entitledApp && entitledApp.status !== ModernPreloadEnum.StatusInstalled
					&& entitledApp.originalStatus) {
					entitledApp.status = entitledApp.originalStatus;
				}
				entitledApp.isChecked = entitledApp.status !== ModernPreloadEnum.StatusInstalled;
				return entitledApp;
			});
			return entitledAppList;
		} else {
			return this.EntitledAppList;
		}
	}

	private handleGetAppListResponse(bridgeAppList: any, responseHandler) {
		if (bridgeAppList && this.cmsAppList) {
			this.logService.info('ModernPreloadService.handleGetAppListResponse response.', JSON.stringify(bridgeAppList));
			const mergedAppList: AppItem[] = this.mergeAppDetails(bridgeAppList, this.cmsAppList);
			this.EntitledAppList = mergedAppList;
			this.sendResponseNotification(ModernPreloadEnum.GetEntitledAppListRespond, mergedAppList, responseHandler);
		}
	}

	private mergeAppDetails(appList: any, cmsAppList: any) {
		appList.forEach(app => {
			const detailFromCMS = cmsAppList.find((detail) => detail.UDCId.includes(app.partNum));
			if (detailFromCMS) {
				app.company = detailFromCMS.Company;
				app.filters = detailFromCMS.Filters;
				app.size = detailFromCMS.Size;
				app.thumbnail = detailFromCMS.Thumbnail;
				app.title = detailFromCMS.Title;
				app.udcId = app.partNum;
				app.version = detailFromCMS.Version;
			}
			app.originalStatus = app.status;
			app.isChecked = app.status !== ModernPreloadEnum.StatusInstalled; // set default checked for not installed app
		});
		return appList;
	}

	installEntitledApp(sendAppList: AppItem[], responseHandler) {
		this.IsCancelInstall = false;
		this.IsInstalling = true;
		this.installingAppList = sendAppList;
		this.installAppsOneByOne(sendAppList, responseHandler);
	}

	private installAppsOneByOne(sendAppList: AppItem[], responseHandler) {
		this.installApp(0, sendAppList, responseHandler);
	}

	private installApp(i: number, appList: AppItem[], responseHandler) {
		if (this.isInitialized && i < appList.length && !this.IsCancelInstall) {
			this.cancelToken = {};
			this.modernPreloadBridge.downloadOrInstallEntitledApps([appList[i]], (progressResponse) => {
				this.logService.info('ModernPreloadService.installApp progress response.', JSON.stringify(progressResponse));
				if (progressResponse && !this.IsCancelInstall) {
					this.sendResponseNotification(ModernPreloadEnum.InstallEntitledAppProgress, progressResponse, responseHandler);
				}
			}, this.cancelToken)
				.then((response) => {
					this.cancelToken = undefined;
					this.logService.info('ModernPreloadService.installApp response.', JSON.stringify(response));
					this.IsInstalling = !(i === appList.length - 1 || this.IsCancelInstall);
					if (this.IsCancelInstall) {
						this.IsCancelInstall = false;
						this.sendResponseNotification(ModernPreloadEnum.InstallationCancelled, null, responseHandler);
					} else if (response.appList && i === appList.length - 1) {
						this.sendResponseNotification(ModernPreloadEnum.InstallEntitledAppResult, response.appList, responseHandler);
					} else if (response.appList && i < appList.length - 1) {
						this.sendResponseNotification(ModernPreloadEnum.InstallEntitledAppProgress, response.appList, responseHandler);
						i++;
						this.installApp(i, appList, responseHandler);
					}
				}).catch((error) => {
					this.logService.error('ModernPreloadService.installApp error.', JSON.stringify(error));
					this.cancelToken = undefined;
					if (error.errorcode === 499 || this.IsCancelInstall) {
						this.IsInstalling = false;
						this.IsCancelInstall = false;
						this.sendResponseNotification(ModernPreloadEnum.InstallationCancelled, null, responseHandler);
					} else {
						appList[i].progress = 100;
						appList[i].status = appList[i].status === ModernPreloadEnum.StatusInstalled
							? ModernPreloadEnum.StatusInstalled
							: ModernPreloadEnum.StatusNotInstalled;
						this.IsInstalling = !(i === appList.length - 1);
						if (i === appList.length - 1) {
							this.sendResponseNotification(ModernPreloadEnum.InstallEntitledAppResult, [appList[i]], responseHandler);
						} else {
							this.sendResponseNotification(ModernPreloadEnum.InstallEntitledAppProgress, [appList[i]], responseHandler);
							i++;
							this.installApp(i, appList, responseHandler);
						}
					}
				});
		}
	}

	private sendResponseNotification(type: ModernPreloadEnum,  payload: any, responseHandler: any) {
		const notification = { type, payload };
		responseHandler(notification);
	}

	cancelInstall() {
		this.IsCancelInstall = true;
		this.DownloadButtonStatus = DownloadButtonStatusEnum.RESTART_DOWNLOAD;
		if (this.cancelToken) {
			this.cancelToken.cancel();
		}
	}
}

export class AppItem {
	appID: string;
	originalStatus?: string;
	status: string;
	progress?: any;
	title?: string;
	thumbnail?: string;
	company?: string;
	version?: string;
	size?: string;
	udcId?: string; // in response from IMC, it is partNum
	filters?: string;
	name?: string;
	verbose?: string;
	isChecked?: boolean;
	showStatus?: number;
}

export enum DownloadButtonStatusEnum {
	DOWNLOAD = 1,
	RESTART_DOWNLOAD = 2,
	DOWNLOADING = 3
}
