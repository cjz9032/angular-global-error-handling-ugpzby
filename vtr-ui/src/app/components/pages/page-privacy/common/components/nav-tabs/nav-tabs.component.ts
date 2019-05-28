import { Component, OnInit } from '@angular/core';
import { UserDataGetStateService } from '../../services/user-data-get-state.service';
import { UserDataStatuses } from '../../../userDataStatuses';
import { CountNumberOfIssuesService } from '../../services/count-number-of-issues.service';

interface FeatureSettings {
	state: string;
	image: string;
	image2x: string;
	issuesCount?: number;
}

interface TabsConfig {
	breaches: {
		[status in UserDataStatuses]: FeatureSettings
	};
	trackers: {
		[status in UserDataStatuses]: FeatureSettings
	};
	passwords: {
		[status in UserDataStatuses]: FeatureSettings
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
			[UserDataStatuses.undefined]: {
				state: 'undefined',
				image: '/assets/images/privacy-tab/nav-tabs/Breach/Unknown.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Breach/Unknown@2x.png',
			},
			[UserDataStatuses.exist]: {
				state: 'exist',
				image: '/assets/images/privacy-tab/nav-tabs/Breach/Bad.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Breach/Bad@2x.png',
			},
			[UserDataStatuses.none]: {
				state: 'none',
				image: '/assets/images/privacy-tab/nav-tabs/Breach/Good.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Breach/Good@2x.png',
			},
			[UserDataStatuses.error]: {
				state: 'undefined',
				image: '/assets/images/privacy-tab/nav-tabs/Breach/Unknown.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Breach/Unknown@2x.png',
			},
		},
		trackers: {
			[UserDataStatuses.undefined]: {
				state: 'undefined',
				image: '/assets/images/privacy-tab/nav-tabs/Tracker/Unknown.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Tracker/Unknown@2x.png',
			},
			[UserDataStatuses.exist]: {
				state: 'exist',
				image: '/assets/images/privacy-tab/nav-tabs/Tracker/Bad.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Tracker/Bad@2x.png',
			},
			[UserDataStatuses.none]: {
				state: 'none',
				image: '/assets/images/privacy-tab/nav-tabs/Tracker/Good.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Tracker/Good@2x.png',
			},
			[UserDataStatuses.error]: {
				state: 'undefined',
				image: '/assets/images/privacy-tab/nav-tabs/Tracker/Unknown.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Tracker/Unknown@2x.png',
			},
		},
		passwords: {
			[UserDataStatuses.undefined]: {
				state: 'undefined',
				image: '/assets/images/privacy-tab/nav-tabs/Pass/Unknown.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Pass/Unknown@2x.png',
			},
			[UserDataStatuses.exist]: {
				state: 'exist',
				image: '/assets/images/privacy-tab/nav-tabs/Pass/Bad.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Pass/Bad@2x.png',
			},
			[UserDataStatuses.none]: {
				state: 'none',
				image: '/assets/images/privacy-tab/nav-tabs/Pass/Good.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Pass/Good@2x.png',
			},
			[UserDataStatuses.error]: {
				state: 'undefined',
				image: '/assets/images/privacy-tab/nav-tabs/Pass/Unknown.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Pass/Unknown@2x.png',
			},
		},
	};
	breachesConfig = this.tabsConfig.breaches[UserDataStatuses.undefined];
	trackersConfig = this.tabsConfig.trackers[UserDataStatuses.undefined];
	passwordsConfig = this.tabsConfig.passwords[UserDataStatuses.undefined];

	constructor(
		private userDataGetStateService: UserDataGetStateService,
		private countNumberOfIssuesService: CountNumberOfIssuesService) {
	}

	ngOnInit() {
		this.userDataGetStateService.userDataStatus$.subscribe((userDataStatuses) => {
			const {breachedAccountsCount, websiteTrackersCount, nonPrivatePasswordCount} = this.countNumberOfIssuesService.getPrivacyIssuesCount();
			this.breachesConfig = {...this.tabsConfig.breaches[userDataStatuses.breachedAccountsResult], issuesCount: breachedAccountsCount};
			this.trackersConfig = {...this.tabsConfig.trackers[userDataStatuses.websiteTrackersResult], issuesCount: websiteTrackersCount};
			this.passwordsConfig = {...this.tabsConfig.passwords[userDataStatuses.nonPrivatePasswordResult], issuesCount: nonPrivatePasswordCount};
		});
	}

}
