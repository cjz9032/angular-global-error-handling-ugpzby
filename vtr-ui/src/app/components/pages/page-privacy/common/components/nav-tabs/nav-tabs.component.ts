import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserDataGetStateService } from '../../services/user-data-get-state.service';
import { CountNumberOfIssuesService } from '../../services/count-number-of-issues.service';
import { combineLatest } from 'rxjs';
import { FeatureSettings, NavTabsService } from './nav-tabs.service';
import { takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';

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
			const breachesConfig = {
				...this.navTabsService.tabsConfig.breaches[userDataStatuses.breachedAccountsResult],
				issuesCount: breachedAccountsCount,
				state: userDataStatuses.breachedAccountsResult,
				routerLink: './breaches',
				title: 'Breached Accounts',
			};
			const trackersConfig = {
				...this.navTabsService.tabsConfig.trackers[userDataStatuses.websiteTrackersResult],
				issuesCount: websiteTrackersCount,
				state: userDataStatuses.websiteTrackersResult,
				routerLink: './trackers',
				title: 'Visible to Online Trackers',
			};
			const passwordsConfig = {
				...this.navTabsService.tabsConfig.passwords[userDataStatuses.nonPrivatePasswordResult],
				issuesCount: nonPrivatePasswordCount,
				state: userDataStatuses.nonPrivatePasswordResult,
				routerLink: './browser-accounts',
				title: 'Non-Private Passwords',
			};
			this.featurePagesConfig = [breachesConfig, trackersConfig, passwordsConfig];
		});
	}

	ngOnDestroy() {
	}

}
