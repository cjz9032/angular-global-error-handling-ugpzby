import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonPopupService } from '../../common-services/popups/common-popup.service';
import { DescribeStep } from '../low-privacy/low-privacy.component';
import { PrivacyScoreService } from './privacy-score.service';
import { takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../shared/custom-rxjs-operators/instance-destroyed';
import { BreachedAccountsService } from '../../common-services/breached-accounts.service';

export interface ScoreParametrs {
	fixedBreaches: number;
	unfixedBreaches: number;
	fixedStorages: number;
	unfixedStorages: number;
	monitoringEnabled: boolean;
	trackingEnabled: boolean;
}

@Component({
	selector: 'vtr-privacy-score',
	templateUrl: './privacy-score.component.html',
	styleUrls: ['./privacy-score.component.scss']
})
export class PrivacyScoreComponent implements OnInit, OnDestroy {
	describeSteps: DescribeStep[] = [
		{
			img: '/assets/images/privacy-tab/score-popup/breached-accounts.png',
			img2x: '/assets/images/privacy-tab/score-popup/breached-accounts@2x.png',
			title: 'Breached accounts',
			button: {
				name: 'Scan the internet',
				link: '/privacy/breaches'
			}
		},
		{
			img: '/assets/images/privacy-tab/score-popup/online-trackers.png',
			img2x: '/assets/images/privacy-tab/score-popup/online-trackers@2x.png',
			title: 'online trackers',
			button: {
				name: 'See who’s tracking me',
				link: '/privacy/trackers'
			},
		},
		{
			img: '/assets/images/privacy-tab/score-popup/public-passwords.png',
			img2x: '/assets/images/privacy-tab/score-popup/public-passwords@2x.png',
			title: 'Non-private passwords',
			button: {
				name: 'Check my browsers',
				link: '/privacy/browser-accounts'
			},
		}
	];

	scoreParametrs: ScoreParametrs = {
		fixedBreaches: 0,
		unfixedBreaches: 0,
		fixedStorages: 0,
		unfixedStorages: 0,
		monitoringEnabled: false,
		trackingEnabled: false,
	};
	// default data
	title = 'Your privacy score';
	text = 'Take control of your privacy by choosing when to be private and what to share on every site you interact with.';
	btn_text = 'Understand my score';
	privacyLevel = 'low';
	score = 0;

	constructor(
		private privacyScoreService: PrivacyScoreService,
		private commonPopupService: CommonPopupService,
		private breachedAccountsService: BreachedAccountsService) {
	}

	ngOnInit() {
		this.privacyScoreService.getScoreParametrs()
			.pipe(
				takeUntil(instanceDestroyed(this)),
			)
			.subscribe((scoreParametrs: ScoreParametrs) => {
				this.scoreParametrs = scoreParametrs;
				this.setDataAccordingToScore(scoreParametrs);
			});

		this.breachedAccountsService.onGetBreachedAccounts$.pipe(
			takeUntil(instanceDestroyed(this)),
		).subscribe(breachedAccounts => {
			this.scoreParametrs.unfixedBreaches = breachedAccounts.length;
			this.setDataAccordingToScore(this.scoreParametrs);
		});
	}

	ngOnDestroy() {
	}

	setDataAccordingToScore(scoreParam) {
		const score = this.privacyScoreService.calculate(scoreParam);
		const staticDataAccordingToScore = this.privacyScoreService.getStaticDataAccordingToScore(score);
		this.score = score;
		this.privacyLevel = staticDataAccordingToScore.privacyLevel;
		this.title = staticDataAccordingToScore.title;
		this.text = staticDataAccordingToScore.text;
	}

	openPopUp(popUpID) {
		this.commonPopupService.open(popUpID);
	}
}
