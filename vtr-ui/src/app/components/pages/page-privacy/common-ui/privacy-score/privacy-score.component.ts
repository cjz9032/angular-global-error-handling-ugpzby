import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-privacy-score',
	templateUrl: './privacy-score.component.html',
	styleUrls: ['./privacy-score.component.scss']
})
export class PrivacyScoreComponent implements OnInit {
	@Input() title: string;
	@Input() text: string;
	@Input() scoreParameters: {
		fixedBreaches: number,
		unfixedBreaches: number,
		fixedStorages: number,
		unfixedStorages: number,
		monitoringEnabled: boolean,
		trackingEnabled: boolean,
	};
	@Input() btn_text: string;
	public privacyLevel = 'low';
	public score = 0;

	/**
	 * Weight of each score item
	 */
	private scoreWeights = {
		leaksScore: 1.25,
		monitoringEnabled: 1.25,
		trackingEnabled: 1.25,
		passwordStorageScore: 1.25,

		constant: 0
	};

	/**
	 * Calculates score based on parameters
	 *
	 * @param {scoreParameters} params
	 */
	private calculate(params) {
		const leaksScore = this.calculateLeaksScore(params.fixedBreaches, params.unfixedBreaches);
		const passwordStorageScore = this.calculatePasswordStorageScore(params.fixedStorages, params.unfixedStorages);

		return this.calculateScore({
			leaksScore,
			passwordStorageScore,
			monitoringEnabled: params.monitoringEnabled,
			trackingEnabled: params.trackingEnabled,

			constant: 0
		})
	}

	/**
	 * Calculates proportion of 'a' over 'b'
	 *
	 * @param {Number} a
	 * @param {Number} b
	 */
	private calculateProportion(a, b) {
		const total = a + b;
		if (total === 0) return 1;

		return a / total
	}

	/**
	 * Formula to calculate leaks score
	 *
	 * @param {Number} fixedLeaks number of fixed data breaches
	 * @param {Number} unfixedLeaks number of unfixed data breaches
	 */
	private calculateLeaksScore(fixedLeaks, unfixedLeaks) {
		return this.calculateProportion(fixedLeaks, unfixedLeaks)
	}

	/**
	 * Formula to calculate password storage score
	 * @param {Number} safeStorages number of safe password storages
	 * @param {Number} unsafeStorages number of unsafe password storages
	 */
	private calculatePasswordStorageScore(safeStorages, unsafeStorages) {
		return this.calculateProportion(safeStorages, unsafeStorages)
	}

	/**
	 *
	 * Formula to calculate privacy score
	 *
	 * @param {int} leaksScore range from 0-1
	 * @param {int} monitoringEnabled range from 0-1
	 * @param {int} trackingEnabled  range from 0-1
	 * @param {int} passwordStorageScore range from 0-1
	 */
	private calculateScore(scoreItems) {
		const scoreTotalReducer = (total, key) => total + scoreItems[key] * this.scoreWeights[key];
		const scoreItemsKeys = Object.keys(scoreItems);

		let totalScore = scoreItemsKeys.reduce(scoreTotalReducer, 0);

		return Math.round(totalScore / scoreItemsKeys.length * 100)
	}

	ngOnInit() {
		const score = this.calculate(this.scoreParameters);
		this.score = score;
		if (score < 45) {
			this.privacyLevel = 'low';
		} else if (score < 80) {
			this.privacyLevel = 'medium';
		} else {
			this.privacyLevel = 'high';
		}
	}

}
