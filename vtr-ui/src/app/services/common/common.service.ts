import { Injectable } from '@angular/core';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { Subject } from 'rxjs/internal/Subject';
import { DashboardLocalStorageKey } from 'src/app/enums/dashboard-local-storage-key.enum';
import { WinRT } from '@lenovo/tan-client-bridge';

@Injectable({
	providedIn: 'root'
})
/**
 * Common service class. add functions which is common across application.
 */
export class CommonService {
	public readonly notification: Observable<AppNotification>;
	private notificationSubject: BehaviorSubject<AppNotification>;
	public isOnline = true;
	public gamingCapabalities: any = new Subject();
	private RS5Version = 17600;

	constructor() {
		this.notificationSubject = new BehaviorSubject<AppNotification>(
			new AppNotification('init')
		);
		this.notification = this.notificationSubject;
	}

	/**
	 * converts bytes to MB, GB etc.
	 * source : https://stackoverflow.com/a/18650828/173613
	 * @param bytes bytes in form of number.
	 * @param decimals number of decimal places. default is 2.
	 */
	public formatBytes(bytes: number, decimals: number = 2) {
		if (bytes === 0) {
			return '0 Bytes';
		}

		const k = 1024,
			dm = decimals <= 0 ? 0 : decimals || 2,
			sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
			i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	}

	/**
	 * Returns the formatted date in local date format
	 * Example: return M/DD/YYYY for English
	 * @param dateString date string to format
	 */
	public formatLocalDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString(navigator.language);
	}

	/**
	 * Returns the formatted time in local time format
	 * Example: return HH:MM AM for English
	 * Example: return 上午9：00 for Chinese
	 * @param dateString date string to format
	 */
	public formatLocalTime(dateString: string): string {
		const date = new Date(dateString);
		const option = { hour: 'numeric', minute: 'numeric' };
		return date.toLocaleTimeString(navigator.language, option);
	}

	/**
	 * Returns date formatted in YYYY/MM/DD format
	 * @param date date object to format
	 */
	public formatDate(dateString: string): string {
		const date = new Date(dateString);
		const mm = date.getMonth() + 1; // getMonth() is zero-based
		const dd = date.getDate();

		return [date.getFullYear(),
			'/',
		(mm > 9 ? '' : '0') + mm,
			'/',
		(dd > 9 ? '' : '0') + dd
		].join('');
	}

	/**
	 * Returns date formatted in HH:MM AM/PM format
	 * @param date date object to format
	 */
	public formatTime(dateString: string): string {
		const dt = new Date(dateString);
		const hour = (dt.getHours() > 12) ? dt.getHours() - 12 : dt.getHours();
		const h = (hour < 10) ? '0' + hour : hour;
		const m = (dt.getMinutes() < 10) ? '0' + dt.getMinutes() : dt.getMinutes();

		return (dt.getHours() > 12) ? (h + ':' + m + ' PM') : (h + ':' + m + ' AM');
	}
	public getDaysBetweenDates(firstDate: Date, secondDate: Date): number {
		const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
		const diffDays = Math.ceil(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
		return diffDays;
	}

	/**
	 * Stores given value in local storage in json string format
	 * @param key key for local storage. Must define it in LocalStorageKey enum
	 * @param value value to store in local storage
	 */
	public setLocalStorageValue(key: LocalStorageKey | DashboardLocalStorageKey, value: any) {
		// console.log(`Setting the value for ${key}, Value => ${value}`);
		window.localStorage.setItem(key, JSON.stringify(value));
		// notify component that local storage value updated.
		this.sendNotification(key, value);
	}

	public haveLocalStorageKey(key: LocalStorageKey | DashboardLocalStorageKey, defaultValue?: any): any {
		const value = window.localStorage.getItem(key);
		if (value === null || value === undefined) {
			return false;
		}
		return true;
	}

	/**
	 * Returns parsed json object if key is found else returns undefined
	 * @param key key use to store value in local storage
	 */
	public getLocalStorageValue(key: LocalStorageKey | DashboardLocalStorageKey, defaultValue?: any): any {
		const value = window.localStorage.getItem(key);
		if (value) {
			try {
				return JSON.parse(value);
			} catch (e) {
				return value;
			}
		}
		return arguments.length === 1 ? undefined : defaultValue;
	}

	public sendNotification(action: string, payload?: any) {
		this.notificationSubject.next(new AppNotification(action, payload));
	}

	public isRS5OrLater(): boolean {
		return this.getWindowsVersion() >= this.RS5Version;
	}

	public getWindowsVersion(): Number {
		let version = '0';
		navigator.userAgent.split(' ').forEach((value) => {
			if (value.indexOf('Edge') !== -1) {
				const dotIndex = value.indexOf('.');
				version = value.substring(dotIndex + 1, value.length);
			}
		});
		console.log(version);
		return Number(version);
	}

	/**
	 * Stores given value in session storage in json string format
	 * @param key key for session storage. Must define it in SessionStorageKey enum
	 * @param value value to store in session storage
	 */
	public setSessionStorageValue(key: SessionStorageKey, value: any) {
		window.sessionStorage.setItem(key, JSON.stringify(value));
		// notify component that session storage value updated.
		this.sendNotification(key, value);
	}

	/**
	 * Returns parsed json object if key is found else returns undefined
	 * @param key key use to store value in session storage
	 */
	public getSessionStorageValue(key: SessionStorageKey, defaultValue?: any): any {
		const value = window.sessionStorage.getItem(key);
		if (value) {
			try {
				return JSON.parse(value);
			} catch (e) {
				return value;
			}
		}
		return arguments.length === 1 ? undefined : defaultValue;
	}

	public removeObjFrom(array: any[], path: string) {
		return array.filter(e => e.path !== path);
	}

	public removeObjById(array: any[], id: string) {
		return array.filter(e => e.id !== id);
	}

	public getCapabalitiesNotification(): Observable<any> {
		return this.gamingCapabalities.asObservable();
	}
	public sendGamingCapabilitiesNotification(action, payload) {
		this.gamingCapabalities.next({ type: action, payload });
	}

	public getBetaUser(): boolean {
		return this.getLocalStorageValue(LocalStorageKey.BetaUser, false);
	}

	public setBetaUser(value: boolean) {
		this.setLocalStorageValue(LocalStorageKey.BetaUser, value);
	}

	public cloneObj(obj) {
		// It will not copy reference. It is for assigning object pass by reference.
		return JSON.parse(JSON.stringify(obj));
	}
}
