import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonPopupService } from '../../../common/services/popups/common-popup.service';
import { PrivacyScoreService } from './privacy-score.service';
import { filter, map, takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';
import { CommunicationWithFigleafService } from '../../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { VantageCommunicationService } from '../../../common/services/vantage-communication.service';
import { AppStatuses } from '../../../userDataStatuses';
import { combineLatest } from 'rxjs';
import {
	TaskActionWithTimeoutService,
	TasksName
} from '../../../common/services/analytics/task-action-with-timeout.service';
import { AppStatusesService } from '../../../common/services/app-statuses/app-statuses.service';

@Component({
	selector: 'vtr-privacy-score',
	templateUrl: './privacy-score.component.html',
	styleUrls: ['./privacy-score.component.scss'],
})
export class PrivacyScoreComponent implements OnInit, OnDestroy {
	// default data
	title = 'Find out your privacy score';
	text = `Your Lenovo is designed to put you
			in control of your privacy. It all
			starts with simple tools to show you how
			private you are online.`;
	btnText = 'Define my score';
	privacyLevel = 'undefined';
	defaultScoreImageUrl = '/assets/images/privacy-tab/Main_icon.svg';
	score;

	isFirstTimeVisitor$ = this.appStatusesService.globalStatus$.pipe(
		map((userDataStatus) => userDataStatus.appState === AppStatuses.firstTimeVisitor)
	);

	constructor(
		private privacyScoreService: PrivacyScoreService,
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private appStatusesService: AppStatusesService,
		private vantageCommunicationService: VantageCommunicationService,
		private changeDetectorRef: ChangeDetectorRef,
		private taskActionWithTimeoutService: TaskActionWithTimeoutService,
		private commonPopupService: CommonPopupService) {
	}

	ngOnInit() {
		combineLatest([
			this.privacyScoreService.newPrivacyScore$,
			this.isFirstTimeVisitor$
		]).pipe(
			filter(([score, isFirstTimeVisitor]) => !isFirstTimeVisitor),
			takeUntil(instanceDestroyed(this)),
		).subscribe(([score]) => {
			this.setDataAccordingToScore(score);
			this.taskActionWithTimeoutService.finishedAction(TasksName.scoreScanAction);
			this.changeDetectorRef.detectChanges();
		});
	}

	ngOnDestroy() {
	}

	setDataAccordingToScore(score) {
		const { privacyLevel, title, text } = this.privacyScoreService.getStaticDataAccordingToScore(score);
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
