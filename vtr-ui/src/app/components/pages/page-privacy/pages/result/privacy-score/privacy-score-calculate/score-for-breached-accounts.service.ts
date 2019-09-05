import { Injectable } from '@angular/core';
import { BreachedAccount, BreachedAccountsService } from '../../../../common/services/breached-accounts.service';
import { combineLatest, of } from 'rxjs';
import { catchError, filter, map, startWith } from 'rxjs/operators';
import { coefficients } from './coefficients';
import { CountNumberOfIssuesService } from '../../../../common/services/count-number-of-issues.service';
import { ScoreCalculate } from './score-calculate.interface';

@Injectable({
	providedIn: 'root'
})
export class ScoreForBreachedAccountsService implements ScoreCalculate {

	constructor(
		private countNumberOfIssuesService: CountNumberOfIssuesService,
		private breachedAccountsService: BreachedAccountsService
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

		return this.scoreFromBreachedAccount$.pipe(
			startWith(defaultValue),
			catchError((err) => {
				return of(defaultValue);
			}),
		);
	}

	private getBreachesAccount(filterFunc) {
		return this.breachedAccountsService.onGetBreachedAccounts$.pipe(
			filter((breachedAccounts) => breachedAccounts.error === null && !breachedAccounts.reset),
			map((breachedAccounts) => breachedAccounts.breaches.filter(filterFunc).length)
		);
	}
}
