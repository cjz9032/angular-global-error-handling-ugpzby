import { Component } from '@angular/core';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { FeaturesStatuses } from '../../userDataStatuses';
import { UserDataGetStateService } from '../../common/services/user-data-get-state.service';
import { BrowserAccountsService } from '../../common/services/browser-accounts.service';
import { CountNumberOfIssuesService } from '../../common/services/count-number-of-issues.service';
import { VantageCommunicationService } from '../../common/services/vantage-communication.service';
import { FigleafOverviewService } from '../../common/services/figleaf-overview.service';
import {
	TaskActionWithTimeoutService,
	TasksName
} from '../../common/services/analytics/task-action-with-timeout.service';

@Component({
	// selector: 'app-admin',
	templateUrl: './browser-accounts.component.html',
	styleUrls: ['./browser-accounts.component.scss']
})
export class BrowserAccountsComponent {
	browserStoredAccountsData = {showDetailAction: 'expand'};
	isFigleafReadyForCommunication$ = this.communicationWithFigleafService.isFigleafReadyForCommunication$;
	isNonPrivatePasswordWasScanned$ = this.userDataGetStateService.userDataStatus$.pipe(
		map((userDataStatus) =>
			userDataStatus.nonPrivatePasswordResult !== FeaturesStatuses.undefined &&
			userDataStatus.nonPrivatePasswordResult !== FeaturesStatuses.error),
		distinctUntilChanged(),
	);
	nonPrivatePasswordCount$ = this.countNumberOfIssuesService.nonPrivatePasswordCount;
	dashboardData$ = this.figleafOverviewService.figleafDashboard$;
	isConsentToGetBrowsersAccountsGiven$ = this.browserAccountsService.isConsentGiven$;

	constructor(
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private userDataGetStateService: UserDataGetStateService,
		private browserAccountsService: BrowserAccountsService,
		private countNumberOfIssuesService: CountNumberOfIssuesService,
		private vantageCommunicationService: VantageCommunicationService,
		private figleafOverviewService: FigleafOverviewService,
		private taskActionWithTimeoutService: TaskActionWithTimeoutService
	) {
	}

	giveConcentToGetBrowserAccounts() {
		this.browserAccountsService.giveConcent();
		this.taskActionWithTimeoutService.startAction(TasksName.getNonPrivateStoragesAction);
	}

	openFigleafApp() {
		this.vantageCommunicationService.openFigleafByUrl('lenovoprivacy:');
	}
}
