import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, of, Subject } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { MaskedPasswordsInfo, VantageCommunicationService } from './vantage-communication.service';
import { convertBrowserNameToBrowserData } from '../../utils/helpers';
import { TaskActionWithTimeoutService, TasksName } from './analytics/task-action-with-timeout.service';

export interface InstalledBrowser {
	name: string;
	img: string;
	accounts?: MaskedPasswordsInfo[];
	accountsCount: number;
}

export interface InstalledBrowserDataState {
	browserData: InstalledBrowser[];
	error: string | null;
}

@Injectable({
	providedIn: 'root'
})
export class BrowserAccountsService {
	isConsentGiven$ = new BehaviorSubject(!!this.storageService.getItem('isConsentGiven'));

	installedBrowsersData$ = new BehaviorSubject<InstalledBrowserDataState>({browserData: [], error: null});
	installedBrowsersData = this.installedBrowsersData$.asObservable();

	constructor(
		private http: HttpClient,
		private vantageCommunicationService: VantageCommunicationService,
		private storageService: StorageService,
		private taskActionWithTimeoutService: TaskActionWithTimeoutService
	) {
		this.getInstalledBrowsersDefaultData();
	}

	getInstalledBrowsersDefaultData() {
		this.vantageCommunicationService.getInstalledBrowsers().pipe(
			map((response) => convertBrowserNameToBrowserData(response.browsers)),
			switchMap((browserData) => this.concatPasswordsCount(browserData)),
			switchMap((browserData) => this.concatPasswords(browserData)),
			take(1),
		).subscribe((browserData) => {
			this.installedBrowsersData$.next({browserData: browserData, error: null});
			const isConsentGiven = this.isConsentGiven$.getValue();
			if (isConsentGiven) {
				this.sendTaskAcrion();
			}
		});
	}

	giveConcent() {
		this.storageService.setItem('isConsentGiven', 'true');
		this.isConsentGiven$.next(true);
		this.getInstalledBrowsersDefaultData();
	}

	concatPasswords(browserData: InstalledBrowser[]) {
		const isConsentGiven = this.isConsentGiven$.getValue();

		if (isConsentGiven) {
			const browsersNamesArray = browserData.map((browser) => browser.name);
			return this.vantageCommunicationService.getMaskedPasswords(browsersNamesArray)
				.pipe(
					map((accountsPassword) => browserData.map((browser) => (
							{...browser, accounts: accountsPassword[browser.name]}
						))
					),
					take(1),
					catchError((error) => {
						this.installedBrowsersData$.next({browserData: [], error: error});
						console.error(error);
						return EMPTY;
					})
				);
		} else {
			return of(browserData.map((browser) => ({...browser, accounts: null})));
		}
	}

	private concatPasswordsCount(browserData: ReturnType<typeof convertBrowserNameToBrowserData>) {
		const isConsentGiven = this.isConsentGiven$.getValue();

		if (isConsentGiven) {
			const browsersNamesArray = browserData.map((browser) => browser.name);
			return this.vantageCommunicationService.getAccessiblePasswords(browsersNamesArray).pipe(
				map((accessiblePasswords) =>
					browserData.map((browser) => ({...browser, accountsCount: accessiblePasswords[browser.name]}))
				),
				catchError((error) => {
					this.installedBrowsersData$.next({browserData: [], error: error});
					this.sendTaskAcrion();
					return EMPTY;
				})
			);
		} else {
			return of(browserData.map((browser) => ({...browser, accountsCount: null})));
		}
	}

	private sendTaskAcrion() {
		this.taskActionWithTimeoutService.finishedAction(TasksName.getNonPrivateStoragesAction);
	}
}
