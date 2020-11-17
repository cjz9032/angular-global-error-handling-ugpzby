import { Injectable } from '@angular/core';

import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { Observable } from 'rxjs/internal/Observable';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { SegmentConst, SelfSelectService, SegmentConstHelper } from '../self-select/self-select.service';
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
import { DeviceCondition, DeviceStatus } from 'src/app/data-models/widgets/status.model';
import { DashboardStateCardData } from 'src/app/components/pages/page-dashboard/material-state-card-container/material-state-card-container.component';


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

	positionBLoadingData: DashboardStateCardData = {
		title: 'dashboard.positionB.cardTitle',
		summary: 'dashboard.positionB.cardSummary.detecting',
		linkText: 'device.myDevice.title',
		linkPath: 'device',
		state: SystemState.Loading,
		metricsItem: 'loading',
		statusText: '',
		isActionLink: false
	};

	goodConditionData: DashboardStateCardData = {
		title: 'dashboard.positionB.cardTitle',
		summary: 'dashboard.positionB.cardSummary.goodCondition',
		linkText: 'device.myDevice.title',
		linkPath: 'device',
		state: SystemState.GoodCondition,
		metricsItem: 'good-condition',
		statusText: 'device.myDevice.goodCondition',
		isActionLink: false
	};

	needMaintainSU: DashboardStateCardData = {
		title: 'dashboard.positionB.cardTitle',
		summary: 'dashboard.positionB.cardSummary.maintenanceNeeded',
		linkText: 'common.ui.improveNow',
		linkPath: 'lenovo-vantage3:system-updates?action=start',
		state: SystemState.NeedMaintenance,
		metricsItem: 'need-maintenance-su',
		statusText: 'device.myDevice.needAction',
		isActionLink: true
	};

	needMaintainHWS: DashboardStateCardData = {
		title: 'dashboard.positionB.cardTitle',
		summary: 'dashboard.positionB.cardSummary.maintenanceNeeded',
		linkText: 'common.ui.improveNow',
		linkPath: 'lenovo-vantage3:hardware-scan?scan=quickscan',
		state: SystemState.NeedMaintenance,
		metricsItem: 'need-maintenance-hws',
		statusText: 'device.myDevice.needAction',
		isActionLink: true
	};

	needMaintainSP: DashboardStateCardData = {
		title: 'dashboard.positionB.cardTitle',
		summary: 'dashboard.positionB.cardSummary.maintenanceNeeded',
		linkText: 'common.ui.improveNow',
		linkPath: 'lenovo-vantage3:smart-performance?action=start',
		state: SystemState.NeedMaintenance,
		metricsItem: 'need-maintenance-sp',
		statusText: 'device.myDevice.needAction',
		isActionLink: true
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
		private spService: SmartPerformanceService,
		private selfselectService: SelfSelectService
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
			if (segmentVal && segmentVal !== SegmentConst.Gaming) {
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
			const locDevCondition = this.localCacheService.getLocalCacheValue(LocalStorageKey.DeviceCondition);
			const locDevStatus = this.getStateCardData(locDevCondition);
			if (locDevStatus) {
				subscriber.next(locDevStatus);
			} else {
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
			}

			this.getDeviceStatus().then((ds) => {
				this.positionBResponseReceived = true;
				clearTimeout(this.positionBLoadingTimer);
				const devCondition = this.getStateCardData(ds);
				if (devCondition) {
					this.localCacheService.setLocalCacheValue(LocalStorageKey.DeviceCondition, ds);
					subscriber.next(devCondition);
				}
				subscriber.complete();
			});
		});
	}

	private getStateCardData(devCondition) {
		if (devCondition) {
			switch (devCondition) {
				case DeviceCondition.Good:
					return this.goodConditionData;
				case DeviceCondition.NeedRunSU:
					return this.needMaintainSU;
				case DeviceCondition.NeedRunSMPScan:
					return this.needMaintainSP;
				case DeviceCondition.NeedRunHWScan:
					return this.needMaintainHWS;
			}
		}
		return undefined;
	}

	public async isPositionBShowDeviceState() {
		const isSystemUpdateEnabled = this.adPolicyService.IsSystemUpdateEnabled;
		const isHardwareScanEnabled = await this.hardwareScanService.isAvailable();
		const isSmartPerformanceEnabled = await this.configService.showSmartPerformance();

		return !this.deviceService.isSMode && !this.deviceService.isArm
			&& (isSystemUpdateEnabled || isHardwareScanEnabled || isSmartPerformanceEnabled);
	}

	public async getDeviceStatus() {
		const machineInfo = this.deviceService.getMachineInfoSync();
		const oobeDate = machineInfo?.firstRunDate || Date.now();
		const isOobeOver31days = this.systemUpdateService.dateDiffInDays(oobeDate) > SystemHealthDates.OOBE;
		if (this.metricService.isFirstLaunch || !isOobeOver31days) {
			return DeviceCondition.Good;
		}

		if (await this.isSUNeedPromote()) {
			return DeviceCondition.NeedRunSU;
		}

		if (await this.isSMPNeedPromote()) {
			return DeviceCondition.NeedRunSMPScan;
		}

		if (await this.isHWScanNeedPromote()) {
			return DeviceCondition.NeedRunHWScan;
		}

		return DeviceCondition.Good;
	}

	public async isSUNeedPromote(): Promise<boolean> {
		if (!this.configService.isSystemUpdateEnabled()) {
			return false;
		}

		const suinfo = await this.systemUpdateService.getMostRecentUpdateInfo();
		if (!suinfo?.lastScanTime) {
			return true;
		}
		const days = this.systemUpdateService.dateDiffInDays(suinfo.lastScanTime);
		if (days > SystemHealthDates.SystemUpdate) {
			return true;
		}
		return false;
	}

	public async isSMPNeedPromote(): Promise<boolean> {
		if (!await this.configService.showSmartPerformance() || !this.commonService.isOnline) {
			return false;
		}
		return !(await this.isSmartPerformanceSuscripted());
	}

	public async isSmartPerformanceSuscripted(): Promise<boolean> {		
		await this.spService.getSubscriptionDataDetail(null);
		return this.spService.isSubscribed;		
	}

	public async isHWScanNeedPromote(): Promise<boolean> {
		if (!await this.hardwareScanService.isAvailable()) {
			return false;
		}
		await this.previousResultService.getLastResults();
		const lastSacnInfo = this.previousResultService.getLastPreviousResultCompletionInfo();
		if (lastSacnInfo.date && this.systemUpdateService.dateDiffInDays(lastSacnInfo.date) > SystemHealthDates.HardwareScan) {
			return true;
		}

		if (!lastSacnInfo.date) {
			const oobeDate = this.deviceService.getMachineInfoSync()?.firstRunDate || Date.now();
			if (this.systemUpdateService.dateDiffInDays(oobeDate) > SystemHealthDates.HardwareScan) {
				return true;
			}
		}

		return false;
	}

	public async isPositionCShowSecurityCard(): Promise<boolean> {
		const result = await this.selfselectService.getSegment();
		const activeSegment: SegmentConst = result;
		return !this.deviceService.isSMode && !this.deviceService.isArm && (SegmentConstHelper.includedInCommonConsumer(activeSegment) || activeSegment === SegmentConst.SMB);
	}
}
