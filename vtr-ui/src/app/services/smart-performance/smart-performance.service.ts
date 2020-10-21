import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DeviceService } from '../device/device.service';
import { SPPriceCode } from 'src/app/enums/smart-performance.enum';
import { LocalInfoService } from '../local-info/local-info.service';

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

	subItems: any = {};

	localPrice: any;


	constructor(
		shellService: VantageShellService,
		private deviceService: DeviceService,
		private httpClient: HttpClient,
		private localInfoService: LocalInfoService,
	) {

		this.getSmartPerformance = shellService.getSmartPerformance();
		if (this.getSmartPerformance) {
			this.isShellAvailable = true;
		}
		this.getLocalePrice();

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


	async getLocalePrice() {
		if (!this.localPrice) {
			const localInfo = await this.localInfoService.getLocalInfo();
			const url = `${environment.pcsupportApiRoot}/api/v4/upsell/smart/getPrice?country=${localInfo.GEO}`;
			const priceData = await this.httpClient.get(url).toPromise() as any;
			if (priceData && priceData.data) {
				const yearPrice = priceData.data.filter(item => item.code === SPPriceCode.YEAR);
				this.localPrice = yearPrice[0];
			}
		}
		return this.localPrice;
	}

}
