import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { AppSearchService } from 'src/app/services/app-search/app-search.service';
import { IFeature } from 'src/app/services/app-search/interface.model';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';
import { SupportService } from 'src/app/services/support/support.service';

@Component({
	selector: 'vtr-page-search',
	templateUrl: './page-search.component.html',
	styleUrls: ['./page-search.component.scss']
})

export class PageSearchComponent implements OnInit {
	public notificationSubscription: any;
	public userInput: string;
	public pageTitle: string;
	public noSearchResultTips: string;
	public isInnerBack = false;
	public searchTips = 'Search Query';
	public loadedCompleted = true;
	public searchCompleted = false;
	public currentPageIdx = 0;
	public startItemOfCurPageIdx = 0;
	public startItemOfNextPageIdx = 0;
	public readonly pageSize = 10;
	public isOnline = true;
	public offlineConnection = '';
	public loadingGif = false;
	public resultItems: IFeature[] = [];
	public displayItems: IFeature[] = [];
	public pagesArray = [];
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

	constructor(
		private searchService: AppSearchService,
		private activateRoute: ActivatedRoute,
		private translate: TranslateService,
		private commonService: CommonService,
		private supportService: SupportService,
		private localInfoService: LocalInfoService
	) { }

	ngOnInit(): void {
		//1. parse query parameter
		this.activateRoute.queryParams
			.subscribe(params => {
				this.userInput = params.userInput;
				this.updatePageTitle();	// setup page title at initialization
				this.fireSearch();
			});

		//2. subscibe to common event
		this.isOnline = this.commonService.isOnline;
		this.notificationSubscription = this.commonService.notification.subscribe(
			(notification: AppNotification) => {
				this.onNotification(notification);
			}
		);

		//3. populate right panel
		this.setShowList();
	}

	onInnerBack() {
	}

	onClickSearchBtn() {
		this.fireSearch();
	}

	onClickResultItem(feature: IFeature) {
		this.searchService.handleAction(feature.action);
	}

	onClickBackResultView() {
		const nextIdx = this.currentPageIdx - 1;
		if (nextIdx < 0) {
			return;
		}

		this.updateResultView(nextIdx);
	}

	onClickResultView(pageIdx: number) {
		if (pageIdx === this.currentPageIdx) {
			return;
		}

		this.updateResultView(pageIdx);
	}

	onClickForwardResultView() {
		const nextIdx = this.currentPageIdx + 1;
		if (nextIdx >= this.pagesArray.length) {
			return;
		}

		this.updateResultView(nextIdx);
	}

	onClickRecommandationItem(item) {
		// to do, navigate search page and search the recommanded item
	}

	onSearchInputChange() {
		// to do, update recommandation items
	}

	private fireSearch() {
		var userInput = this.userInput?.trim();
		if (!userInput) {
			return;
		}

		this.searchCompleted = false;
		this.updatePageTitle();
		this.populateSearchResults(this.searchService.search(this.userInput));
		this.updatePageArray();
		this.updateResultView(0);
		this.searchCompleted = true;
	}

	private updatePageTitle() {
		if (!this.userInput) {
			this.pageTitle = this.translate.instant('appSearch.menuName');
		} else {
			this.pageTitle = this.translate.instant('appSearch.pageTitle', { userInput: this.userInput });
			this.noSearchResultTips = this.translate.instant('appSearch.noSearchResultTips', { userInput: this.userInput });
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
			this.resultItems = resultList;
		} else {
			this.resultItems = [];
		}
	}

	private updatePageArray() {
		this.pagesArray = [].constructor(Math.ceil(this.resultItems.length / this.pageSize));
	}

	private updatePageStartIdx() {
		this.startItemOfCurPageIdx = this.currentPageIdx * this.pageSize;
	}

	private updatePageEndIdx() {
		const startItemOfNextPageIdx = (this.currentPageIdx + 1) * this.pageSize;
		this.startItemOfNextPageIdx = Math.min(startItemOfNextPageIdx, this.resultItems.length);
	}

	private updateResultView(pageIdx: number) {
		this.currentPageIdx = pageIdx;
		this.updatePageStartIdx();
		this.updatePageEndIdx();

		this.displayItems = this.resultItems.filter((item, idx) => {
			return idx >= this.startItemOfCurPageIdx && idx < this.startItemOfNextPageIdx;
		});
	}

	setShowList() {
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
}
