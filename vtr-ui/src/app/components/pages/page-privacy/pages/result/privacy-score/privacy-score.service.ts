import { Injectable } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { coefficients } from './privacy-score-calculate/coefficients';
import { ScoreForBreachedAccountsService } from './privacy-score-calculate/score-for-breached-accounts.service';
import { ScoreForVulnerablePasswordsService } from './privacy-score-calculate/score-for-vulnerable-passwords.service';
import { ScoreForTrackingToolsService } from './privacy-score-calculate/score-for-tracking-tools.service';
import { ScoreForMonitoringService } from './privacy-score-calculate/score-for-monitoring.service';
import { AppStatuses } from '../../../userDataStatuses';

@Injectable({
	providedIn: 'root'
})
export class PrivacyScoreService {
	appStatuses = AppStatuses;

	constructor(
		private scoreForVulnerablePasswordsService: ScoreForVulnerablePasswordsService,
		private scoreForBreachedAccountsService: ScoreForBreachedAccountsService,
		private scoreForTrackingToolsService: ScoreForTrackingToolsService,
		private scoreForMonitoringService: ScoreForMonitoringService
	) {
	}

	newPrivacyScore$ = combineLatest([
		this.scoreForBreachedAccountsService.getScore(),
		this.scoreForVulnerablePasswordsService.getScore(),
		this.scoreForTrackingToolsService.getScore(),
		this.scoreForMonitoringService.getScore()
	]).pipe(
		map(([breachedAccountScore, passwordFromBrowserScore, monitoringScore, antitrackingScore]) => {
			return Math.round(
				(
					breachedAccountScore +
					passwordFromBrowserScore +
					monitoringScore +
					antitrackingScore +
					coefficients.minimalLevelOfScore
				) * 100
			);
		}),
		shareReplay(1)
	);

	getStaticDataAccordingToScore(score, appState: AppStatuses) {
		if (appState === this.appStatuses.firstTimeVisitor) {
			return {
				privacyLevel: 'undefined',
				title: 'Find out your privacy score',
				text: `Your Lenovo is designed to put you
						in control of your privacy. It all
						starts with simple tools to show you how
						private you are online.`,
			};
		} else if (appState === this.appStatuses.figleafInExitWithoutScan) {
			return {
				privacyLevel: 'exit-undefined',
				title: 'Privacy score is not available',
				text: `Launch Lenovo Privacy Essentials by FigLeaf to see how private you are online.`,
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
}
