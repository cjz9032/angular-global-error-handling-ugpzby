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
		return 'Privacy';
	}
}
