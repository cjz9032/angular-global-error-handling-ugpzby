import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DeviceService } from '../device/device.service';
import { SPPriceCode } from 'src/app/enums/smart-performance.enum';
import { LocalInfoService } from '../local-info/local-info.service';
import { LocalCacheService } from '../local-cache/local-cache.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

interface IYearlyPrice {
	code: string;
	price: number;
	formatPrice: string;
	symbol: string;
	isoCode: string;
}

interface ILocalPriceData {
	geo: string;
	yearlyPrice: string;
	monthlyPrice: string;
}

@Injectable({
	providedIn: 'root'
})
export class SmartPerformanceService {
	getSmartPerformance: any;
	modalStatus = { initiatedTime: '', isGettingStatus: false };
	public isShellAvailable = false;
	scanningStopped = new Subject<boolean>();

	isScanning = false;
	isScanningCompleted = false;
	isSubscribed = false;
	isExpired = false;
	scheduleScanObj = null;
	nextScheduleScan: any;
	enableNextText: boolean;
	isEnterSmartPerformance = false;
	subItems: any = {};

	isShowPrice = false;
	localPriceData: ILocalPriceData;
	isLocalPriceOnlineChecked = false;

	constructor(
		shellService: VantageShellService,
		private deviceService: DeviceService,
		private httpClient: HttpClient,
		private localInfoService: LocalInfoService,
		private localCacheService: LocalCacheService,
	) {

		this.getSmartPerformance = shellService.getSmartPerformance();
		if (this.getSmartPerformance) {
			this.isShellAvailable = true;
		}
		this.getLocalYearPrice();

	}

	getReadiness(): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.getSmartPerformance.getScanReadyStatus();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	startScan(): Promise<any> {
		try {
			const payload = { type: 'MS' };

			if (this.isShellAvailable) {
				return this.getSmartPerformance.startScan(payload);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	launchScanAndFix(): Promise<any> {
		try {
			const payload = { type: 'MS' };
			if (this.isShellAvailable) {
				return this.getSmartPerformance.launchScanAndFix(payload);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	cancelScan(): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.getSmartPerformance.cancelScan();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getSubscriptionDetails(profile: string): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.getSmartPerformance.GetSubscriptionDetails(profile);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getScanSettings(profile: string): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.getSmartPerformance.GetScanSettings(profile);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getScanSummary(profile: string): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.getSmartPerformance.GetScanSummary(profile);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getHistory(payload: any): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.getSmartPerformance.getHistory(payload);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	setScanSchedule(payload: any): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.getSmartPerformance.scheduleScan(payload);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	unregisterScanSchedule(payload: any): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.getSmartPerformance.unregisterScheduleScan(payload);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	getNextScanRunTime(payload: any): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.getSmartPerformance.getNextScanRunTime(payload);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	getScheduleScanStatus(): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.getSmartPerformance.getScheduledScanStatus();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getLastScanResult(payload: any): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.getSmartPerformance.getLastScanResult(payload);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getPaymentDetails(serialNumber): Promise<any> {
		const reqUrl = `${environment.pcsupportApiRoot}/api/v4/upsell/smart/getorders?serialNumber=${serialNumber}`;
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();
			xhr.open('GET', reqUrl, true);
			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4 && xhr.status === 200) {
					resolve(JSON.parse(xhr.responseText));
				}
				// else {
				// 	resolve(undefined);
				// }
			};
			xhr.send();
		});
	}


	writeSmartPerformanceActivity(payload: any): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.getSmartPerformance.writeSmartPerformanceActivity(payload);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	async getSPSubscriptionData(): Promise<any> {
		const machineInfo = await this.deviceService.getMachineInfo();
		let subscriptionData;
		const subscriptionDetails = await this.getPaymentDetails(machineInfo.serialnumber);

		if (subscriptionDetails && subscriptionDetails.data) {
			subscriptionData = subscriptionDetails.data;
		}
		return subscriptionData;
	}


	async getLocalYearPrice() {
		const localInfo = await this.localInfoService.getLocalInfo();
		const localPricesCache = this.localCacheService.getLocalCacheValue(LocalStorageKey.SmartPerformanceLocalPrices, undefined);
		if (localPricesCache && localPricesCache.length > 0) {
			const geoInCache = localPricesCache.find(lp => lp.geo === localInfo.GEO);
			if (geoInCache) {
				this.localPriceData = {
					geo: localInfo.GEO,
					yearlyPrice: geoInCache.yearlyPrice,
					monthlyPrice: geoInCache.monthlyPrice,
				};
				this.isShowPrice = true;
			}
		}
		if (!this.isLocalPriceOnlineChecked) {
			const url = `${environment.pcsupportApiRoot}/api/v4/upsell/smart/getPrice?country=${localInfo.GEO}`;
			const priceData = await this.httpClient.get(url).toPromise() as any;
			if (priceData && priceData.data) {
				const yearlyPrices = priceData.data.filter(item => item.code === SPPriceCode.YEAR);
				const yearlyPriceData: IYearlyPrice = yearlyPrices[0];
				this.setLocalPriceData(yearlyPriceData, localInfo.GEO);
				this.isLocalPriceOnlineChecked = true;
			}
		}
	}

	setLocalPriceData(yearlyPriceData: IYearlyPrice, GEO: string) {
		if (yearlyPriceData && yearlyPriceData.price !== 0) {
			const mp = Math.ceil(yearlyPriceData.price * 100 / 12) / 100;
			const yearlyPrice = yearlyPriceData.formatPrice;
			const symbol = yearlyPriceData.symbol;
			const monthlyPrice = isNaN(parseFloat(yearlyPrice.substr(0, 1))) ? symbol + mp : mp + symbol;
			this.localPriceData = { geo: GEO, yearlyPrice, monthlyPrice };
			this.isShowPrice = true;
			let localPrices: ILocalPriceData[] = [];
			const localPricesCache = this.localCacheService.getLocalCacheValue(LocalStorageKey.SmartPerformanceLocalPrices, undefined);
			if (localPricesCache && localPricesCache.length > 0) {
				localPrices = localPricesCache;
				const geoInCacheIndex = localPrices.findIndex(lp => lp.geo === GEO);
				if (geoInCacheIndex > -1) {
					localPrices.splice(geoInCacheIndex, 1);
				}
			}
			localPrices.push(this.localPriceData);
			this.localCacheService.setLocalCacheValue(LocalStorageKey.SmartPerformanceLocalPrices, localPrices);
		}
	}

}
