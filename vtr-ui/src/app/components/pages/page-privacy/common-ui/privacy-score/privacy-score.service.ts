import { Injectable } from '@angular/core';
import { filter, map, switchMap } from 'rxjs/operators';
import { combineLatest, iif, of } from 'rxjs';
import { FigleafOverviewService } from '../../common-services/figleaf-overview.service';
import { BrowserAccountsService } from '../../common-services/browser-accounts.service';
import { ServerCommunicationService } from '../../common-services/server-communication.service';

@Injectable({
	providedIn: 'root'
})
export class PrivacyScoreService {

	constructor(
		private figleafOverviewService: FigleafOverviewService,
		private browserAccountsService: BrowserAccountsService,
		private serverCommunicationService: ServerCommunicationService) {
	}

	readonly scoreWeights = {
		leaksScore: 1.25,
		monitoringEnabled: 1.25,
		trackingEnabled: 1.25,
		passwordStorageScore: 1.25,
		constant: 0
	};

	getScoreParametrs() {
		return this.figleafOverviewService.isFigleafInstalled().pipe(
			switchMap(value => iif(
				() => value.payload.is_figleaf_installed,
				this.handleInstalledScore(),
				this.handleUninstalledScore(),
			)),
		);
	}

	calculate(params) {
		const leaksScore = this.calculateLeaksScore(params.fixedBreaches, params.unfixedBreaches);
		const passwordStorageScore = this.calculatePasswordStorageScore(params.fixedStorages, params.unfixedStorages);

		return this.calculateScore({
			leaksScore,
			passwordStorageScore,
			monitoringEnabled: params.monitoringEnabled,
			trackingEnabled: params.trackingEnabled,
			constant: 0
		});
	}

	getStaticDataAccordingToScore(score) {
		if (score < 40) {
			return {
				privacyLevel: 'low',
				title: 'Low privacy score',
				text: 'A lot of your personal info is out there. ' +
					'Take control of your privacy by choosing when to be private and what to share on every site you interact with.',
			};
		} else if (score < 60) {
			return {
				privacyLevel: 'medium-low',
				title: 'Medium privacy score',
				text: 'A lot of your personal info is out there. ' +
					'Take control of your privacy by choosing when to be private and what to share on every site you interact with.',
			};
		} else if (score < 80) {
			return {
				privacyLevel: 'medium',
				title: 'Medium privacy score',
				text: 'A lot of your personal info is out there. ' +
					'Take control of your privacy by choosing when to be private and what to share on every site you interact with.',
			};
		} else {
			return {
				privacyLevel: 'high',
				title: 'High privacy score',
				text: 'You’re doing a great job controlling your privacy. Keep it up!',
			};

		}
	}

	private handleInstalledScore() {
		return combineLatest(
			this.getInstalledScore(),
			this.getStoragesScore(),
		).pipe(
			switchMap(val => {
				const receivedScoreParam = val.reduce((acc, curr) => ({...acc, ...curr}));
				return of({
					...receivedScoreParam,
					monitoringEnabled: true,
					trackingEnabled: true,
				});
			})
		);
	}

	private handleUninstalledScore() {
		return combineLatest(
			this.getUninstalledScore(),
			this.getStoragesScore(),
		).pipe(
			switchMap(val => {
				const receivedScoreParam = val.reduce((acc, curr) => ({...acc, ...curr}));
				return of({
					...receivedScoreParam,
					monitoringEnabled: false,
					trackingEnabled: false,
				});
			})
		);
	}

	private getInstalledScore() {
		return this.figleafOverviewService.getBreaches().pipe(
			map(val => val.payload.breaches),
			map((figleafBreaches) => {
				const fixedBreachesAmount = figleafBreaches.filter(breach => !!breach.is_fixed).length;
				return {
					fixedBreaches: fixedBreachesAmount,
					unfixedBreaches: figleafBreaches.length - fixedBreachesAmount,
				};
			})
		);
	}

	private getUninstalledScore() {
		return of({
			fixedBreaches: 0,
			unfixedBreaches: 0,
		});
	}

	private getStoragesScore() {

		this.serverCommunicationService.getInstalledBrowser();

		return this.browserAccountsService.browserAccounts$.pipe(
			filter((response) => !!response),
			switchMap((browsersAccounts) => {
				const storagesScoreData = Object.keys(browsersAccounts)
					.map((browser) => {
						return {
							fixedStorages: !browsersAccounts[browser].length && 1,
							unfixedStorages: browsersAccounts[browser].length && 1,
						};
					}).reduce((prevVal, currVal) => ({
							fixedStorages: prevVal.fixedStorages + currVal.fixedStorages,
							unfixedStorages: prevVal.unfixedStorages + currVal.unfixedStorages,
						})
					);
				return of(storagesScoreData);
			}),
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
