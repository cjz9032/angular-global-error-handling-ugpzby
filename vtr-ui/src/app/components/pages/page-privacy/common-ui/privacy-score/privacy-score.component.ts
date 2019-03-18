import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-privacy-score',
	templateUrl: './privacy-score.component.html',
	styleUrls: ['./privacy-score.component.scss']
})
export class PrivacyScoreComponent implements OnInit {
	@Input() scoreParameters: {
		fixedBreaches: number,
		unfixedBreaches: number,
		fixedStorages: number,
		unfixedStorages: number,
		monitoringEnabled: boolean,
		trackingEnabled: boolean,
	};

	title = 'Your privacy score';
	text = 'Take control of your privacy by choosing when to be private and what to share on every site you interact with.';
	btn_text = 'Understand my score';
	privacyLevel = 'low';
	score = 0;

	private scoreWeights = {
		leaksScore: 1.25,
		monitoringEnabled: 1.25,
		trackingEnabled: 1.25,
		passwordStorageScore: 1.25,
		constant: 0
	};

	private calculate(params) {
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

	ngOnInit() {
		const score = this.calculate(this.scoreParameters);
		this.score = score;
		if (score < 40) {
			this.privacyLevel = 'low';
			this.title = 'Low privacy score';
			this.text = 'A lot of your personal info is out there. ' +
				'Take control of your privacy by choosing when to be private and what to share on every site you interact with.';
		} else if (score < 60) {
			this.privacyLevel = 'medium-low';
			this.title = 'Medium privacy score';
			this.text = 'A lot of your personal info is out there. ' +
				'Take control of your privacy by choosing when to be private and what to share on every site you interact with.';
		} else if (score < 80) {
			this.privacyLevel = 'medium';
			this.title = 'Medium privacy score';
			this.text = 'A lot of your personal info is out there. ' +
				'Take control of your privacy by choosing when to be private and what to share on every site you interact with.';
		} else {
			this.privacyLevel = 'high';
			this.title = 'High privacy score';
			this.text = 'You’re doing a great job controlling your privacy. Keep it up!';
		}
	}

}
