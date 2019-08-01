import { Injectable } from '@angular/core';
import { RoutersName } from '../../privacy-routing-name';
import { RouterChangeHandlerService } from './router-change-handler.service';

@Injectable({
	providedIn: 'root'
})
export class GetParentForAnalyticsService {

	constructor(private routerChangeHandlerService: RouterChangeHandlerService) {
	}

	getParentName(currentElement) {
		const parentNodeName = this.getParentNodeName(currentElement);
		return this.getPageName() + (parentNodeName && '.') + parentNodeName;
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
		switch (this.routerChangeHandlerService.currentRoute) {
			case RoutersName.PRIVACY:
				return 'Privacy';
			case RoutersName.BREACHES:
				return 'Privacy.BreachedAccounts';
			case RoutersName.TRACKERS:
				return 'Privacy.VisibleToOnlineTrackers';
			case RoutersName.BROWSERACCOUNTS:
				return 'Privacy.NonPrivatePassword';
			case  RoutersName.LANDING:
				return 'Privacy.Landing';
			case RoutersName.ARTICLES:
				return 'Privacy.ArticleAll';
			case RoutersName.ARTICLEDETAILS:
				return 'Privacy.Article';
			default:
				return '';
		}
	}
}
