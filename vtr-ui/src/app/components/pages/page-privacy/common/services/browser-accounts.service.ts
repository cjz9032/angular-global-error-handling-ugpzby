import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { MaskedPasswordsInfo, VantageCommunicationService } from './vantage-communication.service';
import { convertBrowserNameToBrowserData } from '../../utils/helpers';

export interface InstalledBrowser {
	name: string;
	img: string;
	accounts?: MaskedPasswordsInfo[];
	accountsCount: number;
}

@Injectable({
	providedIn: 'root'
})
export class BrowserAccountsService {
	isConsentGiven$ = new BehaviorSubject(!!this.storageService.getItem('isConsentGiven'));

	installedBrowsersData$ = new BehaviorSubject<InstalledBrowser[]>([]);

	constructor(
		private http: HttpClient,
		private vantageCommunicationService: VantageCommunicationService,
		private storageService: StorageService,
	) {
	}

	getInstalledBrowsersDefaultData() {
		this.vantageCommunicationService.getInstalledBrowsers().pipe(
			map((response) => convertBrowserNameToBrowserData(response.browsers)),
			switchMap((browserData) => this.concatPasswordsCount(browserData)),
			take(1),
		).subscribe((browserData) => this.installedBrowsersData$.next(browserData));
	}

	giveConcent() {
		this.storageService.setItem('isConsentGiven', 'true');
		this.isConsentGiven$.next(true);
	}

	concatPasswords(browsers: string[]) {
		const currentBrowsers = this.installedBrowsersData$.getValue();

		this.vantageCommunicationService.getMaskedPasswords(browsers).pipe(
			map((accountsPassword) => currentBrowsers.map((browser) => (
					{...browser, accounts: browser.accounts ? browser.accounts : accountsPassword[browser.name]}
				))
			),
			take(1)
		).subscribe((installedBrowsersData) => {
			this.installedBrowsersData$.next(installedBrowsersData);
		});
	}

	private concatPasswordsCount(browserData: ReturnType<typeof convertBrowserNameToBrowserData>) {
		const isConsentGiven = this.isConsentGiven$.getValue();

		if (isConsentGiven) {
			const browsersNamesArray = browserData.map((browser) => browser.name);
			return this.vantageCommunicationService.getAccessiblePasswords(browsersNamesArray).pipe(
				map((accessiblePasswords) =>
					browserData.map((browser) => ({...browser, accountsCount: accessiblePasswords[browser.name]}))
				)
			);
		} else {
			return of(browserData.map((browser) => ({...browser, accountsCount: null})));
		}
	}
}
