// below line is needed for js intellisense
//// <reference path='../../../../node_modules/@lenovo/tan-client-bridge/src/features/dashboard-feature.js' />

import { Injectable } from '@angular/core';

import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { Observable, from } from 'rxjs';
import {CommonService} from 'src/app/services/common/common.service';
import {LocalStorageKey} from 'src/app/enums/local-storage-key.enum';
@Injectable({
	providedIn: 'root'
})
export class DashboardService {
	private dashboard: any;
	private sysinfo: any;
	private sysupdate: any;
	private warranty: any;
	public isShellAvailable = false;
	private commonService: CommonService;

	constructor(shellService: VantageShellService, commonService: CommonService) {
		this.dashboard = shellService.getDashboard();
		this.sysinfo = null;
		this.commonService = commonService;
		if (this.dashboard) {
			this.isShellAvailable = true;
			this.sysinfo = this.dashboard.sysinfo;
			this.sysupdate = this.dashboard.sysupdate;
			this.warranty = this.dashboard.warranty;
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
		if (this.dashboard) {
			return this.dashboard.getCameraStatus();
		}
		return undefined;
	}

	public setCameraStatus(value: boolean): Promise<boolean> {
		if (this.dashboard) {
			return this.dashboard.setCameraStatus(value);
		}
		return undefined;
	}

	public getEyeCareMode(): Promise<FeatureStatus> {
		if (this.dashboard) {
			return this.dashboard.getEyecareMode();
		}
		return undefined;
	}

	public setEyeCareMode(value: boolean): Promise<boolean> {
		if (this.dashboard) {
			return this.dashboard.setEyecareMode(value);
		}
		return undefined;
	}

	public getSystemInfo(): Promise<any> {
		if (this.dashboard) {
			return this.dashboard.getSystemInfo();
		}
		return undefined;
	}

	public getSecurityStatus(): Promise<any> {
		if (this.dashboard) {
			return this.dashboard.getSecurityStatus();
		}
		return undefined;
	}

	public getMemoryDiskUsage(): Promise<any> {
		if (this.sysinfo) {
			return this.sysinfo.getMemAndDiskUsage().then((data) => {
				const result = {memory: null, disk: null};
				if (data) {
					result.memory = {total: data.memory.total, used: data.memory.used};
					result.disk = {total: data.disk.total, used: data.disk.used};
					return result;
				}
			});
		}
		return undefined;
	}

	public getRecentUpdateInfo(): Observable<any> {

		if (this.sysupdate) {
			return new Observable(observer => {
				// from loccal storage
				const cacheSu = this.commonService.getLocalStorageValue(LocalStorageKey.LastSystemUpdateStatus);
				if(cacheSu) {
					observer.next(cacheSu);
				}
				// from su plugin
				const result = {lastupdate: null, status: 0};
				return this.sysupdate.getMostRecentUpdateInfo().then((data) => {
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
					}, (e) => {
						console.error('get last update info failed:' + JSON.stringify(e));
						observer.next(result);
						this.commonService.setLocalStorageValue(LocalStorageKey.LastSystemUpdateStatus, result);
						observer.complete();
					});
				}
			);
		}
		return undefined;
	}

	public getWarrantyInfo(): Promise<any> {
		if (this.sysinfo && this.warranty) {
			const result = { expired : null, status: 2 };
			return this.sysinfo.getMachineInfo().then(
				data => this.warranty.getWarrantyInformation(data.serialnumber).then((warrantyRep) => {
					if (warrantyRep && warrantyRep.status !== 2) {
					result.expired = warrantyRep.endDate;
					result.status = warrantyRep.status;
					}
					return Promise.resolve(result);
				}, () => Promise.resolve(result))
				);
		}
		return undefined;
	}

}
