import { Component, OnInit } from '@angular/core';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { UserAllowService } from '../../core/services/user-allow.service';
import { CountNumberOfIssuesService } from '../../core/services/count-number-of-issues.service';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { FeaturesStatuses } from '../../userDataStatuses';
import { UserDataStateService } from '../../core/services/app-statuses/user-data-state.service';
import { getDisplayedCountValueOfIssues } from '../../utils/helpers';
import { VantageCommunicationService } from '../../core/services/vantage-communication.service';
import { TrackingMapService } from '../../feature/tracking-map/services/tracking-map.service';
import {
	TaskActionWithTimeoutService,
	TasksName
} from '../../core/services/analytics/task-action-with-timeout.service';
import { AppStatusesService } from '../../core/services/app-statuses/app-statuses.service';
import { Features } from '../../core/components/nav-tabs/nav-tabs.service';
import { AbTestsName } from '../../utils/ab-test/ab-tests.type';

@Component({
	// selector: 'app-admin',
	templateUrl: './trackers.component.html',
	styleUrls: ['./trackers.component.scss']
})
export class TrackersComponent implements OnInit {
	trackersFeatureName = Features.trackers;
	isConsentGiven$ = this.userAllowService.allowToShow.pipe(map((value) => value['trackingMap']));
	websiteTrackersCount$ = this.countNumberOfIssuesService.websiteTrackersCount.pipe(
		map((issueCount) => (getDisplayedCountValueOfIssues(this.userDataStateService.websiteTrackersResult, issueCount)) || 0),
		startWith(0),
		distinctUntilChanged()
	);
	isFigleafReadyForCommunication$ = this.communicationWithFigleafService.isFigleafReadyForCommunication$;
	isWebsiteTrackersWasScanned$ = this.appStatusesService.globalStatus$.pipe(
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
		noIssuesTitle: 'No tracking tools found',
		noIssuesDescription: 'It’s either because you’re using a new PC or you cleared your browser history. You can come back here anytime for updated tracking tools information.'
	};

	tryProductText = {
		risk: 'While some tracking tools are designed to personalize your ' +
			'experience, many collect your IP address, location, social profile, shopping history, ' +
			'and interests – and then sell this information to the highest bidder.',
		howToFix: 'We recommend a tracking tools blocker, like the one in ' +
			'Lenovo Privacy Essentials by FigLeaf, because turning on the “Do Not Track” ' +
			'feature in your browser isn’t enough.',
		riskAfterInstallFigleaf: 'While some tracking tools are designed to personalize your ' +
			'experience, many collect your IP address, location, social profile, shopping history, ' +
			'and interests – and then sell this information to the highest bidder.',
		howToFixAfterInstallFigleaf: 'Turn on \'Block trackers\' functionality for websites you choose ' +
			'in Lenovo Privacy Essentials by Figleaf.'
	};

	textForTooltip = 'Your private information is being collected and shared without your permission. ' +
		'You allowed us to scan your browsing history, and we found that you\'ve visited sites ' +
		'that frequently use tracking tools.';

	currentTests = AbTestsName;

	constructor(
		private userAllowService: UserAllowService,
		private countNumberOfIssuesService: CountNumberOfIssuesService,
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private appStatusesService: AppStatusesService,
		private userDataStateService: UserDataStateService,
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

