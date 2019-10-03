import { Injectable } from '@angular/core';
import { FeaturesStatuses } from '../../../userDataStatuses';

export interface FeatureSettings {
	image: string;
	image2x: string;
	issuesCount?: number;
	state?: FeaturesStatuses;
	routerLink?: string;
	title?: string;
}

export enum Features {
	breaches = 'breaches',
	trackers = 'trackers',
	passwords = 'passwords',
}

type TabsConfig = {
	[feature in Features]: {
		[status in FeaturesStatuses]: FeatureSettings
	};
};

@Injectable({
	providedIn: 'root'
})
export class NavTabsService {

	tabsConfig: TabsConfig = {
		breaches: {
			[FeaturesStatuses.undefined]: {
				image: '/assets/images/privacy-tab/nav-tabs/Breach/Unknown.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Breach/Unknown@2x.png',
			},
			[FeaturesStatuses.exist]: {
				image: '/assets/images/privacy-tab/nav-tabs/Breach/Bad.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Breach/Bad@2x.png',
			},
			[FeaturesStatuses.none]: {
				image: '/assets/images/privacy-tab/nav-tabs/Breach/Good.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Breach/Good@2x.png',
			},
			[FeaturesStatuses.error]: {
				image: '/assets/images/privacy-tab/nav-tabs/Breach/Unknown.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Breach/Unknown@2x.png',
			},
		},
		trackers: {
			[FeaturesStatuses.undefined]: {
				image: '/assets/images/privacy-tab/nav-tabs/Tracker/Unknown.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Tracker/Unknown@2x.png',
			},
			[FeaturesStatuses.exist]: {
				image: '/assets/images/privacy-tab/nav-tabs/Tracker/Bad.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Tracker/Bad@2x.png',
			},
			[FeaturesStatuses.none]: {
				image: '/assets/images/privacy-tab/nav-tabs/Tracker/Good.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Tracker/Good@2x.png',
			},
			[FeaturesStatuses.error]: {
				image: '/assets/images/privacy-tab/nav-tabs/Tracker/Unknown.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Tracker/Unknown@2x.png',
			},
		},
		passwords: {
			[FeaturesStatuses.undefined]: {
				image: '/assets/images/privacy-tab/nav-tabs/Pass/Unknown.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Pass/Unknown@2x.png',
			},
			[FeaturesStatuses.exist]: {
				image: '/assets/images/privacy-tab/nav-tabs/Pass/Bad.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Pass/Bad@2x.png',
			},
			[FeaturesStatuses.none]: {
				image: '/assets/images/privacy-tab/nav-tabs/Pass/Good.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Pass/Good@2x.png',
			},
			[FeaturesStatuses.error]: {
				image: '/assets/images/privacy-tab/nav-tabs/Pass/Unknown.png',
				image2x: '/assets/images/privacy-tab/nav-tabs/Pass/Unknown@2x.png',
			},
		},
	};

	constructor() {
	}
}
