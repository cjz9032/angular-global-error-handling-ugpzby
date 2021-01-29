import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { AppSearchService } from 'src/app/services/app-search/app-search.service';
import { IFeature } from 'src/app/services/app-search/model/interface.model';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';
import { FeatureClick, TaskAction } from 'src/app/services/metric/metrics.model';
import { SupportService } from 'src/app/services/support/support.service';
import { MetricEventName as EventName } from 'src/app/enums/metrics.enum';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { RoutePath } from 'src/assets/menu/menu';
import { HistoryManager } from 'src/app/services/history-manager/history-manager.service';

interface IDisplayPage {
	pageIdx: number;
	startItemIdx: number;
	startItemIdxOfNextPage: number;
	items: IFeature[];
}

@Component({
	selector: 'vtr-page-search',
	templateUrl: './page-search.component.html',
	styleUrls: ['./page-search.component.scss'],
})
export class PageSearchComponent implements OnInit, OnDestroy {
	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;
	private paramSubscription: any;
	private notificationSubscription: any;
	public userInput: string;
	public pageTitle: string;
	public noSearchResultTips: string;
	public isInnerBack = false;
	public searchTips = 'Search Query';
	public searchCompleted = true;
	public isOnline = true;

	public readonly pageSize = 10;
	public allResultItems: IFeature[] = [];
	public pageArray = [];
	public displayPage: IDisplayPage = {
		pageIdx: 0,
		startItemIdx: 0,
		startItemIdxOfNextPage: 0,
		items: [],
	};

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
	public listLenovoCommunity = {
		icon: ['fal', 'comment-alt'],
		title: 'support.needHelp.listLenovoCommunity',
		url: 'https://community.lenovo.com',
		metricsItem: 'NeedHelp.LenovoCommunityButton',
		metricsEvent: 'FeatureClick',
	};
	public listContactCustomerService = {
		icon: ['fal', 'share-alt'],
		title: 'support.needHelp.listContactCustomerService',
		url: 'https://support.lenovo.com/contactus?serialnumber=',
		metricsItem: 'NeedHelp.ContactCustomerServiceButton',
		metricsEvent: 'FeatureClick',
	};
	public lenaUrls = [
		{ url: 'https://in.lena.lenovo.com/lena', lang: 'en', geo: ['in', 'lk', 'bd'] },
		{ url: 'https://us.lena.lenovo.com/lena', lang: 'en', geo: ['us', 'ca'] },
		{ url: 'https://uki.lena.lenovo.com/lena', lang: 'en', geo: ['gb', 'ie'] },
		{ url: 'https://lena.lenovo.com/lena', lang: 'en', geo: ['au', 'nz', 'sg', 'my', 'ph'] },
		{
			url: 'https://las.lena.lenovo.com/lena',
			lang: 'es',
			geo: [
				'mx',
				'co',
				'ar',
				'pe',
				'cl',
				'cr',
				'do',
				'sv',
				'gt',
				'hn',
				'ni',
				'pa',
				'bo',
				'ec',
				'py',
				'uy',
				've',
			],
		},
		{ url: 'https://jp.lena.lenovo.com/lena', lang: 'ja', geo: ['jp'] },
		{ url: 'https://eu.lena.lenovo.com/lena', lang: 'de', geo: ['de', 'at'] },
	];
	public listFindUs = {
		icon: ['fal', 'heart'],
		title: 'support.needHelp.listFindUs',
		clickItem: 'findUs',
		metricsItem: 'NeedHelp.FindUsButton',
		metricsEvent: 'FeatureClick',
	};
	public listAboutLenovoVantage = {
		iconPath: 'assets/images/support/svg_icon_about_us.svg',
		title: 'support.quicklinks.listAboutLenovoVantage',
		clickItem: 'about',
		metricsItem: 'Quicklinks.AboutLenovoVantageButton',
		metricsEvent: 'FeatureClick',
	};
	public clickSearchIconEvent: FeatureClick = {
		ItemType: EventName.featureclick,
		ItemParent: 'Page.Search',
		ItemName: 'icon.search',
	};
	public enterSearchEvent: FeatureClick = {
		ItemType: EventName.featureclick,
		ItemParent: 'Page.Search',
		ItemName: 'input.search',
	};
	public clickSearchBtnEvent: FeatureClick = {
		ItemType: EventName.featureclick,
		ItemParent: 'Page.Search',
		ItemName: 'btn.search',
	};
	public searchTaskEvent: TaskAction = {
		ItemType: EventName.taskaction,
		TaskName: 'app-search',
		TaskCount: 1,
		TaskParm: 'NA',
		TaskResult: '0',
		TaskDuration: 0,
	};

	constructor(
		private searchService: AppSearchService,
		private activateRoute: ActivatedRoute,
		private translate: TranslateService,
		private commonService: CommonService,
		private supportService: SupportService,
		private localInfoService: LocalInfoService,
		private metricService: MetricService,
		private logger: LoggerService,
		private router: Router
	) {}

	ngOnInit(): void {
		//1. parse query parameter
		this.paramSubscription = this.activateRoute.queryParams.subscribe((params) => {
			/*
			 * should not set this.userInput directly here, subscription will be triggered
			 * with empty param when you click search button on the page at the first time
			 * you enter search page.
			 */
			const userInput = this.mergeAndTrimSpace(params.userInput);
			if (userInput) {
				this.userInput = userInput;
				this.fireSearch(userInput);
			}
			this.updatePageTitle();
		});

		//2. subscibe to common event
		this.isOnline = this.commonService.isOnline;
		this.notificationSubscription = this.commonService.notification.subscribe(
			(notification: AppNotification) => {
				this.onNotification(notification);
			}
		);

		//3. populate right panel
		this.setupRightPanels();
	}

	onInnerBack() {}

	onClickSearchBtn(metricEvent) {
		this.userInput = this.mergeAndTrimSpace(this.userInput);
		if (this.userInput) {
			this.metricService.sendMetrics(metricEvent);
			this.router.navigate([RoutePath.search], {
				queryParams: { userInput: this.userInput },
			});
		}
	}

	onClickResultItem(feature: IFeature) {
		this.searchService.handleAction(feature);
	}

	onClickInput() {
		setTimeout(() => {
			this.searchInput.nativeElement.focus();
		}, 200);
	}

	onClickPreResultPage() {
		const nextIdx = this.displayPage.pageIdx - 1;
		if (nextIdx < 0) {
			return;
		}

		this.updateResultView(nextIdx);
	}

	onClickSpecifiedResultPage(pageIdx: number) {
		if (pageIdx === this.displayPage.pageIdx) {
			return;
		}

		this.updateResultView(pageIdx);
	}

	onClickNextResultPage() {
		const nextIdx = this.displayPage.pageIdx + 1;
		if (nextIdx >= this.pageArray.length) {
			return;
		}

		this.updateResultView(nextIdx);
	}

	ngOnDestroy() {
		this.paramSubscription?.unsubscribe();
		this.notificationSubscription?.unsubscribe();
	}

	private fireSearch(userInput) {
		if (!userInput) {
			return;
		}

		const searchStart = Date.now();
		this.searchCompleted = false;
		this.updatePageTitle();

		(async () => {
			const startTime = Date.now();
			this.logger.info(`[appSearch]Searching for ${userInput} start`);
			const result = await this.searchService.search(userInput).toPromise();
			this.logger.info(
				`[appSearch]Searching for ${userInput} end: Duration:${Date.now() - startTime}`
			);

			this.populateSearchResults(result.features);
			this.updatePageArray();
			this.updateResultView(0);
			this.searchCompleted = true;
			this.sendSearchTaskMetric(userInput, searchStart);
		})();
	}

	private sendSearchTaskMetric(userInput: string, searchStart: number) {
		const searchTask = Object.assign(this.searchTaskEvent, {
			TaskDuration: Date.now() - searchStart,
			TaskResult: this.allResultItems.length.toString(),
		});

		// searchTask.TaskParm = userInput;	should not collect user input untill we got pdd approval
		this.metricService.sendMetrics(searchTask);
	}

	private updatePageTitle() {
		if (!this.userInput) {
			this.pageTitle = this.translate.instant('appSearch.menuName');
		} else {
			this.pageTitle = this.translate.instant('appSearch.pageTitle', {
				userInput: this.userInput,
			});
			this.noSearchResultTips = this.translate.instant('appSearch.noSearchResultTips', {
				userInput: this.userInput,
			});
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

	private populateSearchResults(resultList: any) {
		if (resultList && resultList.length > 0) {
			this.allResultItems = resultList;
		} else {
			this.allResultItems = [];
		}
	}

	private updatePageArray() {
		this.pageArray = [].constructor(Math.ceil(this.allResultItems.length / this.pageSize));
	}

	private updateResultView(pageIdx: number) {
		this.displayPage.pageIdx = pageIdx;
		this.displayPage.startItemIdx = pageIdx * this.pageSize;
		this.displayPage.startItemIdxOfNextPage = Math.min(
			(pageIdx + 1) * this.pageSize,
			this.allResultItems.length
		);
		this.displayPage.items = this.allResultItems.filter(
			(item, idx) =>
				idx >= this.displayPage.startItemIdx &&
				idx < this.displayPage.startItemIdxOfNextPage
		);
	}

	private setupRightPanels() {
		if (this.supportService.supportDatas) {
			this.supportDatas = this.supportService.supportDatas;
			return;
		}
		this.supportDatas.needHelp.push(this.listLenovoCommunity);
		this.supportService.getSerialnumber().then((sn) => {
			this.listContactCustomerService.url = `https://support.lenovo.com/contactus?serialnumber=${sn}`;
			this.supportDatas.needHelp.push(this.listContactCustomerService);
			this.localInfoService.getLocalInfo().then((info) => {
				this.supportDatas.needHelp.push(this.listFindUs);
				this.supportService.supportDatas = this.supportDatas;
			});
		});

		this.supportDatas.quicklinks.push(this.listAboutLenovoVantage);
	}

	private mergeAndTrimSpace(source) {
		return source?.trim().replace(/ +(?= )/g, '') || '';
	}
}
