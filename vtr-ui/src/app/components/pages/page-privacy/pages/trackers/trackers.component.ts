import { Component } from '@angular/core';
import { distinctUntilChanged, map, startWith, withLatestFrom } from 'rxjs/operators';
import { UserAllowService } from '../../common/services/user-allow.service';
import { CountNumberOfIssuesService } from '../../common/services/count-number-of-issues.service';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { FeaturesStatuses } from '../../userDataStatuses';
import { UserDataGetStateService } from '../../common/services/user-data-get-state.service';
import { getDisplayedCountValueOfIssues } from '../../utils/helpers';

@Component({
	// selector: 'app-admin',
	templateUrl: './trackers.component.html',
	styleUrls: ['./trackers.component.scss']
})
export class TrackersComponent {
	isConsentGiven$ = this.userAllowService.allowToShow.pipe(map((value) => value['trackingMap']));
	websiteTrackersCount$ = this.countNumberOfIssuesService.websiteTrackersCount.pipe(
		map((issueCount) => getDisplayedCountValueOfIssues(this.userDataGetStateService.websiteTrackersResult, issueCount)),
		startWith(0)
	);
	isFigleafReadyForCommunication$ = this.communicationWithFigleafService.isFigleafReadyForCommunication$;
	isWebsiteTrackersWasScanned$ = this.userDataGetStateService.userDataStatus$.pipe(
		map((userDataStatus) =>
			userDataStatus.websiteTrackersResult !== FeaturesStatuses.undefined &&
			userDataStatus.websiteTrackersResult !== FeaturesStatuses.error),
		distinctUntilChanged(),
	);

	textForFeatureHeader = {
		title: 'Check for tracking tools',
		figleafTitle: 'Tracking tools you should know about',
		figleafInstalled: 'Learn more about tracking tools that Lenovo Privacy by FigLeaf blocked on websites you visit.',
		figleafUninstalled: 'Some websites use tracking tools to collect information about you. ' +
			'They may share it with third-party partners without notifying you.',
	};

	tryProductText = {
		risk: 'Most websites collect your IP address, location, social profile information, ' +
			'and even shopping history to personalize your experience, show targeted ads, ' +
			'or suggest things based on your interests.',
		howToFix: 'You can block some tracking tools by turning on the ‘Do Not Track’ feature in your browser. ' +
			'Or install Lenovo Privacy by FigLeaf and block them ' +
			'completely from collecting your personal information.',
		riskAfterInstallFigleaf: 'Most websites collect your IP address, location, social profile information,' +
			' and even shopping history to personalize your experience, show targeted ads, ' +
			'or suggest things based on your interests.',
		howToFixAfterInstallFigleaf: 'Turn on \'Block trackers\' functionality for websites you choose ' +
			'in Lenovo Privacy Essentials by Figleaf.'
	};

	constructor(
		private userAllowService: UserAllowService,
		private countNumberOfIssuesService: CountNumberOfIssuesService,
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private userDataGetStateService: UserDataGetStateService
	) {	}

	giveConcent() {
		this.userAllowService.setShowTrackingMap(true);
	}
}

