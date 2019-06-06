import { BrowserListType } from '../common/services/vantage-communication.service';
import { createHash } from './createHash';

export function returnUniqueElementsInArray<T>(arr: T[]): T[] {
	return Array.from(new Set<T>(arr));
}

export function returnUniqueElementsInArrayOfObject<T>(arr: T[], keyProps: string[]): T[] {
	const kvArray = arr.map(entry => {
		const key = keyProps.map(k => entry[k]).join('|');
		return [key, entry];
	});
	const map = new Map(kvArray);
	return Array.from(map.values());
}

export function validateEmail(email) {
	const regExpForCheckEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return regExpForCheckEmail.test(String(email).toLowerCase());
}

export function convertBrowserNameToBrowserData(browsers: BrowserListType[]) {
	return browsers.map((browser) => ({
		name: browser,
		img: `/assets/images/privacy-tab/${browser}.svg`,
		value: browser
	}));
}

export function getHashCode(value: string) {
	if (typeof value !== 'string') {
		return value;
	}
	return createHash(value);
}
