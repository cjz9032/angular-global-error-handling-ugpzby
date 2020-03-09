import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { CommonService } from '../common/common.service';
import { DeviceService } from '../device/device.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { Observable } from 'rxjs';
import { WarrantyStatus } from 'src/app/enums/warranty.enum';

@Injectable({
	providedIn: 'root'
})
export class WarrantyService {

	private warranty: any;
	private sysinfo: any;
	private sn: any;

	constructor(
		private shellService: VantageShellService,
		private commonService: CommonService,
		private deviceService: DeviceService,
	) {
		this.sysinfo = shellService.getSysinfo();
		this.warranty = shellService.getWarranty();
	}

	public getWarranty(serialnumber: string): Promise<any> {
		if (this.warranty) {
			return this.warranty.getWarrantyInformation(serialnumber);
		}
	}

	getWarrantyInfo(): Observable<any> {
		try {
			if (this.sysinfo && this.warranty) {
				return new Observable((observer) => {
					// from local storage
					const cacheWarranty = this.commonService.getLocalStorageValue(LocalStorageKey.LastWarrantyStatus);
					if (cacheWarranty && cacheWarranty.version > 0) {
						cacheWarranty.dayDiff = this.getDayDiff(cacheWarranty.startDate, cacheWarranty.endDate);
						observer.next(cacheWarranty);
					}
					// first launch will not have data, below code will break
					const warrantyResult = {
						endDate: null,
						status: WarrantyStatus.WarrantyNotFound,
						startDate: null,
						dayDiff: 0,
						version: 0,
					};
					this.deviceService.getMachineInfo().then((machineInfo) => {
						if (machineInfo && machineInfo.serialnumber) { this.sn = machineInfo.serialnumber; }
						// machineInfo.serialnumber = 'MP1FCJBF';
						// 'PC0G9X77' 'R9T6M3E' 'R90HTPEU' 'MP1FCJBF' machineInfo.serialnumber
						this.warranty.getWarrantyInformation(machineInfo.serialnumber).then(
							(result) => {
								if (result) {
									warrantyResult.endDate = new Date(result.endDate);
									warrantyResult.status = result.status;
									warrantyResult.startDate = new Date(result.startDate);
									warrantyResult.version = 1;
								}
								if (!(cacheWarranty && cacheWarranty.status !== WarrantyStatus.WarrantyNotFound && warrantyResult.status === WarrantyStatus.WarrantyNotFound)) {
									warrantyResult.dayDiff = this.getDayDiff(warrantyResult.startDate, warrantyResult.endDate);
									this.commonService.setLocalStorageValue(LocalStorageKey.LastWarrantyStatus, warrantyResult);
									observer.next(warrantyResult);
								}
								observer.complete();
							},
							() => {
								if (!cacheWarranty) {
									observer.next(warrantyResult);
								}
								observer.complete();
							}
						);
					});
				});
			}
			return new Observable((observer) => {
				observer.next(undefined);
				observer.complete();
			});
		} catch (error) {
			throw Error(error.message);
		}
	}

	getWarrantyUrl(): string {
		if (this.sn) {
			return `https://pcsupport.lenovo.com/warrantylookup?sn=${this.sn}&upgrade&cid=ww:apps:pikjhe&utm_source=Companion&utm_medium=Native&utm_campaign=Warranty`;
		}
		return `https://pcsupport.lenovo.com/warrantylookup`;
	}

	getRoundYear(dayDiff: number) {
		return dayDiff > 0 ? Math.round(dayDiff / 365) : 0;
	}

	getDayDiff(startdate, enddate) {
		let dayDiff = 0;
		if (startdate && enddate) {
			const timediff = enddate - startdate;
			dayDiff = Math.floor(timediff / (24 * 3600 * 1000));
		}
		return dayDiff;
	}

}
