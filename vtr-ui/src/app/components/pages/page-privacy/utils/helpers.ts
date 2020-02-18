import { BrowserListType } from '../core/services/vantage-communication.service';
import { AppStatuses, FeaturesStatuses } from '../userDataStatuses';
import SHA256 from 'crypto-js/sha256';
import SHA1 from 'crypto-js/sha1';
import { FormControl, FormGroup } from '@angular/forms';

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
		img: `/assets/images/privacy-tab/${browser}.png`,
		value: browser
	}));
}

export function getSha1Hash(value: string) {
	if (typeof value !== 'string') {
		return value;
	}

	return SHA1(value);
}

export function getSha256Hash(value: string) {
	if (typeof value !== 'string') {
		return value;
	}

	return SHA256(value);
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

export function getFigleafProtectedStatus(appState: AppStatuses) {
	const figleafProtectStatuses = [
		AppStatuses.figLeafInstalled,
		AppStatuses.trialSoonExpired,
		AppStatuses.trialExpired,
		AppStatuses.subscriptionSoonExpired,
		AppStatuses.subscriptionExpired,
	];
	return figleafProtectStatuses.includes(appState);
}

export function snake2CamelCase(message: string) {
	return message
		.replace(
			/_(\w)/g,
			($, $1) => $1.toUpperCase()
		);
}

export function snake2PascalCase(message: string) {
	const s = snake2CamelCase(message);

	return `${s.charAt(0).toUpperCase()}${s.substr(1)}`;
}

// pipe(
// 	(val) => val.filter(u => u.age >= 18),
// 	(val) => val.map(u => u.name),
// )(users) //["Jack", "Milady"]

export const pipe = (...functions) => args => functions.reduce((arg, fn) => fn(arg), args);

export function DifferenceInDays(firstDate, secondDate) {
	return Math.round((secondDate - firstDate) / (1000 * 60 * 60 * 24));
}

export function validateAllFormFields(formGroup: FormGroup) {
	Object.keys(formGroup.controls).forEach(field => {
		const control = formGroup.get(field);
		if (control instanceof FormControl) {
			control.markAsTouched();
			control.markAsDirty();
		} else if (control instanceof FormGroup) {
			this.validateAllFormFields(control);
		}
	});
}
