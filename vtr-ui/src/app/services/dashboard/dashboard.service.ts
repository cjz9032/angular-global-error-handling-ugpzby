import { Injectable } from '@angular/core';

import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { Observable } from 'rxjs/internal/Observable';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
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
	public cardContentPositionF: any = {};

	constructor(
		shellService: VantageShellService,
		commonService: CommonService) {
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

		this.setDefaultCMSContent();
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
					this.sysinfo.getMachineInfo().then((data) =>
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

	private setDefaultCMSContent() {
		this.heroBannerItems = [
			{
				albumId: 1,
				id: 1,
				source: 'Vantage',
				title: 'Welcome to the next generation of Lenovo Vantage!',
				url: '/assets/cms-cache/Vantage3Hero-zone0.jpg',
				ActionLink: null
			}
		];

		this.cardContentPositionB = {
			Title: '',
			ShortTitle: '',
			Description: '',
			FeatureImage: '/assets/cms-cache/Alexa4x3-zone1.jpg',
			Action: '',
			ActionType: 'External',
			ActionLink: null,
			BrandName: '',
			BrandImage: '',
			Priority: 'P1',
			Page: 'dashboard',
			Template: 'half-width-title-description-link-image',
			Position: 'position-B',
			ExpirationDate: null,
			Filters: null
		};

		this.cardContentPositionC = {
			Title: '',
			ShortTitle: '',
			Description: '',
			FeatureImage: '/assets/cms-cache/Security4x3-zone2.jpg',
			Action: '',
			ActionType: 'External',
			ActionLink: null,
			BrandName: '',
			BrandImage: '',
			Priority: 'P1',
			Page: 'dashboard',
			Template: 'half-width-title-description-link-image',
			Position: 'position-C',
			ExpirationDate: null,
			Filters: null
		};

		this.cardContentPositionD = {
			Title: '',
			ShortTitle: '',
			Description: '',
			FeatureImage: '/assets/cms-cache/Gamestore8x3-zone3.jpg',
			Action: '',
			ActionType: 'External',
			ActionLink: null,
			BrandName: '',
			BrandImage: '',
			Priority: 'P1',
			Page: 'dashboard',
			Template: 'full-width-title-image-background',
			Position: 'position-D',
			ExpirationDate: null,
			Filters: null
		};

		this.cardContentPositionE = {
			Title: '',
			ShortTitle: '',
			Description: '',
			FeatureImage: '/assets/cms-cache/content-card-4x4-support.jpg',
			Action: '',
			ActionType: 'External',
			ActionLink: null,
			BrandName: '',
			BrandImage: '',
			Priority: 'P1',
			Page: 'dashboard',
			Template: 'half-width-top-image-title-link',
			Position: 'position-E',
			ExpirationDate: null,
			Filters: null
		};

		this.cardContentPositionF = {
			Title: '',
			ShortTitle: '',
			Description: '',
			FeatureImage: '/assets/cms-cache/content-card-4x4-award.jpg',
			Action: '',
			ActionType: 'External',
			ActionLink: null,
			BrandName: '',
			BrandImage: '',
			Priority: 'P1',
			Page: 'dashboard',
			Template: 'half-width-top-image-title-link',
			Position: 'position-F',
			ExpirationDate: null,
			Filters: null
		};
	}
}
