import { Component, OnInit } from '@angular/core';
import { UserDataGetStateService } from '../../services/user-data-get-state.service';
import { CountNumberOfIssuesService } from '../../services/count-number-of-issues.service';
import { combineLatest } from 'rxjs';
import { NavTabsService } from './nav-tabs.service';

@Component({
	selector: 'vtr-nav-tabs',
	templateUrl: './nav-tabs.component.html',
	styleUrls: ['./nav-tabs.component.scss']
})
export class NavTabsComponent implements OnInit {
	featurePagesConfig = [];

	constructor(
		private userDataGetStateService: UserDataGetStateService,
		private navTabsService: NavTabsService,
		private countNumberOfIssuesService: CountNumberOfIssuesService) {
	}

	ngOnInit() {
		this.userDataGetStateService.userDataStatus$.pipe(
			userDataStatus$ => combineLatest(userDataStatus$, ...this.countNumberOfIssuesService.getPrivacyIssuesCount()),
		).subscribe(([userDataStatuses, breachedAccountsCount, websiteTrackersCount, nonPrivatePasswordCount]) => {
			const breachesConfig = {
				...this.navTabsService.tabsConfig.breaches[userDataStatuses.breachedAccountsResult],
				issuesCount: breachedAccountsCount,
				state: userDataStatuses.breachedAccountsResult,
				routerLink: './breaches',
			};
			const trackersConfig = {
				...this.navTabsService.tabsConfig.trackers[userDataStatuses.websiteTrackersResult],
				issuesCount: websiteTrackersCount,
				state: userDataStatuses.websiteTrackersResult,
				routerLink: './trackers',
			};
			const passwordsConfig = {
				...this.navTabsService.tabsConfig.passwords[userDataStatuses.nonPrivatePasswordResult],
				issuesCount: nonPrivatePasswordCount,
				state: userDataStatuses.nonPrivatePasswordResult,
				routerLink: './browser-accounts',
			};
			this.featurePagesConfig = [breachesConfig, trackersConfig, passwordsConfig];
		});
	}

}
