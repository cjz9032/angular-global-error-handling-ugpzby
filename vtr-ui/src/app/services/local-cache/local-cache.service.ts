import { Injectable } from '@angular/core';
import {NgForage, Driver, DedicatedInstanceFactory, NgForageCache} from 'ngforage';

@Injectable({
  providedIn: 'root'
})

export class LocalCacheService {
	private experienceName = 'VantageExperience';
	private store: NgForage;

	constructor(
		private readonly fact: DedicatedInstanceFactory
	) {
		this.createForage(this.experienceName, this.experienceName);
	}

	private createForage(dbName: string, store: string) {
		this.store = this.fact.createNgForage({
			name: dbName,
			storeName: store,
			driver: [Driver.INDEXED_DB, Driver.LOCAL_STORAGE]
		});
	}

	public setItem(key, value) {
		return this.store.setItem(key, value);
	}

	public removeItem(key) {
		return this.store.removeItem(key);
	}

	public async getItem(key, defaultValue?: any) {
		const value = await this.store.getItem<string>(key);
		if (value !== undefined) {
			try {
				return JSON.parse(value);
			} catch (e) {
				return value;
			}
		}
		return arguments.length === 1 ? undefined : defaultValue;
	}
}
