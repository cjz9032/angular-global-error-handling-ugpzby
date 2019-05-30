import { Component, OnInit } from '@angular/core';
import { UserDataGetStateService } from '../../services/user-data-get-state.service';
import { FeaturesStatuses } from '../../../userDataStatuses';
import { CountNumberOfIssuesService } from '../../services/count-number-of-issues.service';
import { combineLatest } from 'rxjs';

interface FeatureSettings {
	state: string;
	image: string;
	image2x: string;
	issuesCount?: number;
}

interface TabsConfig {
	breaches: {
		[status in FeaturesStatuses]: FeatureSettings
	};
	trackers: {
		[status in FeaturesStatuses]: FeatureSettings
	};
	passwords: {
		[status in FeaturesStatuses]: FeatureSettings
	};
}

@Component({
	selector: 'vtr-nav-tabs',
	templateUrl: './nav-tabs.component.html',
	styleUrls: ['./nav-tabs.component.scss']
})
export class NavTabsComponent implements OnInit {
	tabsConfig: TabsConfig = {
		breaches: {
			[FeaturesStatuses.undefined]: {
				state: 'undefined',
				image: '/assets/images/privacy-tab/nav-tabs/Breach/Unknown.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Breach/Unknown@2x.png',
			},
			[FeaturesStatuses.exist]: {
				state: 'exist',
				image: '/assets/images/privacy-tab/nav-tabs/Breach/Bad.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Breach/Bad@2x.png',
			},
			[FeaturesStatuses.none]: {
				state: 'none',
				image: '/assets/images/privacy-tab/nav-tabs/Breach/Good.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Breach/Good@2x.png',
			},
			[FeaturesStatuses.error]: {
				state: 'undefined',
				image: '/assets/images/privacy-tab/nav-tabs/Breach/Unknown.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Breach/Unknown@2x.png',
			},
		},
		trackers: {
			[FeaturesStatuses.undefined]: {
				state: 'undefined',
				image: '/assets/images/privacy-tab/nav-tabs/Tracker/Unknown.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Tracker/Unknown@2x.png',
			},
			[FeaturesStatuses.exist]: {
				state: 'exist',
				image: '/assets/images/privacy-tab/nav-tabs/Tracker/Bad.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Tracker/Bad@2x.png',
			},
			[FeaturesStatuses.none]: {
				state: 'none',
				image: '/assets/images/privacy-tab/nav-tabs/Tracker/Good.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Tracker/Good@2x.png',
			},
			[FeaturesStatuses.error]: {
				state: 'undefined',
				image: '/assets/images/privacy-tab/nav-tabs/Tracker/Unknown.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Tracker/Unknown@2x.png',
			},
		},
		passwords: {
			[FeaturesStatuses.undefined]: {
				state: 'undefined',
				image: '/assets/images/privacy-tab/nav-tabs/Pass/Unknown.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Pass/Unknown@2x.png',
			},
			[FeaturesStatuses.exist]: {
				state: 'exist',
				image: '/assets/images/privacy-tab/nav-tabs/Pass/Bad.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Pass/Bad@2x.png',
			},
			[FeaturesStatuses.none]: {
				state: 'none',
				image: '/assets/images/privacy-tab/nav-tabs/Pass/Good.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Pass/Good@2x.png',
			},
			[FeaturesStatuses.error]: {
				state: 'undefined',
				image: '/assets/images/privacy-tab/nav-tabs/Pass/Unknown.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Pass/Unknown@2x.png',
			},
		},
	};
	breachesConfig = this.tabsConfig.breaches[FeaturesStatuses.undefined];
	trackersConfig = this.tabsConfig.trackers[FeaturesStatuses.undefined];
	passwordsConfig = this.tabsConfig.passwords[FeaturesStatuses.undefined];

	constructor(
		private userDataGetStateService: UserDataGetStateService,
		private countNumberOfIssuesService: CountNumberOfIssuesService) {
	}

	ngOnInit() {
		this.userDataGetStateService.userDataStatus$.pipe(
			userDataStatus$ => combineLatest(userDataStatus$, ...this.countNumberOfIssuesService.getPrivacyIssuesCount()),
		).subscribe(([userDataStatuses, breachedAccountsCount, websiteTrackersCount, nonPrivatePasswordCount]) => {
			this.breachesConfig = {...this.tabsConfig.breaches[userDataStatuses.breachedAccountsResult], issuesCount: breachedAccountsCount};
			this.trackersConfig = {...this.tabsConfig.trackers[userDataStatuses.websiteTrackersResult], issuesCount: websiteTrackersCount};
			this.passwordsConfig = {...this.tabsConfig.passwords[userDataStatuses.nonPrivatePasswordResult], issuesCount: nonPrivatePasswordCount};
		});
	}

}
