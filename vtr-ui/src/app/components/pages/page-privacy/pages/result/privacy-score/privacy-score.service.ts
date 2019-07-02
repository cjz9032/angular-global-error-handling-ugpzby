import { Injectable } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, map, startWith, switchMapTo } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { FigleafOverviewService, FigleafSettings } from '../../../common/services/figleaf-overview.service';
import { BrowserAccountsService } from '../../../common/services/browser-accounts.service';
import { BreachedAccount, BreachedAccountsService } from '../../../common/services/breached-accounts.service';
import { UserDataGetStateService } from '../../../common/services/user-data-get-state.service';
import { CountNumberOfIssuesService } from '../../../common/services/count-number-of-issues.service';
import { FeaturesStatuses } from '../../../userDataStatuses';

@Injectable()
export class PrivacyScoreService {

	constructor(
		private userDataGetStateService: UserDataGetStateService,
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

	private breachedAccountsFromKnownWebsites$ = this.getBreachesAccount((x: BreachedAccount) => x.domain !== 'n/a');
	private breachedAccountsFromUnknownWebsites$ = this.getBreachesAccount((x: BreachedAccount) => x.domain === 'n/a');
	private ammountPasswordFromBrowser$ = this.browserAccountsService.installedBrowsersData.pipe(
		map((installedBrowsersData) => {
				return installedBrowsersData.browserData.reduce((acc, curr) => {
					acc += curr.accountsCount;
					return acc;
				}, 0);
			}
		));

	private monitoringEnable$ = this.getFigleafSetting((settings: FigleafSettings) => settings.isBreachMonitoringEnabled);
	private isAntitrackingEnabled$ = this.userDataGetStateService.userDataStatus$.pipe(
		map((userDataStatus) =>
			userDataStatus.websiteTrackersResult !== FeaturesStatuses.undefined &&
			userDataStatus.websiteTrackersResult !== FeaturesStatuses.error),
		distinctUntilChanged(),
		filter(Boolean),
		switchMapTo(this.getFigleafSetting((settings: FigleafSettings) => settings.isAntitrackingEnabled))
	);

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
		this.scoreFromBreachedAccount$.pipe(
			startWith((this.coefficients.breachedAccounts * this.coefficients.withoutScan) as number)
		),
		this.ammountPasswordFromBrowser$.pipe(
			map((response) => this.getRange(response)),
			map((range) => Number(range) * this.coefficients.nonPrivatelyStoredPasswords),
			startWith((this.coefficients.nonPrivatelyStoredPasswords * this.coefficients.withoutScan) as number)
		),
		this.monitoringEnable$.pipe(
			startWith(false),
			map((isMonitoringEnable) => Number(isMonitoringEnable) * this.coefficients.breachMonitoring)
		),
		this.isAntitrackingEnabled$.pipe(
			map((isMonitoringEnable) => Number(isMonitoringEnable) * this.coefficients.trackingTools),
			startWith(0)
		),
	]).pipe(
		debounceTime(500),
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
				text: `A lot of your personal info is out there. Take control of your privacy by choosing when to be private and when to share on every site you interact with.`,
			};
		} else if (score < 60) {
			return {
				privacyLevel: 'medium-low',
				title: 'Medium privacy score',
				text: `You’re taking a few steps to be private, but some of your info could easily be exposed. Lenovo Privacy by FigLeaf can help.`,
			};
		} else if (score < 80) {
			return {
				privacyLevel: 'medium',
				title: 'Medium privacy score',
				text: `You’re taking some steps to be private. But there’s a lot more you can do.`,
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
			map((breachedAccounts) => breachedAccounts.breaches.filter(filterFunc).length)
		);
	}

	private getFigleafSetting(mapFunc) {
		return this.figleafOverviewService.figleafSettings$.pipe(
			map(mapFunc),
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
