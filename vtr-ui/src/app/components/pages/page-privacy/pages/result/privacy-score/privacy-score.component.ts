import { Component, OnDestroy, OnInit } from '@angular/core';
import { PrivacyScoreService } from './privacy-score.service';
import { map, takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';
import { CommunicationWithFigleafService } from '../../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { AppStatuses } from '../../../userDataStatuses';
import { combineLatest } from 'rxjs';
import { ScoreShowSpinnerService } from './score-show-spinner.service';
import { AppStatusesService } from '../../../common/services/app-statuses/app-statuses.service';
import { VantageCommunicationService } from '../../../common/services/vantage-communication.service';
import {
	TaskActionWithTimeoutService,
	TasksName
} from '../../../common/services/analytics/task-action-with-timeout.service';
import { CommonPopupService } from '../../../common/services/popups/common-popup.service';

@Component({
	selector: 'vtr-privacy-score',
	templateUrl: './privacy-score.component.html',
	styleUrls: ['./privacy-score.component.scss'],
})
export class PrivacyScoreComponent implements OnInit, OnDestroy {
	title: string;
	text: string;
	privacyLevel: string;
	score: number;
	defaultScoreImageUrl = '/assets/images/privacy-tab/Main_icon.png';

	isShowScore$ = this.scoreShowSpinnerService.isShow$;

	appState$ = this.appStatusesService.globalStatus$.pipe(
		map((userDataStatus) => userDataStatus.appState)
	);

	isFirstTimeVisitor$ = this.appState$.pipe(map((appState) => appState === AppStatuses.firstTimeVisitor));

	appStatuses = AppStatuses;

	constructor(
		private privacyScoreService: PrivacyScoreService,
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private appStatusesService: AppStatusesService,
		private vantageCommunicationService: VantageCommunicationService,
		private taskActionWithTimeoutService: TaskActionWithTimeoutService,
		private scoreShowSpinnerService: ScoreShowSpinnerService,
		private commonPopupService: CommonPopupService) {
	}

	ngOnInit() {
		combineLatest([
			this.privacyScoreService.newPrivacyScore$,
			this.appState$
		]).pipe(
			takeUntil(instanceDestroyed(this)),
		).subscribe(([score, appState]) => {
			this.setDataAccordingToScore(score, appState);

			if (appState === this.appStatuses.scanPerformed) {
				this.taskActionWithTimeoutService.finishedAction(TasksName.scoreScanAction);
			}
		});
	}

	ngOnDestroy() {
	}

	setDataAccordingToScore(score: number, appState: AppStatuses) {
		const {privacyLevel, title, text} = this.privacyScoreService.getStaticDataAccordingToScore(score, appState);
		this.score = score;
		this.privacyLevel = privacyLevel;
		this.title = title;
		this.text = text;
	}

	openPopUp(popUpID) {
		this.commonPopupService.open(popUpID);
		this.taskActionWithTimeoutService.startAction(TasksName.scoreScanAction);
	}
}
