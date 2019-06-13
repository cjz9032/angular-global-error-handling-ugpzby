import { Component } from '@angular/core';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { UserAllowService } from '../../common/services/user-allow.service';
import { CountNumberOfIssuesService } from '../../common/services/count-number-of-issues.service';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { FeaturesStatuses } from '../../userDataStatuses';
import { UserDataGetStateService } from '../../common/services/user-data-get-state.service';

@Component({
	// selector: 'app-admin',
	templateUrl: './trackers.component.html',
	styleUrls: ['./trackers.component.scss']
})
export class TrackersComponent {
	isConsentGiven$ = this.userAllowService.allowToShow.pipe(map((value) => value['trackingMap']));
	websiteTrackersCount$ = this.countNumberOfIssuesService.websiteTrackersCount.pipe(
		startWith(0)
	);
	isFigleafInstalled$ = this.communicationWithFigleafService.isFigleafReadyForCommunication$;
	isWebsiteTrackersWasScanned$ = this.userDataGetStateService.userDataStatus$.pipe(
		map((userDataStatus) =>
			userDataStatus.websiteTrackersResult !== FeaturesStatuses.undefined &&
			userDataStatus.websiteTrackersResult !== FeaturesStatuses.error),
		distinctUntilChanged(),
	);

	textForFeatureHeader = {
		title: 'Check for tracking tools',
		figleafInstalled: 'Lenovo Privacy by FigLeaf has blocked trackers on sites within the green bubble below, keeping you private ' +
			'while you do the things you love online.',
		figleafUninstalled: 'Some websites use tracking tools to collect information about you. ' +
			'They may share it with third-party partners without notifying you.',
	};

	tryProductText = {
		risk: 'Most websites collect your IP address, location, social profile information, ' +
			'and even shopping history to personalize your experience, show targeted ads, ' +
			'or suggest things based on your interests.',
		howToFix: 'You can block some tracking tools by turning on the ‘Do Not Track’ feature in your browser. ' +
			'Or install Lenovo Privacy by FigLeaf and block them ' +
			'completely from collecting your personal information.'
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

