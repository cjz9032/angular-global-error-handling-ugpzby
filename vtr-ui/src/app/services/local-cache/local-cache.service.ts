import { Injectable } from '@angular/core';
import {NgForage, Driver, DedicatedInstanceFactory, NgForageCache} from 'ngforage';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root'
})

export class LocalCacheService {
	private experienceName = 'VantageExperience';
	private store: NgForage;

	constructor(
		private readonly fact: DedicatedInstanceFactory,
		private logger: LoggerService) {
		this.createForage(this.experienceName, this.experienceName);
	}

	private createForage(dbName: string, store: string) {
		this.store = this.fact.createNgForage({
			name: dbName,
			storeName: store,
			driver: [Driver.INDEXED_DB, Driver.LOCAL_STORAGE]
		});
	}

	private get catcher() {
		return (e: any) => {
			this.logger.error('Local cache exception ', e);
		};
	}

	public setItem(key, value) {
		try {
			this.store.setItem(key, value)
			.catch(this.catcher);
		} catch (e) {
			this.catcher(e);
		}
	}

	public removeItem(key) {
		try {
			this.store.removeItem(key)
			.catch(this.catcher);
		} catch (e) {
			this.catcher(e);
		}
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
