import { Injectable } from '@angular/core';

import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { Observable } from 'rxjs/internal/Observable';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { DeviceService } from '../device/device.service';
import { TranslateService } from '@ngx-translate/core';
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
	private commonService: CommonService;
	public heroBannerItems = [];
	public cardContentPositionA: any = {};
	public cardContentPositionB: any = {};
	public cardContentPositionC: any = {};
	public cardContentPositionD: any = {};
	public cardContentPositionE: any = {};
	public heroBannerItemsOnline = [];
	public cardContentPositionF: any = {};
	public cardContentPositionBOnline: any;
	public cardContentPositionCOnline: any;
	public cardContentPositionDOnline: any;
	public cardContentPositionEOnline: any;
	public cardContentPositionFOnline: any;
	translateString: any;

	constructor(
		shellService: VantageShellService,
		commonService: CommonService,
		private deviceService: DeviceService,
		private translate: TranslateService,
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

		this.translate.stream([
			'dashboard.offlineInfo.welcomeToVantage',
			'common.menu.support',
			'settings.settings',
			'dashboard.offlineInfo.systemHealth',
			'common.securityAdvisor.wifi',
			'systemUpdates.title',
			'systemUpdates.readMore'
		]).subscribe((result) => {
			this.translateString = result;
			this.setDefaultCMSContent();
		});
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
					// from loccal storage
					const cacheSu = this.commonService.getLocalStorageValue(LocalStorageKey.LastSystemUpdateStatus);
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
							this.commonService.setLocalStorageValue(LocalStorageKey.LastSystemUpdateStatus, result);
							observer.next(result);
							observer.complete();
						},
						(e) => {
							observer.next(result);
							this.commonService.setLocalStorageValue(LocalStorageKey.LastSystemUpdateStatus, result);
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

	public getWarrantyInfo(): Observable<any> {
		try {
			if (this.sysinfo && this.warranty) {
				return new Observable((observer) => {
					// from local storage
					const cacheWarranty = this.commonService.getLocalStorageValue(LocalStorageKey.LastWarrantyStatus);
					if (cacheWarranty) {
						observer.next(cacheWarranty);
					}
					// first launch will not have data, below code will break
					const result = { endDate: null, status: 2, startDate: null };
					this.deviceService.getMachineInfo().then((data) =>
						this.warranty.getWarrantyInformation(data.serialnumber).then(
							(warrantyRep) => {
								if (warrantyRep && warrantyRep.status !== 2) {
									result.endDate = new Date(warrantyRep.endDate);
									result.status = warrantyRep.status;
									result.startDate = new Date(warrantyRep.startDate);
								}
								this.commonService.setLocalStorageValue(LocalStorageKey.LastWarrantyStatus, result);
								observer.next(result);
								observer.complete();
							},
							() => {
								this.commonService.setLocalStorageValue(LocalStorageKey.LastWarrantyStatus, result);
								observer.next(result);
								observer.complete();
							}
						)
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
		this.heroBannerItems = [
			{
				albumId: 1,
				id: 1,
				source: 'Vantage',
				title: this.translateString['dashboard.offlineInfo.welcomeToVantage'] ,
				url: '/assets/cms-cache/offline/Default-SMB-Welcome.jpg',
				ActionLink: null
			}
		];
		this.cardContentPositionB = {
			Title: this.translateString['common.menu.support'],
			ShortTitle: '',
			Description: '',
			FeatureImage: '/assets/cms-cache/offline/Default-SMB-Support.jpg',
			Action: '',
			ActionType: 'Internal',
			ActionLink: 'lenovo-vantage3:support',
			BrandName: '',
			BrandImage: '',
			Priority: 'P1',
			Page: 'dashboard',
			Template: 'half-width-title-description-link-image',
			Position: 'position-B',
			ExpirationDate: null,
			Filters: null,
			isLocal: true
		};

		this.cardContentPositionC = {
			Title: this.translateString['settings.settings'],
			ShortTitle: '',
			Description: '',
			FeatureImage: '/assets/cms-cache/offline/Default-SMB-Device-Settings.jpg',
			Action: '',
			ActionType: 'Internal',
			ActionLink: 'lenovo-vantage3:device-settings',
			BrandName: '',
			BrandImage: '',
			Priority: 'P1',
			Page: 'dashboard',
			Template: 'half-width-title-description-link-image',
			Position: 'position-C',
			ExpirationDate: null,
			Filters: null,
			isLocal: true
		};

		this.cardContentPositionD = {
			Title: this.translateString['dashboard.offlineInfo.systemHealth'],
			ShortTitle: '',
			Description: '',
			FeatureImage: '/assets/cms-cache/offline/Default-SMB-My-Device.jpg',
			Action: '',
			ActionType: 'Internal',
			ActionLink: 'lenovo-vantage3:device',
			BrandName: '',
			BrandImage: '',
			Priority: 'P1',
			Page: 'dashboard',
			Template: 'full-width-title-image-background',
			Position: 'position-D',
			ExpirationDate: null,
			Filters: null,
			isLocal: true
		};

		this.cardContentPositionE = {
			Title: this.translateString['common.securityAdvisor.wifi'],
			ShortTitle: '',
			Description: '',
			FeatureImage: '/assets/cms-cache/offline/Default-SMB-Security-Advisor.jpg',
			Action: this.translateString['systemUpdates.readMore'],
			ActionType: 'Internal',
			ActionLink: 'lenovo-vantage3:wifi-security',
			BrandName: '',
			BrandImage: '',
			Priority: 'P1',
			Page: 'dashboard',
			Template: 'half-width-top-image-title-link',
			Position: 'position-E',
			ExpirationDate: null,
			Filters: null,
			isLocal: true
		};

		this.cardContentPositionF = {
			Title: this.translateString['systemUpdates.title'],
			ShortTitle: '',
			Description: '',
			FeatureImage: '/assets/cms-cache/offline/Default-SMB-System-Update.jpg',
			Action: this.translateString['systemUpdates.readMore'],
			ActionType: 'Internal',
			ActionLink: 'lenovo-vantage3:system-updates',
			BrandName: '',
			BrandImage: '',
			Priority: 'P1',
			Page: 'dashboard',
			Template: 'half-width-top-image-title-link',
			Position: 'position-F',
			ExpirationDate: null,
			Filters: null,
			isLocal: true
		};

	}
}
