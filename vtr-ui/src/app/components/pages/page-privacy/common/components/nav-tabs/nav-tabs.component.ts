import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserDataGetStateService } from '../../services/user-data-get-state.service';
import { CountNumberOfIssuesService } from '../../services/count-number-of-issues.service';
import { combineLatest } from 'rxjs';
import { FeatureSettings, NavTabsService } from './nav-tabs.service';
import { takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';
import { FeaturesStatuses } from '../../../userDataStatuses';

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
			takeUntil(instanceDestroyed(this)),
		).subscribe(([userDataStatuses, breachedAccountsCount, websiteTrackersCount, nonPrivatePasswordCount]) => {
			const { breachedAccountsResult, websiteTrackersResult, nonPrivatePasswordResult } = userDataStatuses;
			const breachesConfig = {
				...this.navTabsService.tabsConfig.breaches[breachedAccountsResult],
				issuesCount: this.getDisplayedCountValueOfIssues(breachedAccountsResult, breachedAccountsCount),
				state: breachedAccountsResult,
				routerLink: './breaches',
				title: 'Breached Accounts',
			};
			const trackersConfig = {
				...this.navTabsService.tabsConfig.trackers[websiteTrackersResult],
				issuesCount: this.getDisplayedCountValueOfIssues(websiteTrackersResult, websiteTrackersCount),
				state: websiteTrackersResult,
				routerLink: './trackers',
				title: 'Visible to Tracking tools',
			};
			const passwordsConfig = {
				...this.navTabsService.tabsConfig.passwords[nonPrivatePasswordResult],
				issuesCount: this.getDisplayedCountValueOfIssues(nonPrivatePasswordResult, nonPrivatePasswordCount),
				state: nonPrivatePasswordResult,
				routerLink: './browser-accounts',
				title: 'Non-Private Passwords',
			};
			this.featurePagesConfig = [breachesConfig, trackersConfig, passwordsConfig];
		});
	}

	private getDisplayedCountValueOfIssues(status, issuesCount) {
		switch (status) {
			case FeaturesStatuses.exist:
				return issuesCount;
			case FeaturesStatuses.none:
				return 0;
			case FeaturesStatuses.undefined:
				return '';
			default:
				return '';
		}
	}

	ngOnDestroy() {
	}
}
