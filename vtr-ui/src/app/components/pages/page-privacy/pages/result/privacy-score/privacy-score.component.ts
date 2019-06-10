import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonPopupService } from '../../../common/services/popups/common-popup.service';
import { PrivacyScoreService } from './privacy-score.service';
import { takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';
import { CommunicationWithFigleafService } from '../../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { VantageCommunicationService } from '../../../common/services/vantage-communication.service';

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
	styleUrls: ['./privacy-score.component.scss'],
})
export class PrivacyScoreComponent implements OnInit, OnDestroy {
	scoreParametrs: ScoreParametrs = {
		fixedBreaches: 0,
		unfixedBreaches: 0,
		fixedStorages: 0,
		unfixedStorages: 0,
		monitoringEnabled: false,
		trackingEnabled: false,
	};

	// default data
	title = 'Find out your privacy score';
	text = `Your Lenovo is designed to put you
			in control of your privacy. It all
			starts with simple tools to show you how
			private you are online.`;
	btn_text = 'Define my score';
	privacyLevel = 'undefined';
	defaultScoreImageUrl = '/assets/images/privacy-tab/Main_icon.svg';
	score = 0;

	clickEventName = 'UnderstandMyScoreButton';

	constructor(
		private privacyScoreService: PrivacyScoreService,
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private vantageCommunicationService: VantageCommunicationService,
		private changeDetectorRef: ChangeDetectorRef,
		private commonPopupService: CommonPopupService) {
	}

	ngOnInit() {
		this.privacyScoreService.getScoreParametrs()
			.pipe(
				takeUntil(instanceDestroyed(this)),
			)
			.subscribe((scoreParametrs: ScoreParametrs) => {
				this.scoreParametrs = scoreParametrs;
				this.setDataAccordingToScore(scoreParametrs);
				this.changeDetectorRef.detectChanges();
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
