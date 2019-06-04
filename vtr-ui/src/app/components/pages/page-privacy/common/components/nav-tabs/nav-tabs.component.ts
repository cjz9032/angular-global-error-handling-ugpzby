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
			const breachedAccountsStatus = userDataStatuses.breachedAccountsResult;
			const websiteTrackersStatus = userDataStatuses.websiteTrackersResult;
			const nonPrivatePasswordStatus = userDataStatuses.nonPrivatePasswordResult;
			const breachesConfig = {
				...this.navTabsService.tabsConfig.breaches[breachedAccountsStatus],
				issuesCount: this.getDisplayedCountValueOfIssues(breachedAccountsStatus, breachedAccountsCount),
				state: breachedAccountsStatus,
				routerLink: './breaches',
				title: 'Breached Accounts',
			};
			const trackersConfig = {
				...this.navTabsService.tabsConfig.trackers[websiteTrackersStatus],
				issuesCount: this.getDisplayedCountValueOfIssues(websiteTrackersStatus, websiteTrackersCount),
				state: websiteTrackersStatus,
				routerLink: './trackers',
				title: 'Visible to Online Trackers',
			};
			const passwordsConfig = {
				...this.navTabsService.tabsConfig.passwords[nonPrivatePasswordStatus],
				issuesCount: this.getDisplayedCountValueOfIssues(nonPrivatePasswordStatus, nonPrivatePasswordCount),
				state: nonPrivatePasswordStatus,
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
		}
	}

	ngOnDestroy() {
	}
}
