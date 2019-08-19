import { Injectable } from '@angular/core';
import {
	catchError,
	distinctUntilChanged,
	filter,
	map,
	share,
	shareReplay,
	startWith,
	switchMapTo,
	take
} from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
import { FigleafOverviewService, FigleafSettings } from '../../../common/services/figleaf-overview.service';
import { BrowserAccountsService } from '../../../common/services/browser-accounts.service';
import { BreachedAccount, BreachedAccountsService } from '../../../common/services/breached-accounts.service';
import { CountNumberOfIssuesService } from '../../../common/services/count-number-of-issues.service';
import { FeaturesStatuses } from '../../../userDataStatuses';
import { AppStatusesService } from '../../../common/services/app-statuses/app-statuses.service';

@Injectable({
	providedIn: 'root'
})
export class PrivacyScoreService {

	constructor(
		private appStatusesService: AppStatusesService,
		private figleafOverviewService: FigleafOverviewService,
		private browserAccountsService: BrowserAccountsService,
		private countNumberOfIssuesService: CountNumberOfIssuesService,
		private breachedAccountsService: BreachedAccountsService) {
	}

	private readonly coefficients = {
		breachedAccounts: 0.45,
		breachMonitoring: 0.15,
		trackingTools: 0.15,
		nonPrivatelyStoredPasswords: 0.15,
		minimalLevelOfScore: 0.1,
		breachedAccountsFromKnownWebsites: 2 / 3,
		breachedAccountsFromUnknownWebsites: 1 / 3,
		withoutScan: 1 / 3
	};

	private ammountPasswordFromBrowser$ = this.appStatusesService.globalStatus$.pipe(
		map((userDataStatus) =>
			userDataStatus.nonPrivatePasswordResult !== FeaturesStatuses.undefined &&
			userDataStatus.nonPrivatePasswordResult !== FeaturesStatuses.error),
		distinctUntilChanged(),
		filter(Boolean),
		switchMapTo(this.browserAccountsService.installedBrowsersData.pipe(
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

	private monitoringEnable$ = this.getFigleafSetting((settings: FigleafSettings) => settings.isBreachMonitoringEnabled);
	private isAntitrackingEnabled$ = this.appStatusesService.globalStatus$.pipe(
		map((userDataStatus) =>
			userDataStatus.websiteTrackersResult !== FeaturesStatuses.undefined &&
			userDataStatus.websiteTrackersResult !== FeaturesStatuses.error),
		filter(Boolean),
		switchMapTo(
			this.getFigleafSetting((settings: FigleafSettings) => settings.isAntitrackingEnabled)
		),
		catchError((err) => of(false))
	);

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
			} = this.coefficients;
			const Nr = knownBreached;
			const Nn = unknownBreached;

			return (Br / (Nr + 1) + Bn / (Nr + Nn + 1)) * Kb;
		})
	);

	newPrivacyScore$ = combineLatest([
		this.getScoreFromBreachedAccount(),
		this.getAmmountPasswordFromBrowser(),
		this.getMonitoringEnable(),
		this.getIsAntitrackingEnabled()
	]).pipe(
		map(([breachedAccountScore, passwordFromBrowserScore, monitoringScore, antitrackingScore]) => {
			return Math.round(
				(
					breachedAccountScore +
					passwordFromBrowserScore +
					monitoringScore +
					antitrackingScore +
					this.coefficients.minimalLevelOfScore
				) * 100
			);
		}),
		shareReplay(1)
	);

	getStaticDataAccordingToScore(score) {
		if (score === 0) {
			return {
				privacyLevel: 'undefined',
				title: 'Find out your privacy score',
				text: `Your Lenovo is designed to put you
						in control of your privacy. It all
						starts with simple tools to show you how
						private you are online.`,
			};
		} else if (score < 40) {
			return {
				privacyLevel: 'low',
				title: 'Low privacy score',
				text: `We found that a lot of your personal information is accessible to others. We recommend Lenovo Privacy Essentials by FigLeaf for better privacy online.`,
			};
		} else if (score < 60) {
			return {
				privacyLevel: 'medium-low',
				title: 'Medium privacy score',
				text: `You're taking a few steps to be private, but some of your information could easily be exposed. We recommend Lenovo Privacy Essentials by FigLeaf to close your privacy gaps.`,
			};
		} else if (score < 80) {
			return {
				privacyLevel: 'medium',
				title: 'Medium privacy score',
				text: `You're taking some steps to be private. But you could take greater control by choosing when to be private and when to share for each site you visit with Lenovo Privacy Essentials by FigLeaf.`,
			};
		} else {
			return {
				privacyLevel: 'high',
				title: 'High privacy score',
				text: 'You’re doing a great job controlling your privacy. Keep it up!',
			};
		}
	}

	private getBreachesAccount(filterFunc) {
		return this.breachedAccountsService.onGetBreachedAccounts$.pipe(
			filter((breachedAccounts) => breachedAccounts.error === null),
			map((breachedAccounts) => breachedAccounts.breaches.filter(filterFunc).length),
			share()
		);
	}

	private getFigleafSetting(mapFunc) {
		return this.figleafOverviewService.figleafSettings$.pipe(
			map(mapFunc),
			startWith(false),
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

	private getScoreFromBreachedAccount() {
		const defaultValue = (this.coefficients.breachedAccounts * this.coefficients.withoutScan) as number;

		return this.scoreFromBreachedAccount$.pipe(
			startWith(defaultValue),
			catchError((err) => {
				return of(defaultValue);
			}),
		);
	}

	private getAmmountPasswordFromBrowser() {
		const defaultValue = (this.coefficients.nonPrivatelyStoredPasswords * this.coefficients.withoutScan) as number;

		return this.ammountPasswordFromBrowser$.pipe(
			map((response) => this.getRange(response)),
			map((range) => Number(range) * this.coefficients.nonPrivatelyStoredPasswords),
			startWith(defaultValue),
			catchError((err) => {
				return of(defaultValue);
			}),
		);
	}

	private getMonitoringEnable() {
		return this.monitoringEnable$.pipe(
			startWith(false),
			map((isMonitoringEnable) => Number(isMonitoringEnable) * this.coefficients.breachMonitoring),
			catchError((err) => {
				return of(0);
			}),
		);
	}

	private getIsAntitrackingEnabled() {
		const defaultValue = (this.coefficients.trackingTools * this.coefficients.withoutScan) as number;

		return this.isAntitrackingEnabled$.pipe(
			map((isAntitrackingEnabled) => Number(isAntitrackingEnabled) * this.coefficients.trackingTools),
			startWith(defaultValue),
			catchError((err) => {
				return of(defaultValue);
			}),
		);
	}
}
