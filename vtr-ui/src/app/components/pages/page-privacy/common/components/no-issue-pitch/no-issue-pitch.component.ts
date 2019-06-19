import { Component, OnDestroy, OnInit } from '@angular/core';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';
import { RouterChangeHandlerService } from '../../services/router-change-handler.service';
import { CommunicationWithFigleafService } from '../../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { CountNumberOfIssuesService } from '../../services/count-number-of-issues.service';
import { combineLatest, Observable, of } from 'rxjs';
import { RoutersName } from '../../../privacy-routing-name';
import { FeaturesStatuses } from '../../../userDataStatuses';
import { UserDataGetStateService } from '../../services/user-data-get-state.service';

@Component({
	selector: 'vtr-no-issue-pitch',
	templateUrl: './no-issue-pitch.component.html',
	styleUrls: ['./no-issue-pitch.component.scss']
})
export class NoIssuePitchComponent implements OnInit, OnDestroy {
	isShowPitch$ = of(false);
	private isFigleafReadyForCommunication$ = this.communicationWithFigleafService.isFigleafReadyForCommunication$;
	private breachedAccountsCount$ = this.countNumberOfIssuesService.breachedAccountsCount;
	private breachedAccountsWasScanned$ = this.getState('breachedAccountsResult');

	private trackersCount$ = this.countNumberOfIssuesService.websiteTrackersCount;
	private trackersWasScanned$ = this.getState('websiteTrackersResult');

	private nonPrivatePasswordCount$ = this.countNumberOfIssuesService.nonPrivatePasswordCount;
	private nonPrivatePasswordWasScanned$ = this.getState('nonPrivatePasswordResult');

	private breachesNoIssues$ = this.generateState(
		this.isFigleafReadyForCommunication$,
		this.breachedAccountsCount$,
		this.breachedAccountsWasScanned$
	);

	private trackersNoIssues$ = this.generateState(
		this.isFigleafReadyForCommunication$,
		this.trackersCount$,
		this.trackersWasScanned$
	);

	private nonPrivatePasswordNoIssues$ = this.generateState(
		this.isFigleafReadyForCommunication$,
		this.nonPrivatePasswordCount$,
		this.nonPrivatePasswordWasScanned$
	);

	private noIssues: {[path in RoutersName]?: Observable<boolean>} = {
		[RoutersName.TRACKERS]: this.trackersNoIssues$,
		[RoutersName.BREACHES]: this.breachesNoIssues$,
		[RoutersName.BROWSERACCOUNTS]: this.nonPrivatePasswordNoIssues$,
	};

	constructor(
		private routerChangeHandlerService: RouterChangeHandlerService,
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private countNumberOfIssuesService: CountNumberOfIssuesService,
		private userDataGetStateService: UserDataGetStateService
	) {
	}

	ngOnInit() {
		this.routerChangeHandlerService.onChange$
			.pipe(takeUntil(instanceDestroyed(this)))
			.subscribe(
				(currentPath) => this.isShowPitch$ = this.noIssues[currentPath]
			);
	}

	ngOnDestroy() {}

	private getState(userStatuses: string) {
		return this.userDataGetStateService.userDataStatus$.pipe(
			map((userDataStatus) =>
				userDataStatus[userStatuses] !== FeaturesStatuses.undefined &&
				userDataStatus[userStatuses] !== FeaturesStatuses.error),
			distinctUntilChanged(),
		);
	}

	private generateState(
		isFigleafReadyForCommunication$: Observable<boolean>,
		countOfIssue$: Observable<number>,
		wasScanned$: Observable<boolean>
	) {
		return combineLatest([
			isFigleafReadyForCommunication$,
			countOfIssue$,
			wasScanned$
		]).pipe(
			map(([isFigleafReadyForCommunication, countOfIssue, wasScanned]) =>
				!isFigleafReadyForCommunication && countOfIssue === 0 && wasScanned)
		);
	}
}
