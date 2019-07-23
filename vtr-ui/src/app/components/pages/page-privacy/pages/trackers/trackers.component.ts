import { Component, OnInit } from '@angular/core';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { UserAllowService } from '../../common/services/user-allow.service';
import { CountNumberOfIssuesService } from '../../common/services/count-number-of-issues.service';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { FeaturesStatuses } from '../../userDataStatuses';
import { UserDataGetStateService } from '../../common/services/user-data-get-state.service';
import { getDisplayedCountValueOfIssues } from '../../utils/helpers';
import { VantageCommunicationService } from '../../common/services/vantage-communication.service';
import { TrackingMapService } from '../../feature/tracking-map/services/tracking-map.service';
import {
	TaskActionWithTimeoutService,
	TasksName
} from '../../common/services/analytics/task-action-with-timeout.service';

@Component({
	// selector: 'app-admin',
	templateUrl: './trackers.component.html',
	styleUrls: ['./trackers.component.scss']
})
export class TrackersComponent implements OnInit {
	isConsentGiven$ = this.userAllowService.allowToShow.pipe(map((value) => value['trackingMap']));
	websiteTrackersCount$ = this.countNumberOfIssuesService.websiteTrackersCount.pipe(
		map((issueCount) => (getDisplayedCountValueOfIssues(this.userDataGetStateService.websiteTrackersResult, issueCount)) || 0),
		startWith(0),
		distinctUntilChanged()
	);
	isFigleafReadyForCommunication$ = this.communicationWithFigleafService.isFigleafReadyForCommunication$;
	isWebsiteTrackersWasScanned$ = this.userDataGetStateService.userDataStatus$.pipe(
		map((userDataStatus) =>
			userDataStatus.websiteTrackersResult !== FeaturesStatuses.undefined &&
			userDataStatus.websiteTrackersResult !== FeaturesStatuses.error),
		distinctUntilChanged(),
	);
	isTrackersBlocked$ = this.trackingMapService.isTrackersBlocked$;

	textForFeatureHeader = {
		title: 'Check for tracking tools',
		figleafTitle: 'Tracking tools you should know about',
		figleafInstalled: 'Learn more about tracking tools that Lenovo Privacy Essentials by FigLeaf blocked on websites you visit.',
		figleafUninstalled: 'Some websites use tracking tools to collect information about you. ' +
			'They may share it with third-party partners without notifying you.',
	};

	tryProductText = {
		risk: 'While some tracking tools are designed to personalize your ' +
			'experience, many collect your IP address, location, social profile, shopping history, ' +
			'and interests – and then sell this information to the highest bidder',
		howToFix: 'We recommend a tracking tools blocker, like the one in ' +
			'Lenovo Privacy Essentials by FigLeaf, because turning on the “Do Not Track” ' +
			'feature in your browser isn’t enough.',
		riskAfterInstallFigleaf: 'While some tracking tools are designed to personalize your ' +
			'experience, many collect your IP address, location, social profile, shopping history, ' +
			'and interests – and then sell this information to the highest bidder',
		howToFixAfterInstallFigleaf: 'Turn on \'Block trackers\' functionality for websites you choose ' +
			'in Lenovo Privacy Essentials by Figleaf.'
	};

	textForTooltip = 'Your private information is being collected and shared without your permission. ' +
		'You allowed us to scan your browsing history, and we found that you\'ve visited sites ' +
		'that frequently use tracking tools.';

	constructor(
		private userAllowService: UserAllowService,
		private countNumberOfIssuesService: CountNumberOfIssuesService,
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private userDataGetStateService: UserDataGetStateService,
		private vantageCommunicationService: VantageCommunicationService,
		private trackingMapService: TrackingMapService,
		private taskActionWithTimeoutService: TaskActionWithTimeoutService,
	) {	}

	ngOnInit() {
		this.trackingMapService.update();
	}

	giveConcent() {
		this.userAllowService.setShowTrackingMap(true);
		this.taskActionWithTimeoutService.startAction(TasksName.getTrackingDataAction);
	}

	openFigleafApp() {
		this.vantageCommunicationService.openFigleafByUrl('lenovoprivacy:');
	}
}

