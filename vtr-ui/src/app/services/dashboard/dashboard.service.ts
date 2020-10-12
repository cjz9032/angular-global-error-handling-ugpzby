import { Injectable } from '@angular/core';

import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { Observable } from 'rxjs/internal/Observable';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { SegmentConst } from '../self-select/self-select.service';
import { LocalInfoService } from '../local-info/local-info.service';
import { FeatureContent } from 'src/app/data-models/common/feature-content.model';
import { ContentActionType, ContentSource } from 'src/app/enums/content.enum';
import { LocalCacheService } from '../local-cache/local-cache.service';
import { SystemUpdateService } from '../system-update/system-update.service';
import { PreviousResultService } from '../../modules/hardware-scan/services/previous-result.service';
import { DeviceService } from '../device/device.service';
import { SmartPerformanceService } from '../smart-performance/smart-performance.service';
import { MetricService } from '../metric/metrics.service';
import { AdPolicyService } from '../ad-policy/ad-policy.service';
import { HardwareScanService } from '../../modules/hardware-scan/services/hardware-scan.service';
import { ConfigService } from '../config/config.service';
import { SystemHealthDates, SystemState } from 'src/app/enums/system-state.enum';

interface IContentGroup {
	positionA: any[];
	positionB: FeatureContent;
	positionC: FeatureContent;
	positionD: FeatureContent;
	positionE: FeatureContent;
	positionF: FeatureContent;
}

@Injectable({
	providedIn: 'root'
})
export class DashboardService {
	private dashboard: any;
	public eyeCareMode: any;
	private sysinfo: any;
	private sysupdate: any;
	private warranty: any;
	public isShellAvailable = false;
	public isDashboardDisplayed = false;
	private commonService: CommonService;
	offlineCardContent: IContentGroup = {
		positionA: null,
		positionB: null,
		positionC: null,
		positionD: null,
		positionE: null,
		positionF: null
	};
	onlineCardContent: IContentGroup = {
		positionA: null,
		positionB: null,
		positionC: null,
		positionD: null,
		positionE: null,
		positionF: null
	};
	translateString: any;

	welcomeText = '';

	positionBLoadingData = {
		title: 'dashboard.positionB.cardTitle',
		summary: 'dashboard.positionB.cardSummary.detecting',
		linkText: 'device.myDevice.title',
		linkPath: 'device',
		state: SystemState.Loading,
		stateText: ''
	}

	goodConditionData = {
		title: 'dashboard.positionB.cardTitle',
		summary: 'dashboard.positionB.cardSummary.goodCondition',
		linkText: 'device.myDevice.title',
		linkPath: 'device',
		state: SystemState.GoodCondition,
		stateText: 'device.myDevice.goodCondition'
	};

	needMaintainSU = {
		title: 'dashboard.positionB.cardTitle',
		summary: 'dashboard.positionB.cardSummary.maintenanceNeeded',
		linkText: 'common.ui.improveNow',
		linkPath: 'device/system-updates',
		state: SystemState.NeedMaintenance,
		stateText: 'device.myDevice.needAction'
	};

	needMaintainHWS = {
		title: 'dashboard.positionB.cardTitle',
		summary: 'dashboard.positionB.cardSummary.maintenanceNeeded',
		linkText: 'common.ui.improveNow',
		linkPath: 'hardware-scan',
		state: SystemState.NeedMaintenance,
		stateText: 'device.myDevice.needAction'
	};

	needMaintainSP = {
		title: 'dashboard.positionB.cardTitle',
		summary: 'dashboard.positionB.cardSummary.maintenanceNeeded',
		linkText: 'common.ui.improveNow',
		linkPath: 'support/smart-performance',
		state: SystemState.NeedMaintenance,
		stateText: 'device.myDevice.needAction'
	};

	positionBResponseReceived: boolean;
	positionBLoadingTimer: any;

	constructor(
		shellService: VantageShellService,
		commonService: CommonService,
		private localCacheService: LocalCacheService,
		private localInfoService: LocalInfoService,
		private systemUpdateService: SystemUpdateService,
		private previousResultService: PreviousResultService,
		private deviceService: DeviceService,
		private metricService: MetricService,
		private adPolicyService: AdPolicyService,
		private hardwareScanService: HardwareScanService,
		private configService: ConfigService,
		private spService: SmartPerformanceService
	) {
		this.dashboard = shellService.getDashboard();
		this.eyeCareMode = shellService.getEyeCareMode();
		this.sysinfo = null;
		this.commonService = commonService;
		if (this.dashboard) {
			this.isShellAvailable = true;
			this.sysinfo = this.dashboard.sysinfo;
			this.sysupdate = this.dashboard.sysupdate;
			this.warranty = this.dashboard.warranty;
		}
		if (this.eyeCareMode) {
			this.isShellAvailable = true;
		}
	}

	public getMicrophoneStatus(): Promise<FeatureStatus> {
		try {
			if (this.dashboard) {
				return this.dashboard.getMicphoneStatus();
			}
			return undefined;
		} catch (error) {
			throw Error(error.message);
		}
	}

	public setMicrophoneStatus(value: boolean): Promise<boolean> {
		try {
			if (this.dashboard) {
				return this.dashboard.setMicphoneStatus(value);
			}
			return undefined;
		} catch (error) {
			throw Error(error.message);
		}
	}

	public getCameraStatus(): Promise<FeatureStatus> {
		try {
			if (this.dashboard) {
				return this.dashboard.getCameraStatus();
			}
			return undefined;
		} catch (error) {
			throw Error(error.message);
		}
	}

	public setCameraStatus(value: boolean): Promise<boolean> {
		try {
			if (this.dashboard) {
				return this.dashboard.setCameraStatus(value);
			}
			return undefined;
		} catch (error) {
			throw Error(error.message);
		}
	}

	// public getEyeCareMode(): Promise<FeatureStatus> {
	// 	try {
	// 		if (this.dashboard) {
	// 			return this.dashboard.getEyecareMode();
	// 		}
	// 		return undefined;
	// 	} catch (error) {
	// 		throw Error(error.message);
	// 	}

	// }

	public getEyeCareMode(): Promise<FeatureStatus> {
		try {
			if (this.eyeCareMode) {
				return this.eyeCareMode.getEyeCareModeState();
			}
			return undefined;
		} catch (error) {
			throw Error(error.message);
		}
	}

	public setEyeCareMode(value: boolean): Promise<boolean> {
		try {
			if (this.dashboard) {
				return this.dashboard.setEyecareMode(value);
			}
			return undefined;
		} catch (error) {
			throw Error(error.message);
		}
	}

	public getSystemInfo(): Promise<any> {
		try {
			if (this.dashboard) {
				return this.dashboard.getSystemInfo();
			}
			return undefined;
		} catch (error) {
			throw Error(error.message);
		}
	}

	public getSecurityStatus(): Promise<any> {
		try {
			if (this.dashboard) {
				return this.dashboard.getSecurityStatus();
			}
			return undefined;
		} catch (error) {
			throw Error(error.message);
		}
	}

	public getMemoryDiskUsage(): Promise<any> {
		try {
			if (this.sysinfo) {
				return this.sysinfo.getMemAndDiskUsage().then((data) => {
					const result = { memory: null, disk: null };
					if (data) {
						result.memory = { total: data.memory.total, used: data.memory.used };
						result.disk = { total: data.disk.total, used: data.disk.used };
						return result;
					}
				});
			}
			return undefined;
		} catch (error) {
			throw Error(error.message);
		}
	}

	public getRecentUpdateInfo(): Observable<any> {
		try {
			if (this.sysupdate) {
				return new Observable((observer) => {
					// from local storage
					const cacheSu = this.localCacheService.getLocalCacheValue(LocalStorageKey.LastSystemUpdateStatus);
					if (cacheSu) {
						observer.next(cacheSu);
					}
					// from su plugin
					const result = { lastupdate: null, status: 0 };
					this.sysupdate.getMostRecentUpdateInfo().then(
						(data) => {
							if (data && data.lastScanTime) {
								result.lastupdate = data.lastScanTime;
								result.status = 1;
							} else {
								result.lastupdate = null;
								result.status = 0;
							}
							// save to localstorage
							this.localCacheService.setLocalCacheValue(LocalStorageKey.LastSystemUpdateStatus, result);
							observer.next(result);
							observer.complete();
						},
						(e) => {
							observer.next(result);
							this.localCacheService.setLocalCacheValue(LocalStorageKey.LastSystemUpdateStatus, result);
							observer.complete();
						}
					);
				});
			}
			return undefined;
		} catch (error) {
			throw Error(error.message);
		}
	}

	setDefaultCMSContent() {
		if (!this.translateString) {
			return;
		}
		this.offlineCardContent.positionA = [
			{
				albumId: 1,
				id: 1,
				source: 'Vantage',
				title: this.translateString['dashboard.offlineInfo.welcomeToVantage'],
				url: 'assets/cms-cache/offline/Default-SMB-Welcome.jpg',
				ActionLink: null,
				DataSource: ContentSource.Local,
				isLocal: true
			}
		];
		this.offlineCardContent.positionB = {
			Title: this.translateString['common.menu.support'],
			ShortTitle: '',
			Description: '',
			FeatureImage: 'assets/cms-cache/offline/Default-SMB-Support.jpg',
			Action: '',
			ActionType: ContentActionType.Internal,
			ActionLink: 'lenovo-vantage3:support',
			BrandName: '',
			BrandImage: '',
			Priority: 'P1',
			Page: 'dashboard',
			Template: 'half-width-title-description-link-image',
			Position: 'position-B',
			ExpirationDate: null,
			Filters: null,
			DataSource: ContentSource.Local,
			isLocal: true
		};

		this.offlineCardContent.positionC = {
			Title: this.translateString['common.menu.device.sub2'],
			ShortTitle: '',
			Description: '',
			FeatureImage: 'assets/cms-cache/offline/Default-SMB-Device-Settings.jpg',
			Action: '',
			ActionType: ContentActionType.Internal,
			ActionLink: 'lenovo-vantage3:device-settings',
			BrandName: '',
			BrandImage: '',
			Priority: 'P1',
			Page: 'dashboard',
			Template: 'half-width-title-description-link-image',
			Position: 'position-C',
			ExpirationDate: null,
			Filters: null,
			DataSource: ContentSource.Local,
			isLocal: true
		};

		this.offlineCardContent.positionD = {
			Title: this.translateString['dashboard.offlineInfo.systemHealth'],
			ShortTitle: '',
			Description: '',
			FeatureImage: 'assets/cms-cache/offline/Default-SMB-My-Device.jpg',
			Action: '',
			ActionType: ContentActionType.Internal,
			ActionLink: 'lenovo-vantage3:device',
			BrandName: '',
			BrandImage: '',
			Priority: 'P1',
			Page: 'dashboard',
			Template: 'full-width-title-image-background',
			Position: 'position-D',
			ExpirationDate: null,
			Filters: null,
			DataSource: ContentSource.Local,
			isLocal: true
		};

		this.offlineCardContent.positionE = {
			Title: this.translateString['settings.preferenceSettings'],
			ShortTitle: '',
			Description: '',
			FeatureImage: 'assets/cms-cache/offline/Default-Preference-Settings.jpg',
			Action: this.translateString['systemUpdates.readMore'],
			ActionType: ContentActionType.Internal,
			ActionLink: 'lenovo-vantage3:preference',
			BrandName: '',
			BrandImage: '',
			Priority: 'P1',
			Page: 'dashboard',
			Template: 'half-width-top-image-title-link',
			Position: 'position-E',
			ExpirationDate: null,
			Filters: null,
			DataSource: ContentSource.Local,
			isLocal: true
		};

		this.offlineCardContent.positionF = {
			Title: this.translateString['systemUpdates.title'],
			ShortTitle: '',
			Description: '',
			FeatureImage: 'assets/cms-cache/offline/Default-SMB-System-Update.jpg',
			Action: this.translateString['systemUpdates.readMore'],
			ActionType: ContentActionType.Internal,
			ActionLink: 'lenovo-vantage3:system-updates',
			BrandName: '',
			BrandImage: '',
			Priority: 'P1',
			Page: 'dashboard',
			Template: 'half-width-top-image-title-link',
			Position: 'position-F',
			ExpirationDate: null,
			Filters: null,
			DataSource: ContentSource.Local,
			isLocal: true
		};

	}
	// checking self select status for HW Settings
	public getSelfSelectStatus(): Promise<boolean> {
		let response = false;
		return this.localInfoService.getLocalInfo().then(result => {
			const segmentVal = result.Segment.toLowerCase();
			if (segmentVal === SegmentConst.Commercial.toLowerCase() ||
				segmentVal === SegmentConst.SMB.toLowerCase() ||
				segmentVal === SegmentConst.Consumer.toLowerCase()) {
				response = true;
			} else {
				response = false;
			}
			return response;
		});
	}


	public getPositionBData(): Observable<any> {
		return new Observable((subscriber) => {
			subscriber.next(this.positionBLoadingData);
			this.positionBResponseReceived = false;
			if (this.positionBLoadingTimer) {
				clearTimeout(this.positionBLoadingTimer);
				this.positionBLoadingTimer = undefined;
			}
			// if over 10s, show good condition at first
			this.positionBLoadingTimer = setTimeout(() => {
				if (!this.positionBResponseReceived) {
					subscriber.next(this.goodConditionData);
				}
			}, 10000);

			if (this.isFirstRunVantage()) {
				subscriber.next(this.goodConditionData);
				subscriber.complete();
			} else {
				Promise.all([this.getLastSUInstallDate(), this.getLastHardwareScanDate(),
				this.getSPSubscriptionData(), this.getOOBEDate()]).then((values: any) => {
					const [suDate, hwsDate, spsData, oobeDate] = values;
					this.positionBResponseReceived = true;
					const nowDate = new Date();
					clearTimeout(this.positionBLoadingTimer);

					let suDateSpan;
					let hwsDateSpan;
					let oobeDateSpan;
					if (suDate) {
						suDateSpan = this.commonService.getDaysBetweenDates(nowDate, new Date(suDate));
					}
					if (hwsDate) {
						hwsDateSpan = this.commonService.getDaysBetweenDates(nowDate, new Date(hwsDate));
					}
					if (oobeDate) {
						oobeDateSpan = this.commonService.getDaysBetweenDates(nowDate, new Date(oobeDate));
					}

					if (oobeDateSpan && oobeDateSpan <= SystemHealthDates.OOBE) {
						subscriber.next(this.goodConditionData);
					}
					else {
						if (suDateSpan && suDateSpan > SystemHealthDates.SystemUpdate) {
							subscriber.next(this.needMaintainSU);
						}
						else {
							if (!spsData) {
								subscriber.next(this.needMaintainSP);
							}
							else {
								if (hwsDateSpan && hwsDateSpan > SystemHealthDates.HardwareScan) {
									subscriber.next(this.needMaintainHWS);
								}
								else {
									subscriber.next(this.goodConditionData);
								}
							}
						}
					}
					subscriber.complete();
				});
			}
		});
	}

	async getLastSUInstallDate(): Promise<any> {
		return await this.systemUpdateService.getLastScanDate();
	}

	async getLastHardwareScanDate(): Promise<any> {
		return await this.previousResultService.getLastHardwareScanDate();
	}

	async getSPSubscriptionData(): Promise<any> {
		return await this.spService.getSPSubscriptionData();
	}

	async getOOBEDate(): Promise<any> {
		const machineInfo = await this.deviceService.getMachineInfo();
		return machineInfo.firstRunDate;
	}

	private isFirstRunVantage(): boolean {
		return this.metricService.isFirstLaunch;
	}

	public async isPositionBShowDeviceState() {
		const isSystemUpdateEnabled = !this.deviceService.isArm && this.adPolicyService.IsSystemUpdateEnabled;
		const isHardwareScanEnabled = !this.deviceService.isArm && await this.hardwareScanService.isAvailable();
		const isSmartPerformanceEnabled = this.configService.isSmartPerformanceAvailable;

		return !this.deviceService.isSMode && (isSystemUpdateEnabled || isHardwareScanEnabled || isSmartPerformanceEnabled);
	}

}
