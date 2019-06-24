import { Injectable } from '@angular/core';
import { filter, map, startWith, switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { FigleafOverviewService } from '../../../common/services/figleaf-overview.service';
import { BrowserAccountsService } from '../../../common/services/browser-accounts.service';
import { BreachedAccountsService } from '../../../common/services/breached-accounts.service';
import { UserDataGetStateService } from '../../../common/services/user-data-get-state.service';
import { AppStatuses } from '../../../userDataStatuses';

@Injectable()
export class PrivacyScoreService {

	constructor(
		private userDataGetStateService: UserDataGetStateService,
		private figleafOverviewService: FigleafOverviewService,
		private browserAccountsService: BrowserAccountsService,
		private breachedAccountsService: BreachedAccountsService) {
	}

	readonly scoreWeights = {
		leaksScore: 1,
		monitoringEnabled: 1,
		trackingEnabled: 1,
		passwordStorageScore: 1,
		constant: 1
	};

	getScoreParametrs() {
		let figleafInstalled = false;
		return this.userDataGetStateService.userDataStatus$.pipe(
			filter((userDataStatuses) => userDataStatuses.appState !== AppStatuses.firstTimeVisitor),
			switchMap((userDataStatuses) => {
				figleafInstalled = userDataStatuses.appState === AppStatuses.figLeafInstalled;
				return combineLatest([
					this.getBreachesScore(),
					this.getStoragesScore(),
				]);
			}),
			map(val => {
				const receivedScoreParam = val.reduce((acc, curr) => ({...acc, ...curr}));
				return {
					...receivedScoreParam,
					monitoringEnabled: figleafInstalled,
					trackingEnabled: figleafInstalled,
				};
			}),
		);
	}

	calculate(params) {
		const leaksScore = this.calculateLeaksScore(params.fixedBreaches, params.unfixedBreaches);
		const passwordStorageScore = this.calculatePasswordStorageScore(params.fixedStorages, params.unfixedStorages);
		const scoreItems = {
			leaksScore,
			passwordStorageScore,
			monitoringEnabled: params.monitoringEnabled,
			trackingEnabled: params.trackingEnabled,
			constant: 1
		};

		const calculatedScore = this.calculateScore(scoreItems);

		return calculatedScore;
	}

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

	private getBreachesScore() {
		return this.breachedAccountsService.onGetBreachedAccounts$.pipe(
			filter((breachedAccounts) => breachedAccounts.error === null),
			map((figleafBreaches) => {
				const allBreaches = figleafBreaches.breaches || [];
				const fixedBreachesAmount = allBreaches.filter(breach => !!breach.isFixed).length;
				return {
					fixedBreaches: fixedBreachesAmount,
					unfixedBreaches: allBreaches.length - fixedBreachesAmount,
				};
			}),
			startWith({fixedBreaches: 0, unfixedBreaches: 0})
		);
	}

	private getStoragesScore() {
		return this.browserAccountsService.installedBrowsersData$.pipe(
			filter((response) => response.browserData.length > 0),
			map((response) => response.browserData.reduce((result, item) => {
				result[item.name] = item.accountsCount;
				return result;
			}, {})),
			map((browsersAccounts) => {
				return Object.keys(browsersAccounts)
					.map((browser) => ({
						fixedStorages: !browsersAccounts[browser] && 1,
						unfixedStorages: browsersAccounts[browser] && 1,
					})).reduce((prevVal, currVal) => ({
							fixedStorages: prevVal.fixedStorages + currVal.fixedStorages,
							unfixedStorages: prevVal.unfixedStorages + currVal.unfixedStorages,
						})
					);
			}),
			startWith({fixedStorages: 0, unfixedStorages: 0})
		);
	}

	private calculateProportion(a, b) {
		const total = a + b;
		if (total === 0) {
			return 1;
		}
		return a / total;
	}

	private calculateLeaksScore(fixedLeaks, unfixedLeaks) {
		return this.calculateProportion(fixedLeaks, unfixedLeaks);
	}

	private calculatePasswordStorageScore(safeStorages, unsafeStorages) {
		return this.calculateProportion(safeStorages, unsafeStorages);
	}

	private calculateScore(scoreItems) {
		const scoreTotalReducer = (total, key) => total + scoreItems[key] * this.scoreWeights[key];
		const scoreItemsKeys = Object.keys(scoreItems);
		const totalScore = scoreItemsKeys.reduce(scoreTotalReducer, 0);
		return Math.round(totalScore / scoreItemsKeys.length * 100);
	}
}
