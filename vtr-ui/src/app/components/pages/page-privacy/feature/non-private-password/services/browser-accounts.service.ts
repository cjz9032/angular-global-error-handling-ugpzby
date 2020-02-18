import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, merge, of, Subject } from 'rxjs';
import { catchError, distinctUntilChanged, map, switchMap, take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../../core/services/storage.service';
import { MaskedPasswordsInfo, VantageCommunicationService } from '../../../core/services/vantage-communication.service';
import { convertBrowserNameToBrowserData } from '../../../utils/helpers';
import { TaskActionWithTimeoutService, TasksName } from '../../../core/services/analytics/task-action-with-timeout.service';
import { UpdateTriggersService } from '../../../core/services/update-triggers.service';
import { UserAllowService } from '../../../core/services/user-allow.service';

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
	installedBrowsersData$ = new BehaviorSubject<InstalledBrowserDataState>({browserData: [], error: null});
	installedBrowsersData = this.installedBrowsersData$.asObservable();

	private updateBrowsersData$ = new Subject();

	constructor(
		private http: HttpClient,
		private vantageCommunicationService: VantageCommunicationService,
		private storageService: StorageService,
		private taskActionWithTimeoutService: TaskActionWithTimeoutService,
		private updateTriggersService: UpdateTriggersService,
		private userAllowService: UserAllowService
	) {
		this.getInstalledBrowsersDefaultData();
	}

	private getInstalledBrowsersDefaultData() {
		merge(
			this.updateTriggersService.shouldUpdate$,
			this.updateBrowsersData$.asObservable(),
			this.userAllowService.allowToShow.pipe(
				map((allowMap) => allowMap.consentForVulnerablePassword),
				distinctUntilChanged()
			),
		).pipe(
			switchMap(() => {
				return this.vantageCommunicationService.getInstalledBrowsers().pipe(
					map((response) => convertBrowserNameToBrowserData(response.browsers)),
					switchMap((browserData) => this.concatPasswordsCount(browserData)),
					switchMap((browserData) => this.concatPasswords(browserData)),
					take(1),
				);
			})
		).subscribe((browserData) => {
			this.installedBrowsersData$.next({browserData, error: null});
			const isConsentGiven = this.userAllowService.allowToShow.getValue().consentForVulnerablePassword;
			if (isConsentGiven) {
				this.sendTaskAcrion();
			}
		});
	}

	giveConcent() {
		this.userAllowService.setConsentForVulnerablePassword(true);
		this.updateBrowsersData();
	}

	private concatPasswords(browserData: InstalledBrowser[]) {
		const isConsentGiven = this.userAllowService.allowToShow.getValue().consentForVulnerablePassword;

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
                        this.installedBrowsersData$.next({browserData: [], error});
                        return EMPTY;
                    })
				);
		} else {
			return of(browserData.map((browser) => ({...browser, accounts: null})));
		}
	}

	updateBrowsersData() {
		this.updateBrowsersData$.next(true);
	}

	private concatPasswordsCount(browserData: ReturnType<typeof convertBrowserNameToBrowserData>) {
		const isConsentGiven = this.userAllowService.allowToShow.getValue().consentForVulnerablePassword;

		if (isConsentGiven) {
			const browsersNamesArray = browserData.map((browser) => browser.name);
			return this.vantageCommunicationService.getAccessiblePasswords(browsersNamesArray).pipe(
				map((accessiblePasswords) =>
					browserData.map((browser) => ({...browser, accountsCount: accessiblePasswords[browser.name]}))
				),
				catchError((error) => {
					this.installedBrowsersData$.next({browserData: [], error});
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
