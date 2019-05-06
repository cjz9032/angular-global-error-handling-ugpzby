import { Injectable } from '@angular/core';
import { VantageShellService } from '../../../../../services/vantage-shell/vantage-shell.service';
import { MetricsData } from '../../../../../directives/metrics.directive';
import { Router } from '@angular/router';
import { RoutersName } from '../../privacy-routing-name';

interface ExtendedMetricsData extends MetricsData {
	PageContext?: string;
	PageDuration?: number;
}

interface DataToSendOnItemClick {
	ItemName: string;
	ItemParent: string;
	ItemParm?: string | object;
	ItemValue?: string;
}

interface DataToSendOnPageView {
	PageContext?: string;
	PageDuration: number;
}

interface DataToSendOnTaskAction {
	ItemType: 'TaskAction';
	TaskName: string;
	TaskCount: number;
	TaskParm: string;
	TaskResult: string;
	TaskDuration: number;
}

@Injectable({
	providedIn: 'root'
})
export class AnalyticsService {

	metrics = this.shellService.getMetrics();

	metricsParams = { // TODO add real logic
		BreachedAccountsResult: 'None',
		WebsiteTrackersResult: 'Node',
		NonPrivatePasswordsResult: 'Node',
	};

	constructor(
		private shellService: VantageShellService,
		private router: Router) {
	}

	send(data: ExtendedMetricsData) {
		console.log('ANALYTICS data: ', data);
		if (this.metrics && this.metrics.sendAsync) {
			this.metrics.sendAsync(JSON.stringify(data));
		}
	}

	sendPageViewData(data: DataToSendOnPageView) {
		const dataToSend = {
			...data,
			PageName: this.getPageName(),
			ItemType: 'PageView',
		};
		this.send(dataToSend);
	}

	sendTaskActionData(data: DataToSendOnTaskAction) {
		const dataToSend = {
			...data,
			ItemType: 'TaskAction',
		};
		this.send(dataToSend);
	}

	sendItemClickData(data: DataToSendOnItemClick) {
		const ItemParam = typeof data.ItemParm === 'string' ? JSON.parse(data.ItemParm) : data.ItemParm;
		const itemParameters = JSON.stringify({
			...ItemParam,
			...this.metricsParams
		});
		const dataToSend = {
			...data,
			ItemParm: itemParameters,
			ItemType: 'ItemClick',
		};
		this.send(dataToSend);
	}

	private getPageName() {
		const route = this.router.url;
		const pageRouteName = route.slice(route.lastIndexOf('/') + 1, route.length);
		switch (pageRouteName) {
			case RoutersName.PRIVACY:
				return 'Privacy';
			case RoutersName.BREACHES:
				return 'BreachedAccounts';
			case RoutersName.TRACKERS:
				return 'VisibleToOnlineTrackers';
			case RoutersName.BROWSERACCOUNTS:
				return 'NonPrivatePassword';
			case  RoutersName.NEWS:
				return 'News.';
			case  RoutersName.TIPS:
				return 'Tips.';
			default:
				return '';
		}
	}
}
