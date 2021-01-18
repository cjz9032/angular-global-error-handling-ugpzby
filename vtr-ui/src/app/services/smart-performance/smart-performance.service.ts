import { Injectable } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DeviceService } from '../device/device.service';
import { ScanningState, SPPriceCode } from 'src/app/enums/smart-performance.enum';
import { LocalInfoService } from '../local-info/local-info.service';
import { LocalCacheService } from '../local-cache/local-cache.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LoggerService } from '../logger/logger.service';
import { SPLocalPriceData, SPYearPrice } from 'src/app/components/pages/page-smart-performance/interface/smart-performance.interface';

@Injectable({
	providedIn: 'root',
})
export class SmartPerformanceService {
	shellSmartPerformance: any;
	modalStatus = { initiatedTime: '', isGettingStatus: false };
	isShellAvailable = false;
	scanningStopped = new Subject<boolean>();

	scanningState = ScanningState.NotStart;

	isSubscribed = false;
	isExpired = false;
	scheduleScanObj = null;
	nextScheduleScan: any;
	enableNextText: boolean;
	isEnterSmartPerformance = false;
	subItems: any = {};

	isShowPrice = false;
	localPriceData: SPLocalPriceData;
	isLocalPriceOnlineChecked = false;

	ZeroDecimalPlaceCurrencyGEO = ['jp', 'kr', 'tw'];

	constructor(
		shellService: VantageShellService,
		private deviceService: DeviceService,
		private httpClient: HttpClient,
		private localInfoService: LocalInfoService,
		private localCacheService: LocalCacheService,
		private logger: LoggerService,
		private currencyPipe: CurrencyPipe
	) {
		this.shellSmartPerformance = shellService.getSmartPerformance();
		if (this.shellSmartPerformance) {
			this.isShellAvailable = true;
		}
		this.getLocalYearPrice();
	}

	getReadiness(): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.shellSmartPerformance.getScanReadyStatus();
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
				return this.shellSmartPerformance.startScan(payload);
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
				return this.shellSmartPerformance.launchScanAndFix(payload);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	cancelScan(): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.shellSmartPerformance.cancelScan();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getScanSettings(profile: string): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.shellSmartPerformance.GetScanSettings(profile);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getScanSummary(profile: string): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.shellSmartPerformance.GetScanSummary(profile);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getHistory(payload: any): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.shellSmartPerformance.getHistory(payload);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setScanSchedule(payload: any): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.shellSmartPerformance.scheduleScan(payload);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	async unregisterScanSchedule(scantype) {
		let res;
		try {
			const payload = { scantype };
			this.logger.info('app.component.unregisterScheduleScan', payload);
			if (this.isShellAvailable) {
				res = await this.shellSmartPerformance.unregisterScheduleScan(payload);
			}
			this.logger.info('app.component.unregisterScheduleScan.then', res);
		} catch (error) {
			this.logger.error('app.component.unregisterScheduleScan.then', error);
		}
		return res;
	}

	getNextScanRunTime(payload: any): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.shellSmartPerformance.getNextScanRunTime(payload);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getScheduleScanStatus(): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.shellSmartPerformance.getScheduledScanStatus();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getLastScanResult(payload: any): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.shellSmartPerformance.getLastScanResult(payload);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getPaymentDetails(serialNumber): Promise<any> {
		const reqUrl = `${environment.pcsupportApiRoot}/api/v4/upsell/smart/getorders?serialNumber=${serialNumber}`;
		return new Promise((resolve) => {
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
				return this.shellSmartPerformance.writeSmartPerformanceActivity(payload);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	async getLocalYearPrice() {
		const localInfo = await this.localInfoService.getLocalInfo();
		const localPricesCache = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.SmartPerformanceLocalPrices,
			undefined
		);
		if (localPricesCache && localPricesCache.length > 0) {
			const geoInCache = localPricesCache.find((lp) => lp.geo === localInfo.GEO);
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
			const priceData = (await this.httpClient.get(url).toPromise()) as any;
			if (priceData && priceData.data) {
				const yearlyPrices = priceData.data.filter(item => item.code === SPPriceCode.YEAR);
				const yearlyPriceData: SPYearPrice = yearlyPrices[0];
				this.setLocalPriceData(yearlyPriceData, localInfo.GEO);
				this.isLocalPriceOnlineChecked = true;
			}
		}
	}

	setLocalPriceData(yearlyPriceData: SPYearPrice, GEO: string) {
		if (yearlyPriceData && yearlyPriceData.price !== 0) {
			const yearlyPrice = yearlyPriceData.formatPrice;
			const symbol = yearlyPriceData.symbol;
			const isPreSymbol = yearlyPrice.indexOf(symbol) === 0;
			let monthlyPrice;
			if (this.ZeroDecimalPlaceCurrencyGEO.includes(GEO)) {
				const price = Math.ceil(yearlyPriceData.price / 12);
				if (GEO === 'tw') {
					monthlyPrice = isPreSymbol ? (symbol + price) : (price + symbol);
				} else {
					monthlyPrice = this.currencyPipe.transform(price, yearlyPriceData.isoCode);
				}
			}
			else {
				const mp = Math.ceil((yearlyPriceData.price * 100) / 12) / 100;
				monthlyPrice = isPreSymbol ? (symbol + mp) : (mp + symbol);
			}

			this.localPriceData = { geo: GEO, yearlyPrice, monthlyPrice };
			this.isShowPrice = true;
			let localPrices: SPLocalPriceData[] = [];
			const localPricesCache = this.localCacheService.getLocalCacheValue(LocalStorageKey.SmartPerformanceLocalPrices, undefined);
			if (localPricesCache && localPricesCache.length > 0) {
				localPrices = localPricesCache;
				const geoInCacheIndex = localPrices.findIndex((lp) => lp.geo === GEO);
				if (geoInCacheIndex > -1) {
					localPrices.splice(geoInCacheIndex, 1);
				}
			}
			localPrices.push(this.localPriceData);
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.SmartPerformanceLocalPrices,
				localPrices
			);
		}
	}

	async getSubscriptionDataDetail(onSubscribed) {
		let subscriptionData = [];
		const machineInfo = await this.deviceService.getMachineInfo();
		const subscriptionDetails = await this.getPaymentDetails(machineInfo.serialnumber);
		this.logger.info(
			'smart-performance.service.getSubscriptionDataDetail',
			subscriptionDetails
		);
		if (subscriptionDetails && subscriptionDetails.data && subscriptionDetails.data.length > 0) {
			subscriptionData = subscriptionDetails.data;
			const lastItem = subscriptionData[subscriptionData.length - 1];
			const releaseDate = new Date(lastItem.releaseDate);
			releaseDate.setMonth(releaseDate.getMonth() + +lastItem.products[0].unitTerm);
			releaseDate.setDate(releaseDate.getDate() - 1);
			if (lastItem && lastItem.status.toUpperCase() === 'COMPLETED') {
				this.getExpiredStatus(releaseDate, lastItem, onSubscribed);
			}
		} else {
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.IsFreeFullFeatureEnabled,
				false
			);
			this.isSubscribed = false;
		}
	}

	getExpiredStatus(releaseDate, lastItem, onSubscribed) {
		const currentDate: any = new Date(lastItem.currentTime);
		const expiredDate = new Date(releaseDate);
		if (expiredDate < currentDate) {
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.IsFreeFullFeatureEnabled,
				false
			);
			this.isSubscribed = false;
		} else {
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.IsFreeFullFeatureEnabled,
				true
			);
			this.isSubscribed = true;
		}

		if (onSubscribed) {
			onSubscribed(this.isSubscribed);
		}
	}
}
