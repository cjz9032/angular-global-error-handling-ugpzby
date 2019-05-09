import { BrowserListType } from '../common/services/vantage-communication.service';

export function returnUniqueElementsInArray<T>(arr: T[]): T[] {
	return Array.from(new Set<T>(arr));
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
	// tslint:disable
	if (typeof value !== 'string') {
		return value
	}
	return value.split('').reduce((a, b) => {
		a = ((a << 5) - a) + b.charCodeAt(0);
		return a & a;
	}, 0);
	// tslint:enable
}
