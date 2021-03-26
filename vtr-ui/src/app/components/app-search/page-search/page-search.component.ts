import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { AppSearchService } from 'src/app/services/app-search/app-search.service';
import { IFeature } from 'src/app/services/app-search/model/interface.model';
import { CommonService } from 'src/app/services/common/common.service';
import { FeatureClick, TaskAction } from 'src/app/services/metric/metrics.model';
import { MetricEventName as EventName } from 'src/app/enums/metrics.enum';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { RoutePath } from 'src/assets/menu/menu';
import { SecureMath } from '@lenovo/tan-client-bridge';
import { SearchInputWidgetComponent } from './sub-components/search-input-widget/search-input-widget.component';

@Component({
	selector: 'vtr-page-search',
	templateUrl: './page-search.component.html',
	styleUrls: ['./page-search.component.scss'],
})
export class PageSearchComponent implements OnInit, OnDestroy, AfterViewInit {
	@ViewChild(SearchInputWidgetComponent, { static: true })
	searchInput: SearchInputWidgetComponent;
	private paramSubscription: any;
	private notificationSubscription: any;
	public userInput: string;
	public pageTitle: string;
	public searchTips = 'Search Query';
	public runningSearch = undefined; // undefined indicate search has never fired, no result tips should no show
	public isOnline = true;
	public allResultItems: IFeature[] = [];

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
				this.doSearch(userInput);
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
	}

	ngAfterViewInit() {
		setTimeout(() => {
			this.searchInput.setInputFocus();
		}, 0);
	}

	onClickSearch() {
		this.userInput = this.mergeAndTrimSpace(this.userInput);
		if (this.userInput) {
			// this.metricService.sendMetrics(metricEvent);
			this.router.navigate([RoutePath.search], {
				queryParams: { userInput: this.userInput, hash: SecureMath.random() },
			});
		}
	}

	onClickResultItem($event) {
		const feature: IFeature = $event;
		this.searchService.handleAction(feature.id);
	}

	ngOnDestroy() {
		this.paramSubscription?.unsubscribe();
		this.notificationSubscription?.unsubscribe();
	}

	private doSearch(userInput: string) {
		if (!userInput) {
			return;
		}

		const searchStart = Date.now();
		this.runningSearch = true;
		this.updatePageTitle();

		(async () => {
			const startTime = Date.now();
			this.logger.info(`[appSearch]Searching for ${userInput} start`);
			const result = await this.searchService.search(userInput).toPromise();
			this.logger.info(
				`[appSearch]Searching for ${userInput} end: Duration:${Date.now() - startTime}`
			);

			this.updateSearchResults(result.features);
			this.runningSearch = false;
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

	private updateSearchResults(resultList: any) {
		if (resultList && resultList.length > 0) {
			this.allResultItems = resultList;
		} else {
			this.allResultItems = [];
		}
	}

	private mergeAndTrimSpace(source) {
		return source?.trim().replace(/ +(?= )/g, '') || '';
	}
}
