import { Injectable } from '@angular/core';
import { NgForage, Driver, DedicatedInstanceFactory } from 'ngforage';
import { CommonService } from '../common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

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
	public setLocalCacheValue(key: LocalStorageKey, value: any): Promise<void> {
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
	public async getLocalCacheValue(key: LocalStorageKey, defaultValue?: any) {
		if (this.transferEnabled) {
			let cacheValue = defaultValue;
			const indexedDBCache = await this.getItem(key);
			const localStorageCache = this.commonService.getLocalStorageValue(key);
			if (this.isAvailableValue(indexedDBCache)) {
				cacheValue = indexedDBCache;
			} else if (this.isAvailableValue(localStorageCache)) {
				cacheValue = localStorageCache;
				this.setItem(key, localStorageCache).then(() => {
					this.commonService.removeLocalStorageValue(key);
				});
			}
			return cacheValue;
		} else {
			return this.commonService.getLocalStorageValue(key, defaultValue);
		}
	}

	/**
	 * Removes the key/value pair in IndexedDB storage with the given key
	 * Before switch to use IndexedDB, please make sure there is related feature story for PA to verify
	 * @param key key use to removes the key/value pair in IndexedDB storage
	 */
	public removeLocalCacheItem(key: LocalStorageKey): Promise<void> {
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
		if (this.isAvailableValue(value)) {
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
		const shellVersion = this.commonService.getShellVersion();
		result = this.commonService.compareVersion(shellVersion, this.transferredShellVersion) >= 0;
		return result;
	}

	private isAvailableValue(value) {
		return value !== undefined && value !== null;
	}
}
