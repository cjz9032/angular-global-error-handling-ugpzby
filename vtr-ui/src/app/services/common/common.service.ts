import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
/**
 * Common service class. add functions which is common across application.
 */
export class CommonService {

	constructor() { }

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

	public getDaysBetweenDates(firstDate: Date, secondDate: Date): number {
		const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
		// const firstDate = new Date(2008, 1, 12);
		// const secondDate = new Date(2008, 1, 22);
		const diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
		return diffDays;
	}
}
