import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { AppSearchService } from 'src/app/services/app-search/app-search.service';
import { IFeature } from 'src/app/services/app-search/interface.model';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
	selector: 'vtr-page-search',
	templateUrl: './page-search.component.html',
	styleUrls: ['./page-search.component.scss']
})

export class PageSearchComponent implements OnInit {
	[x: string]: any;
	public queryInput: string;
	public userInput: string;
	public pageTitle: string;
	public isCategoryArticlesShow = false;
	public searchTips = 'Search Query';
	public loadedCompleted = true;
	public searchCompleted = false;
	public currentPage = 1;
	public pageStartIdx = 1;
	public pageEndIdx = 1;
	public readonly pageSize = 40;
	public isOnline = true;
	public offlineConnection = '';
	public loadingGif = false;
	public resultItems: IFeature[] = [];
	public pageArray = [];
	public supportDatas = {
		documentation: [
			{
				icon: ['fal', 'book'],
				title: 'support.documentation.listUserGuide',
				clickItem: 'userGuide',
				metricsItem: 'Documentation.UserGuideButton',
				metricsEvent: 'FeatureClick',
			},
		],
		needHelp: [],
		quicklinks: [],
	};

	constructor(
		private searchService: AppSearchService,
		private activateRoute: ActivatedRoute,
		private translate: TranslateService,
		private commonService: CommonService
	) { }

	ngOnInit(): void {
		// parse query parameter
		this.activateRoute.queryParams
			.subscribe(params => {
				this.userInput = params.userInput;
				this.updatePageTitle();	// setup page title at initialization
				this.fireSearch();
			});

			// subscibe to common event
			this.isOnline = this.commonService.isOnline;
			this.notificationSubscription = this.commonService.notification.subscribe(
				(notification: AppNotification) => {
					this.onNotification(notification);
				}
			);

		// to do - remove
		this.pageStartIdx = this.calcCurrentPageStartIdx();
		this.pageEndIdx = this.calcCurrentPageEndIdx();
		this.pageArray = [].constructor(Math.ceil(this.resultItems.length / this.pageSize));
	}

	onClickSearchBtn() {
		this.fireSearch();
	}

	onClickResultItem(feature: IFeature) {
		this.searchService.handleAction(feature.action);
	}

	onInnerBack() {

	}

	onClickRecommandationItem(item) {
		// to do, navigate search page and search the recommanded item
	}

	onSearchInputChange() {
		// to do, show input recommandation
	}

	private calcCurrentPageStartIdx() {
		return this.currentPage + (this.currentPage - 1) * this.pageSize;
	}

	private calcCurrentPageEndIdx() {
		return this.currentPage * this.pageSize;
	}

	private fireSearch() {
		if (!this.userInput) {
			return;
		}

		this.searchCompleted = false;
		this.updatePageTitle();

		// To do, if not online, show disconnect
		const resultList = this.searchService.search(this.userInput);
		if (resultList && resultList.length > 0) {
			this.resultItems = resultList;
		} else {
			this.resultItems = [];
		}

		this.searchCompleted = true;
	}

	private updatePageTitle() {
		if (!this.userInput) {
			this.pageTitle = this.translate.instant('appSearch.menuName');
		} else {
			this.pageTitle = this.translate.instant('appSearch.searchResultTips', {userInput: this.userInput});
		}
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case NetworkStatus.Online:
				case NetworkStatus.Offline:
					this.isOnline = notification.payload.isOnline;
					break;
				default:
					break;
			}
		}
	}
}
