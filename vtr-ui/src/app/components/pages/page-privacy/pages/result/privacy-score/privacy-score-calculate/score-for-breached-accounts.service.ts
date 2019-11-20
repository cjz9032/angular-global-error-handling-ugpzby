import { Injectable } from '@angular/core';
import { BreachedAccount, BreachedAccountsService } from '../../../../feature/check-breached-accounts/services/breached-accounts.service';
import { combineLatest, of } from 'rxjs';
import { catchError, filter, map, startWith } from 'rxjs/operators';
import { coefficients } from './coefficients';
import { CountNumberOfIssuesService } from '../../../../core/services/count-number-of-issues.service';
import { ScoreCalculate } from './score-calculate.interface';
import { AppStatusesService } from '../../../../core/services/app-statuses/app-statuses.service';
import { FeaturesStatuses } from '../../../../userDataStatuses';

@Injectable({
	providedIn: 'root'
})
export class ScoreForBreachedAccountsService implements ScoreCalculate {

	constructor(
		private countNumberOfIssuesService: CountNumberOfIssuesService,
		private breachedAccountsService: BreachedAccountsService,
		private appStatusesService: AppStatusesService
	) {
	}

	private breachedAccountsFromKnownWebsites$ = this.getBreachesAccount((x: BreachedAccount) => x.domain !== 'n/a');
	private breachedAccountsFromUnknownWebsites$ = this.getBreachesAccount((x: BreachedAccount) => x.domain === 'n/a');

	private scoreFromBreachedAccount$ = combineLatest([
		this.breachedAccountsFromKnownWebsites$,
		this.breachedAccountsFromUnknownWebsites$,
	]).pipe(
		map(([knownBreached, unknownBreached]) => {
			const {
				breachedAccountsFromKnownWebsites: Br,
				breachedAccountsFromUnknownWebsites: Bn,
				breachedAccounts: Kb,
			} = coefficients;
			const Nr = knownBreached;
			const Nn = unknownBreached;

			return (Br / (Nr + 1) + Bn / (Nr + Nn + 1)) * Kb;
		})
	);

	getScore() {
		const defaultValue = (coefficients.breachedAccounts * coefficients.withoutScan) as number;

		return combineLatest([
			this.appStatusesService.globalStatus$,
			this.scoreFromBreachedAccount$
		]).pipe(
			map(([globalStatus, response]) => {
				const isExist = globalStatus.breachedAccountsResult !== FeaturesStatuses.undefined && globalStatus.breachedAccountsResult !== FeaturesStatuses.error;
				return isExist ? response : defaultValue;
			}),
			startWith(defaultValue),
			catchError((err) => of(defaultValue)),
		);
	}

	private getBreachesAccount(filterFunc) {
		return this.breachedAccountsService.onGetBreachedAccounts$.pipe(
			filter((breachedAccounts) => breachedAccounts.error === null && !breachedAccounts.reset),
			map((breachedAccounts) => breachedAccounts.breaches.filter(filterFunc).length)
		);
	}
}
