import { Injectable } from '@angular/core';
import { ScoreCalculate } from './score-calculate.interface';
import { catchError, distinctUntilChanged, filter, map, skip, startWith, tap, withLatestFrom } from 'rxjs/operators';
import { FeaturesStatuses } from '../../../../userDataStatuses';
import { coefficients } from './coefficients';
import { combineLatest, of } from 'rxjs';
import { BrowserAccountsService } from '../../../../feature/non-private-password/services/browser-accounts.service';
import { AppStatusesService } from '../../../../core/services/app-statuses/app-statuses.service';

@Injectable({
	providedIn: 'root'
})
export class ScoreForVulnerablePasswordsService implements ScoreCalculate {

	constructor(
		private browserAccountsService: BrowserAccountsService,
		private appStatusesService: AppStatusesService,
	) {
	}

	private ammountPasswordFromBrowser$ = this.browserAccountsService.installedBrowsersData
		.pipe(
			map((installedBrowsersData) => {
					return installedBrowsersData.browserData.reduce((acc, curr) => {
						acc += curr.accountsCount;
						return acc;
					}, 0);
				}
			),
			distinctUntilChanged()
		);

	getScore() {
		const defaultValue = (coefficients.nonPrivatelyStoredPasswords * coefficients.withoutScan) as number;

		return combineLatest([
			this.appStatusesService.globalStatus$,
			this.ammountPasswordFromBrowser$
		]).pipe(
			map(([globalStatus, response]) => {
				const isExist = globalStatus.nonPrivatePasswordResult !== FeaturesStatuses.undefined && globalStatus.nonPrivatePasswordResult !== FeaturesStatuses.error;
				return isExist ? this.getRange(response) * coefficients.nonPrivatelyStoredPasswords : defaultValue;
			}),
			startWith(defaultValue),
			catchError((err) => of(defaultValue)),
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
