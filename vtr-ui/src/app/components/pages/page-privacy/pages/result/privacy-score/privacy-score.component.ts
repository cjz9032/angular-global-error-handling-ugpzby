import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonPopupService } from '../../../common/services/popups/common-popup.service';
import { PrivacyScoreService } from './privacy-score.service';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';
import { CommunicationWithFigleafService } from '../../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { VantageCommunicationService } from '../../../common/services/vantage-communication.service';
import { UserDataGetStateService } from '../../../common/services/user-data-get-state.service';
import { AppStatuses } from '../../../userDataStatuses';
import { combineLatest } from 'rxjs';

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
	btn_text = 'Define my score';
	privacyLevel = 'undefined';
	defaultScoreImageUrl = '/assets/images/privacy-tab/Main_icon.svg';
	score;

	isFirstTimeVisitor$ = this.userDataGetStateService.userDataStatus$.pipe(
		map((userDataStatus) => userDataStatus.appState === AppStatuses.firstTimeVisitor)
	);

	clickEventName = 'UnderstandMyScoreButton';

	constructor(
		private privacyScoreService: PrivacyScoreService,
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private userDataGetStateService: UserDataGetStateService,
		private vantageCommunicationService: VantageCommunicationService,
		private changeDetectorRef: ChangeDetectorRef,
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
	}
}
