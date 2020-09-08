import { Injectable } from '@angular/core';
import { NgForage, Driver, DedicatedInstanceFactory } from 'ngforage';
import { CommonService } from '../common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { DashboardLocalStorageKey } from 'src/app/enums/dashboard-local-storage-key.enum';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';

@Injectable({
  providedIn: 'root'
})

export class LocalCacheService {
	private experienceName = 'VantageExperience';
	private store: NgForage;
	private transferEnabled = false;
	private transferredShellVersion = '10.2009.17';

	constructor(
		private readonly fact: DedicatedInstanceFactory,
		private shellService: VantageShellService,
		private commonService: CommonService
	) {
		this.createForage(this.experienceName, this.experienceName);
		this.transferEnabled = this.checkTransferEnabled();
	}

	/**
	 * Stores given value in IndexedDB
	 * Before switch to use IndexedDB, please make sure there is related feature story for PA to verify
	 * @param key key for storage. Must define it in LocalStorageKey or DashboardLocalStorageKey enum
	 * @param value value to store in local storage
	 */
	public setLocalCacheValue(key: LocalStorageKey | DashboardLocalStorageKey, value: any): Promise<void> {
		if (this.transferEnabled) {
			return this.setItem(key, value).then(() => {
				this.commonService.sendNotification(key, value);
			});
		} else {
			this.commonService.setLocalStorageValue(key, value);
			return Promise.resolve();
		}
	}

	/**
	 * Get value from IndexedDB
	 * Before switch to use IndexedDB, please make sure there is related feature story for PA to verify
	 * @param key key for storage. Must define it in LocalStorageKey or DashboardLocalStorageKey enum
	 * @param defaultValue default value for not key not found in IndexedDB storage
	 */
	public async getLocalCacheValue(key: LocalStorageKey | DashboardLocalStorageKey, defaultValue?: any) {
		if (this.transferEnabled) {
			const valueInLocalStorage = this.commonService.getLocalStorageValue(key);
			if (valueInLocalStorage !== undefined
				&& valueInLocalStorage !== null) {
				this.setItem(key, valueInLocalStorage).then(() => {
					this.commonService.removeLocalStorageValue(key);
				});
				return valueInLocalStorage;
			}
			const valueFromIndexedDB = await this.getItem(key, defaultValue);
			return valueFromIndexedDB;
		} else {
			const valueFromIndexedDB = await this.getItem(key, undefined);
			if (valueFromIndexedDB !== undefined
				&& valueFromIndexedDB !== null) {
				this.commonService.setLocalStorageValue(key, valueFromIndexedDB);
				this.removeItem(key);
			}
			return this.commonService.getLocalStorageValue(key, defaultValue);
		}
	}

	/**
	 * Removes the key/value pair in IndexedDB storage with the given key
	 * Before switch to use IndexedDB, please make sure there is related feature story for PA to verify
	 * @param key key use to removes the key/value pair in IndexedDB storage
	 */
	public removeLocalCacheItem(key: LocalStorageKey | DashboardLocalStorageKey): Promise<void> {
		if (this.transferEnabled) {
			return this.removeItem(key);
		}
		this.commonService.removeLocalStorageValue(key);
		return Promise.resolve();
	}

	private setItem(key, value): Promise<void> {
		return this.store.setItem(key, value);
	}

	private removeItem(key): Promise<void> {
		return this.store.removeItem(key);
	}

	private async getItem(key, defaultValue?: any) {
		const value = await this.store.getItem<string>(key);
		if (value !== undefined && value !== null) {
			try {
				return JSON.parse(value);
			} catch (e) {
				return value;
			}
		}
		return arguments.length === 1 ? undefined : defaultValue;
	}

	private createForage(dbName: string, store: string) {
		this.store = this.fact.createNgForage({
			name: dbName,
			storeName: store,
			driver: [Driver.INDEXED_DB, Driver.LOCAL_STORAGE]
		});
	}

	private checkTransferEnabled() {
		let result = false;
		const shellVersion = this.shellService.getShellVersion();
		result = this.commonService.compareVersion(shellVersion, this.transferredShellVersion) >= 0;
		return result;
	}
}
