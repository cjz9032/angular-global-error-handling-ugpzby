import { Injectable } from '@angular/core';
import { VantageShellService } from '../../../../../services/vantage-shell/vantage-shell.service';
import { MetricsData } from '../../../../../directives/metrics.directive';
import { RoutersName } from '../../privacy-routing-name';
import { UserDataGetStateService } from './user-data-get-state.service';
import { RouterChangeHandlerService } from './router-change-handler.service';

export enum ItemTypes {
	TaskAction = 'TaskAction',
	PageView = 'PageView',
	ItemClick = 'ItemClick',
	ArticleClick = 'ArticleClick'
}

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
	TaskName: string;
	TaskCount: number;
	TaskParm?: string;
	TaskResult: string;
	TaskDuration: number;
}

@Injectable({
	providedIn: 'root'
})
export class AnalyticsService {

	metrics = this.shellService.getMetrics();

	constructor(
		private shellService: VantageShellService,
		private userDataGetStateService: UserDataGetStateService,
		private routerChangeHandlerService: RouterChangeHandlerService) {
	}

	send(data: ExtendedMetricsData) {
		console.log('ANALYTICS data: ', data);
		if (this.metrics && this.metrics.sendAsync) {
			this.metrics.sendAsync(data);
		}
	}

	sendPageViewData(data: DataToSendOnPageView, customPageName: string) {
		const dataToSend = {
			...data,
			PageName: customPageName || this.getPageName(),
			ItemType: ItemTypes.PageView,
		};
		this.send(dataToSend);
	}

	sendTaskActionData(data: DataToSendOnTaskAction) {
		const dataToSend = {
			...data,
			ItemType: ItemTypes.TaskAction,
		};
		this.send(dataToSend);
	}

	sendItemClickData(data: DataToSendOnItemClick) {
		const ItemParam = typeof data.ItemParm === 'string' ? JSON.parse(data.ItemParm) : data.ItemParm;
		const userDataStatuses = this.userDataGetStateService.getUserDataStatus();
		const itemParameters = JSON.stringify({
			...ItemParam,
			...userDataStatuses,
		});
		const dataToSend = {
			...data,
			ItemParm: itemParameters,
			ItemType: ItemTypes.ItemClick,
		};
		this.send(dataToSend);
	}

	private getPageName() {
		switch (this.routerChangeHandlerService.currentRoute) {
			case RoutersName.PRIVACY:
				return 'Privacy';
			case RoutersName.BREACHES:
				return 'Privacy.BreachedAccounts';
			case RoutersName.TRACKERS:
				return 'Privacy.VisibleToOnlineTrackers';
			case RoutersName.BROWSERACCOUNTS:
				return 'Privacy.NonPrivatePassword';
			case RoutersName.LANDING:
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
