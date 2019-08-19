import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { LocalInfoService } from '../local-info/local-info.service';
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
	private modernPreloadBridge: any;
	private isInitialized = false;
	private cancelToken = undefined;
	private isCancelInstall = false;
	private cmsAppList: any;

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

	getAppList() {
		if (this.isInitialized && (!this.cmsAppList || this.cmsAppList.length < 1)) {
			Promise.all([this.cmsService.fetchCMSEntitledAppList({ Lang: 'EN' }),
			this.modernPreloadBridge.getEntitledAppList()])
				.then((responses) => {
					this.cmsAppList = responses[0];
					this.logService.info('ModernPreloadService.getAppList cms response.', JSON.stringify(this.cmsAppList));
					this.handleGetAppListResponse(responses[1].appList);
				})
				.catch((error) => {
					this.logService.error('ModernPreloadService.getAppList error.', JSON.stringify(error));
					this.commonService.sendNotification(ModernPreloadEnum.CommonException, error);
				});
		} else if (this.isInitialized) {
			this.modernPreloadBridge.getEntitledAppList().then((response) => {
				this.handleGetAppListResponse(response.appList);
			}).catch((error) => {
				this.logService.error('ModernPreloadService.getAppList error.', JSON.stringify(error));
				this.commonService.sendNotification(ModernPreloadEnum.CommonException, error);
			});
		}
	}

	private handleGetAppListResponse(bridgeAppList: any) {
		if (bridgeAppList && this.cmsAppList) {
			this.logService.info('ModernPreloadService.handleGetAppListResponse response.', JSON.stringify(bridgeAppList));
			const mergedAppList: AppItem = this.mergeAppDetails(bridgeAppList, this.cmsAppList);
			this.commonService.sendNotification(ModernPreloadEnum.GetEntitledAppListRespond, mergedAppList);
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
		});
		return appList;
	}

	installEntitledApp(sendAppList: AppItem[]) {
		this.isCancelInstall = false;
		this.installAppsOneByOne(sendAppList);
	}

	private installAppsOneByOne(sendAppList: AppItem[]) {
		this.installApp(0, sendAppList);
	}

	private installApp(i: number, appList: AppItem[]) {
		if (this.isInitialized && i < appList.length && !this.isCancelInstall) {
			this.cancelToken = {};
			this.modernPreloadBridge.downloadOrInstallEntitledApps([appList[i]], (progressResponse) => {
				this.logService.info('ModernPreloadService.installApp progress response.', JSON.stringify(progressResponse));
				if (progressResponse && !this.isCancelInstall) {
					this.commonService.sendNotification(ModernPreloadEnum.InstallEntitledAppProgress, progressResponse);
				}
			}, this.cancelToken)
				.then((response) => {
					this.cancelToken = undefined;
					this.logService.info('ModernPreloadService.installApp response.', JSON.stringify(response));
					if (response.appList && i === appList.length - 1) {
						this.commonService.sendNotification(ModernPreloadEnum.InstallEntitledAppResult, response.appList);
					} else if (response.appList && !this.isCancelInstall) {
						this.commonService.sendNotification(ModernPreloadEnum.InstallEntitledAppProgress, response.appList);
						i++;
						this.installApp(i, appList);
					}
				}).catch((error) => {
					this.logService.error('ModernPreloadService.installApp error.', JSON.stringify(error));
					this.cancelToken = undefined;
					if (error.errorcode === 499) {
						this.commonService.sendNotification(ModernPreloadEnum.InstallationCancelled);
					} else {
						appList[i].progress = 100;
						appList[i].status = appList[i].status === ModernPreloadEnum.StatusInstalled
							? ModernPreloadEnum.StatusInstalled
							: ModernPreloadEnum.StatusNotInstalled;
						if (i === appList.length - 1) {
							this.commonService.sendNotification(ModernPreloadEnum.InstallEntitledAppResult, [appList[i]]);
						} else {
							this.commonService.sendNotification(ModernPreloadEnum.InstallEntitledAppProgress, [appList[i]]);
							i++;
							this.installApp(i, appList);
						}
					}
				});
		}
	}

	private installAllApp(appList: AppItem[]) {
		if (this.isInitialized && !this.isCancelInstall) {
			this.cancelToken = {};
			this.modernPreloadBridge.downloadOrInstallEntitledApps(appList, (progressResponse) => {
				if (progressResponse) {
					this.commonService.sendNotification(ModernPreloadEnum.InstallEntitledAppProgress, progressResponse);
				}
			}, this.cancelToken)
				.then((response) => {
					this.cancelToken = undefined;
					if (response.appList) {
						this.commonService.sendNotification(ModernPreloadEnum.InstallEntitledAppResult, response.appList);
					}
				}).catch((error) => {
					this.logService.error('ModernPreloadService.installAllApp error.', JSON.stringify(error));
					this.cancelToken = undefined;
					if (error.errorcode === 499) {
						this.commonService.sendNotification(ModernPreloadEnum.InstallationCancelled);
					} else if (error.errorcode === 1066 && appList.length === 1) {
						appList[0].progress = 100;
						appList[0].status = ModernPreloadEnum.StatusNotInstalled;
						this.commonService.sendNotification(ModernPreloadEnum.InstallEntitledAppResult, appList);
					} else {
						this.commonService.sendNotification(ModernPreloadEnum.CommonException, error);
					}
				});
		}
	}

	cancelInstall() {
		this.isCancelInstall = true;
		if (this.cancelToken) {
			this.cancelToken.cancel();
		}
	}
}

export class AppItem {
	appID: string;
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
