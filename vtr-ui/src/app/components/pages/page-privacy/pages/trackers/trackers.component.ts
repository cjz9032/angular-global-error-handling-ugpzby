import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { UserAllowService } from '../../common/services/user-allow.service';
import { CountNumberOfIssuesService } from '../../common/services/count-number-of-issues.service';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';

@Component({
	// selector: 'app-admin',
	templateUrl: './trackers.component.html',
	styleUrls: ['./trackers.component.scss']
})
export class TrackersComponent {
	isConsentGiven$ = this.userAllowService.allowToShow.pipe(map((value) => value['trackingMap']));
	websiteTrackersCount$ = this.countNumberOfIssuesService.websiteTrackersCount;
	isFigleafInstalled$ = this.communicationWithFigleafService.isFigleafReadyForCommunication$;
	isUserData = true;

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
		private communicationWithFigleafService: CommunicationWithFigleafService
	){
	}

	ngOnInit() {

	}

	giveConcent() {
		this.userAllowService.setShowTrackingMap(true);
	}
}

