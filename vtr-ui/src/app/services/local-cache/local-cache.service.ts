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
	private transferredShellVersion = '10.2011.8';
	private cacheMap = {};
	private indexedCacheKey = 'VantageExperienceCache';
	private cacheInitialized = false;
	private setPromise: Promise<any>;

	constructor(
		private readonly fact: DedicatedInstanceFactory,
		private commonService: CommonService
	) {
		this.transferEnabled = this.checkTransferEnabled();
		if (this.transferEnabled) {
			this.createForage(this.experienceName, this.experienceName);
		}
	}

	/**
	 * Load all cache values from IndexedDB
	 * It should be done in App_Initializer
	 */
	public async loadCacheValues() {
		if (this.transferEnabled) {
			const start = Date.now();
			const  indexedDBCache = await this.getItem(this.indexedCacheKey);
			if (this.isAvailableValue(indexedDBCache)) {
				Object.assign(this.cacheMap, indexedDBCache);
			} else {
				for (const localStorageKey in window.localStorage) {
					if (Object.prototype.hasOwnProperty.call(window.localStorage, localStorageKey)) {
						const cacheValue = this.commonService.getLocalStorageValue(localStorageKey as LocalStorageKey);
						if (this.isAvailableValue(cacheValue)) {
							this.cacheMap[localStorageKey] = cacheValue;
						}
					}
				}
				this.setPromise = this.setItem(this.indexedCacheKey, this.cacheMap).then(() => {
					window.localStorage.clear();
					this.setPromise = undefined;
				});
			}
			const end = Date.now();
			// console.log('Local Cache Value time cost:', end - start);
		}
	}

	/**
	 * Stores given value in IndexedDB
	 * Before switch to use IndexedDB, please make sure there is related feature story for PA to verify
	 * @param key key for storage. Must define it in LocalStorageKey or DashboardLocalStorageKey enum
	 * @param value value to store in local storage
	 */
	public setLocalCacheValue(key: LocalStorageKey, value: any): Promise<void> {
		return new Promise((resolve, reject) => {
			if (this.transferEnabled) {
				const oldValue = this.cacheMap[key];
				this.cacheMap[key] = this.cloneObjectValue(value);
				this.setItem(this.indexedCacheKey, this.cacheMap).then(() => {
					this.commonService.sendNotification(key, value);
					resolve();
				}).catch((error) => {
					this.cacheMap[key] = oldValue;
					reject(error);
				});
			} else {
				this.commonService.setLocalStorageValue(key, value);
				resolve();
			}
		});
	}

	/**
	 * Get value from IndexedDB
	 * Before switch to use IndexedDB, please make sure there is related feature story for PA to verify
	 * @param key key for storage. Must define it in LocalStorageKey or DashboardLocalStorageKey enum
	 * @param defaultValue default value for not key not found in IndexedDB storage
	 */
	public getLocalCacheValue(key: LocalStorageKey, defaultValue?: any) {
		if (this.transferEnabled) {
			let cacheValue = this.cacheMap[key];
			if (!this.isAvailableValue(cacheValue)) {
				cacheValue = defaultValue;
			}
			return this.cloneObjectValue(cacheValue);
		} else {
			return this.commonService.getLocalStorageValue(key, defaultValue);
		}
	}

	/**
	 * Removes the key/value pair in IndexedDB storage with the given key
	 * Before switch to use IndexedDB, please make sure there is related feature story for PA to verify
	 * @param key key use to removes the key/value pair in IndexedDB storage
	 */
	public removeLocalCacheValue(key: LocalStorageKey): Promise<void> {
		if (this.transferEnabled) {
			delete this.cacheMap[key];
			return this.setItem(this.indexedCacheKey, this.cacheMap);
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

	private cloneObjectValue(value) {
		if (value && typeof value === 'object') {
			return this.commonService.cloneObj(value);
		} else {
			return value;
		}
	}
}
