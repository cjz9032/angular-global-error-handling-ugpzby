import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RoutersName } from '../../privacy-routing-name';

@Injectable({
	providedIn: 'root'
})
export class GetParentForAnalyticsService {

	constructor(private router: Router) {
	}

	getParentName(currentElement) {
		return this.getPageName() + this.getParentNodeName(currentElement);
	}

	getParentNodeName(myCurrentElement) {
		var parentNodeName = '';
		return function getParentName(currentElement) {
			const parentNode = currentElement.parentNode;
			const parentName = parentNode.getAttribute('data-analyticsName');
			if (parentName === 'privacy') {
				return parentNodeName;
			}
			if (parentName) {
				parentNodeName = parentName + (parentNodeName && '.') + parentNodeName;
			}
			return getParentName(parentNode);
		}(myCurrentElement);
	}

	getPageName() {
		const route = this.router.url;
		const pageRouteName = route.slice(route.lastIndexOf('/') + 1, route.length);
		switch (pageRouteName) {
			case RoutersName.PRIVACY:
				return '';
			case RoutersName.BREACHES:
				return 'BreachedAccounts.';
			case RoutersName.TRACKERS:
				return 'VisibleToOnlineTrackers.';
			case RoutersName.BROWSERACCOUNTS:
				return 'NonPrivatePassword.';
			case  RoutersName.LANDING:
				return 'Landing.';
			case  RoutersName.NEWS:
				return 'News.';
			case  RoutersName.TIPS:
				return 'Tips.';
			default:
				return '';
		}
	}
}
