import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DeviceService } from '../device/device.service';
import { EnumSmartPerformance, ScanningState, SPPriceCode, SubscriptionState } from 'src/app/enums/smart-performance.enum';
import { LocalInfoService } from '../local-info/local-info.service';
import { LocalCacheService } from '../local-cache/local-cache.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LoggerService } from '../logger/logger.service';
import {
	SPLocalPriceData,
	SPYearPrice,
} from 'src/app/components/pages/page-smart-performance/interface/smart-performance.interface';
import currencyFormater from 'currency-formatter';

declare let Windows: any;

@Injectable({
	providedIn: 'root',
})
export class SmartPerformanceService {
	shellSmartPerformance: any;
	modalStatus = { initiatedTime: '', isGettingStatus: false };
	isShellAvailable = false;
	scanningStopped = new Subject<boolean>();

	scanningState = ScanningState.NotStart;

	subscriptionState = SubscriptionState.Inactive;
	scheduleScanObj = null;
	nextScheduleScan: any;
	enableNextText: boolean;
	isEnterSmartPerformance = false;
	subItems: any = {};

	isShowPrice = false;
	localPriceData: SPLocalPriceData;
	isLocalPriceOnlineChecked = false;

	constructor(
		shellService: VantageShellService,
		private deviceService: DeviceService,
		private httpClient: HttpClient,
		private localInfoService: LocalInfoService,
		private localCacheService: LocalCacheService,
		private logger: LoggerService
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

	getPaymentDetails(): Promise<any> {
		return new Promise((resolve) => {
			this.deviceService.getMachineInfo().then(async (machineInfo) => {
				const sn = machineInfo?.serialnumber;
				const mtm = machineInfo?.mtm;

				const reqUrl = `${environment.pcSupportApiRoot}/api/v4/upsell/smart/getorders?serialNumber=${sn}&mtm=${mtm}`;

				const uri = new Windows.Foundation.Uri(reqUrl);
				const request = new Windows.Web.Http.HttpRequestMessage(Windows.Web.Http.HttpMethod.get, uri);
				const httpClient = new Windows.Web.Http.HttpClient();
				try {
					const response = await httpClient.sendRequestAsync(request);
					const result = await response.content.readAsStringAsync();
					if (result) {
						const resultJson = JSON.parse(result);
						if (resultJson.code === 0 && resultJson.msg?.desc?.toLowerCase() === 'success') {
							this.logger.info('Fetch smartPerformance payment detail result: ', resultJson);

							const smartTest = sessionStorage.getItem('smartTest');
							if (smartTest) {
								resolve(JSON.parse(smartTest));
							} else {
								resolve(resultJson);
							}
						} else {
							resolve(undefined);
							this.logger.info('Fetch smartPerformance payment detail failed response: ', resultJson);
						}
					} else {
						resolve(undefined);
						this.logger.info('Fetch smartPerformance payment detail no result: ', response);
					}
				} catch (e) {
					resolve(undefined);
					this.logger.info('Fetch smartPerformance payment detail catch error: ', e);
				}
				httpClient.close();
			});
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
		if (!this.isLocalPriceOnlineChecked && this.isShellAvailable) {
			const url = `${environment.pcSupportApiRoot}/api/v4/upsell/smart/getPrice?country=${localInfo.GEO}`;
			const priceData = (await this.httpClient.get(url).toPromise()) as any;
			if (priceData && priceData.data) {
				const yearlyPrices = priceData.data.filter(
					(item) => item.code === SPPriceCode.YEAR
				);
				const yearlyPriceData: SPYearPrice = yearlyPrices[0];
				this.setLocalPriceData(yearlyPriceData, localInfo.GEO);
				this.isLocalPriceOnlineChecked = true;
			}
		}
	}

	setLocalPriceData(yearlyPriceData: SPYearPrice, GEO: string) {
		if (yearlyPriceData && yearlyPriceData.price !== 0) {
			const symbol = yearlyPriceData.symbol;
			const isoCode = yearlyPriceData.isoCode;
			let mpVal;
			let monthlyPrice;
			let yearlyPrice = yearlyPriceData.formatPrice;

			if (GEO === 'tw') {
				mpVal = Math.ceil(yearlyPriceData.price / 12);
				monthlyPrice = symbol + mpVal;
			} else if (GEO === 'cl') {
				mpVal = Math.ceil(yearlyPriceData.price / 12);
				monthlyPrice = new Intl.NumberFormat('es-CL', {
					style: 'currency',
					currency: 'CLP',
				}).format(mpVal);
			} else {
				mpVal = Math.ceil((yearlyPriceData.price * 100) / 12) / 100;
				monthlyPrice = currencyFormater.format(mpVal, { code: isoCode });
				yearlyPrice = currencyFormater.format(yearlyPriceData.price, { code: isoCode });
			}

			this.localPriceData = { geo: GEO, yearlyPrice, monthlyPrice };
			this.isShowPrice = true;
			let localPrices: SPLocalPriceData[] = [];
			const localPricesCache = this.localCacheService.getLocalCacheValue(
				LocalStorageKey.SmartPerformanceLocalPrices,
				undefined
			);
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
		let subscriptionData;
		const subscriptionDetails = await this.getPaymentDetails();
		this.logger.info(
			'smart-performance.service.getSubscriptionDataDetail',
			subscriptionDetails
		);
		if (subscriptionDetails && subscriptionDetails.data && subscriptionDetails.data.length > 0) {
			subscriptionData = subscriptionDetails.data[subscriptionDetails.data.length - 1];
			if (subscriptionData && subscriptionData.status.toUpperCase() === 'COMPLETED') {
				this.getExpiredStatus(subscriptionData, onSubscribed);
			}
		} else {
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.SmartPerformanceSubscriptionState,
				SubscriptionState.Inactive
			);
			this.subscriptionState = SubscriptionState.Inactive;
			if (onSubscribed) {
				onSubscribed(this.subscriptionState);
			}
		}
		if (this.subscriptionState === SubscriptionState.Active) {
			this.unregisterScanSchedule(EnumSmartPerformance.SCHEDULESCAN);
		} else {
			this.unregisterScanSchedule(EnumSmartPerformance.SCHEDULESCANANDFIX);
		}
		return subscriptionData;
	}

	getExpiredStatus(lastItem, onSubscribed) {
		const currentDate = new Date(lastItem.currentTime);
		const expiredDate = new Date(lastItem.expiredTime);
		if (expiredDate < currentDate) {
			this.subscriptionState = SubscriptionState.Expired;
		} else {
			this.subscriptionState = SubscriptionState.Active;
		}

		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.SmartPerformanceSubscriptionState,
			this.subscriptionState
		);

		if (onSubscribed) {
			onSubscribed(this.subscriptionState);
		}
	}
}
