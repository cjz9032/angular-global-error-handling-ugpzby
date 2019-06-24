import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserDataGetStateService } from '../../services/user-data-get-state.service';
import { CountNumberOfIssuesService } from '../../services/count-number-of-issues.service';
import { combineLatest } from 'rxjs';
import { FeatureSettings, NavTabsService } from './nav-tabs.service';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';
import { getDisplayedCountValueOfIssues } from '../../../utils/helpers';

@Component({
	selector: 'vtr-nav-tabs',
	templateUrl: './nav-tabs.component.html',
	styleUrls: ['./nav-tabs.component.scss']
})
export class NavTabsComponent implements OnInit, OnDestroy {
	featurePagesConfig: FeatureSettings[] = [];

	constructor(
		private userDataGetStateService: UserDataGetStateService,
		private navTabsService: NavTabsService,
		private countNumberOfIssuesService: CountNumberOfIssuesService) {
	}

	ngOnInit() {
		this.userDataGetStateService.userDataStatus$.pipe(
			userDataStatus$ => combineLatest(userDataStatus$, ...this.countNumberOfIssuesService.getPrivacyIssuesCount()),
			distinctUntilChanged(),
			takeUntil(instanceDestroyed(this)),
		).subscribe(([userDataStatuses, breachedAccountsCount, websiteTrackersCount, nonPrivatePasswordCount]) => {
			const { breachedAccountsResult, websiteTrackersResult, nonPrivatePasswordResult } = userDataStatuses;
			const breachesConfig = {
				...this.navTabsService.tabsConfig.breaches[breachedAccountsResult],
				issuesCount: getDisplayedCountValueOfIssues(breachedAccountsResult, breachedAccountsCount),
				state: breachedAccountsResult,
				routerLink: './breaches',
				title: 'Breached Accounts',
			};
			const trackersConfig = {
				...this.navTabsService.tabsConfig.trackers[websiteTrackersResult],
				issuesCount: getDisplayedCountValueOfIssues(websiteTrackersResult, websiteTrackersCount),
				state: websiteTrackersResult,
				routerLink: './trackers',
				title: 'Visible to Tracking tools',
			};
			const passwordsConfig = {
				...this.navTabsService.tabsConfig.passwords[nonPrivatePasswordResult],
				issuesCount: getDisplayedCountValueOfIssues(nonPrivatePasswordResult, nonPrivatePasswordCount),
				state: nonPrivatePasswordResult,
				routerLink: './browser-accounts',
				title: 'Non-Private Passwords',
			};
			this.featurePagesConfig = [breachesConfig, trackersConfig, passwordsConfig];
		});
	}

	ngOnDestroy() {
	}
}
