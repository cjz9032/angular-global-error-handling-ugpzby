import { Injectable } from '@angular/core';
import { ScoreCalculate } from './score-calculate.interface';
import {
	catchError,
	debounceTime,
	distinctUntilChanged,
	filter,
	map,
	startWith,
	switchMap,
	switchMapTo,
	take
} from 'rxjs/operators';
import { FeaturesStatuses } from '../../../../userDataStatuses';
import { coefficients } from './coefficients';
import { of } from 'rxjs';
import { BrowserAccountsService } from '../../../../common/services/browser-accounts.service';
import { AppStatusesService } from '../../../../common/services/app-statuses/app-statuses.service';

@Injectable({
	providedIn: 'root'
})
export class ScoreForVulnerablePasswordsService implements ScoreCalculate {

	constructor(
		private browserAccountsService: BrowserAccountsService,
		private appStatusesService: AppStatusesService,
	) {
	}

	private ammountPasswordFromBrowser$ = this.appStatusesService.globalStatus$.pipe(
		distinctUntilChanged((prev, current) => prev.nonPrivatePasswordResult !== current.nonPrivatePasswordResult),
		map((userDataStatus) =>
			userDataStatus.nonPrivatePasswordResult !== FeaturesStatuses.undefined &&
			userDataStatus.nonPrivatePasswordResult !== FeaturesStatuses.error),
		filter(Boolean),
		switchMap(() => this.browserAccountsService.installedBrowsersData.pipe(
			map((installedBrowsersData) => {
					return installedBrowsersData.browserData.reduce((acc, curr) => {
						acc += curr.accountsCount;
						return acc;
					}, 0);
				}
			),
			take(1)
		))
	);

	getScore() {
		const defaultValue = (coefficients.nonPrivatelyStoredPasswords * coefficients.withoutScan) as number;

		return this.ammountPasswordFromBrowser$.pipe(
			map((response) => this.getRange(response)),
			map((range) => Number(range) * coefficients.nonPrivatelyStoredPasswords),
			startWith(defaultValue),
			catchError((err) => {
				return of(defaultValue);
			}),
		);
	}

	private getRange(ammountPassword: any | number) {
		let range = 1;

		if (ammountPassword > 30) {
			range = 0;
		}

		if (ammountPassword > 10 && ammountPassword <= 30) {
			range = 1 / 3;
		}

		if (ammountPassword > 0 && ammountPassword <= 10) {
			range = 2 / 3;
		}

		return range;
	}
}
