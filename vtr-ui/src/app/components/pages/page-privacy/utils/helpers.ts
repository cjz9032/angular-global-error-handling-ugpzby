import { BrowserListType } from '../common/services/vantage-communication.service';
import { createHash } from './createHash';
import { AppStatuses, FeaturesStatuses } from '../userDataStatuses';

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
	if (typeof value !== 'string') {
		return value;
	}
	return createHash(value);
}

export function getDisplayedCountValueOfIssues(status: FeaturesStatuses, issuesCount) {
	switch (status) {
		case FeaturesStatuses.exist:
			return issuesCount;
		case FeaturesStatuses.none:
			return 0;
		case FeaturesStatuses.undefined:
			return '';
		default:
			return '';
	}
}

export function getFigleafProtectedStatus(appState: AppStatuses | AppStatuses.figLeafInstalled | AppStatuses.trialSoonExpired | AppStatuses.trialExpired) {
	const figleafProtectStatuses = [AppStatuses.figLeafInstalled, AppStatuses.trialSoonExpired, AppStatuses.trialExpired];
	return figleafProtectStatuses.includes(appState);
}
