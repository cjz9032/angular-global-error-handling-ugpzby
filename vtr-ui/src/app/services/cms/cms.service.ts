import { Injectable, SecurityContext, OnDestroy } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { FeatureContent } from 'src/app/data-models/common/feature-content.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { LocalStorageKey } from '../../enums/local-storage-key.enum'; // VAN-5872, server switch feature
import { CommonService } from '../common/common.service'; // VAN-5872, server switch feature
import { CommsService } from '../comms/comms.service';
import { DevService } from '../dev/dev.service';
import { LocalInfoService } from '../local-info/local-info.service';
import { LoggerService } from '../logger/logger.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { throwError, Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { ContentSource } from 'src/app/enums/content.enum';
import { MetricService } from '../metric/metrics.service';
import { MetricEventName as EventName, PerformanceCategory as PCategory } from 'src/app/enums/metrics.enum';
import { MetricPerformance } from '../metric/metrics.model';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json',
	})
};

interface RequestParam {
	cmsOption: string;
	api: string;
	apiParam: string;
	observableMsg: string;
	applyDeviceFilter: boolean;
}

@Injectable({
	providedIn: 'root'
})
export class CMSService implements OnDestroy {
	language: string;
	region: string;
	segment: string; // VAN-5872, server switch feature
	localInfo: any;
	defaultInfo = { Lang: 'en', GEO: 'us', OEM: 'Lenovo', OS: 'Windows', Segment: 'Consumer', Brand: 'Lenovo' };
	fetchRequestMap = {};
	requestCMSContentSubscription: Subscription;
	commonNotificationSubscription: Subscription;
	endpointGetCall1Subscription: Subscription;
	endpointGetCall2Subscription: Subscription;
	endpointGetCall3Subscription: Subscription;
	endpointGetCall4Subscription: Subscription;
	endpointGetCall5Subscription: Subscription;

	constructor(
		private commsService: CommsService,
		private vantageShellService: VantageShellService,
		private localInfoService: LocalInfoService,
		private commonService: CommonService, // VAN-5872, server switch feature,
		private logger: LoggerService,
		private sanitizer: DomSanitizer,
		private metricsService: MetricService
	) {
		localInfoService.getLocalInfo().then(result => {
			this.localInfo = result;
		}).catch(e => { });
	}

	private async deviceFilter(filters) {
		if (!filters) {
			return true;
		}

		try {
			return await this.vantageShellService.deviceFilter(filters);
		} catch  {
			return false;
		}
	}

	private getDateTime(date: any): number {
		try {
			if (date && typeof date === 'string') {
				return new Date(date.replace(/\./g, '\/')).getTime();
			}
		} catch (e) { }
		return -1;
	}

	// VAN-5872, server switch feature
	// retrive from localStorage
	private updateServerSwitchCMSOptions(defaults, queryParams) {
		const cmsOption = Object.assign(defaults, queryParams);
		try {
			const serverSwitchLocalData = this.commonService.getLocalStorageValue(LocalStorageKey.ServerSwitchKey);
			if (serverSwitchLocalData) {

				const langMap = {
					'sr-latn': 'sr'
				};
				if (langMap[serverSwitchLocalData.language.Value]) {
					serverSwitchLocalData.language.Value = langMap[serverSwitchLocalData.language.Value];
				}

				this.commsService.setServerSwitchLocalData(serverSwitchLocalData);
				if (serverSwitchLocalData.forceit) {
					Object.assign(cmsOption, {
						Lang: (serverSwitchLocalData.language.Value).toLowerCase(),
						GEO: (serverSwitchLocalData.country.Value).toLowerCase(),
						Segment: serverSwitchLocalData.segment,
						OEM: serverSwitchLocalData.oem,
						Brand: serverSwitchLocalData.brand
					});
				}
			}
		} catch (error) {
			this.logger.error('CMSService.updateServerSwitchCMSOptions', error.message);
			return undefined;
		}
		return cmsOption;

	}

	private async filterCMSContent(contents) {
		const promises = [];
		contents.forEach((content) => {
			promises.push(this.deviceFilter(content.Filters));
		});

		return Promise.all(promises).then((deviceFilterValues) => {
			return contents.filter((content, index) => {
				return deviceFilterValues[index];
			});
		});
	}

	private async getLocalinfo(): Promise<any> {
		if (!this.localInfo) {
			try {
				this.localInfo = await this.localInfoService.getLocalInfo();
			} catch (error) {
				this.logger.error('CMSService.getLocalinfo', error.message);
			}
		}

		return this.localInfo || this.defaultInfo;
	}

	public sortCmsContent(a, b): number {
		if (a.Priority === b.Priority) {
			return this.getDateTime(b.DisplayStartDate) - this.getDateTime(a.DisplayStartDate);
		}
		return a.Priority.localeCompare(b.Priority);
	}

	public getOneCMSContent(results, template, position, dataSource = ContentSource.CMS): FeatureContent[] {
		return results.filter((record) => {
			return (
				record.Template === template &&
				record.Position === position &&
				(
					!record.DisplayStartDate ||
					this.getDateTime(record.DisplayStartDate) <= new Date().getTime()
				)
			);
		}).filter(record => {
			try {
				record.Title = this.sanitizer.sanitize(SecurityContext.HTML, record.Title);
				record.Description = this.sanitizer.sanitize(SecurityContext.HTML, record.Description);
				record.DataSource = dataSource;
			} catch (ex) {
				this.logger.error('CMSService.sanitize error:', ex.message);
				return false;
			}
			return true;
		}).sort(this.sortCmsContent.bind(this));
	}

	public fetchCMSContent(queryParams) {
		return new Observable(subscriber => {
			if (this.commonService.isOnline) {
				this.getCMSContent(queryParams).then(response => {
					subscriber.next(response);
				}).catch(ex => {
					subscriber.error(ex);
				});
			} else {
				if (!this.commonNotificationSubscription) {
					this.commonNotificationSubscription = this.commonService.notification.subscribe((notification: AppNotification) => {
						if (notification && notification.type === NetworkStatus.Online) {
							this.getCMSContent(queryParams).then(response => {
								subscriber.next(response);
							}).catch(ex => {
								subscriber.error(ex);
							});
						}
					});
				}
			}
		});
	}

	private async getCMSContent(queryParams: any) {
		const locInfo = await this.getLocalinfo();
		const defaults = {
			Lang: locInfo.Lang,
			GEO: locInfo.GEO,
			OEM: locInfo.OEM,
			OS: locInfo.OS,
			Segment: locInfo.Segment,
			Brand: locInfo.Brand
		};
		const cmsOption = this.updateServerSwitchCMSOptions(defaults, queryParams);

		const requestKey = JSON.stringify(cmsOption);
		if (!this.fetchRequestMap[requestKey]) {
			this.fetchRequestMap[requestKey] = this.postRequest({
				cmsOption,
				api: '/api/v1/features',
				apiParam: null,
				observableMsg: null,
				applyDeviceFilter: true
			});
		}

		try {
			return await this.fetchRequestMap[requestKey];	// intercept duplicate request
		} finally {
			this.fetchRequestMap[requestKey] = null;
		}
	}

	public async fetchCMSArticleCategories(queryParams) {
		const locInfo = await this.getLocalinfo();
		const defaults = {
			Lang: locInfo.Lang,
			GEO: locInfo.GEO,
			OEM: locInfo.OEM,
			OS: locInfo.OS,
			Segment: locInfo.Segment,
			Brand: locInfo.Brand
		};
		const cmsOption = this.updateServerSwitchCMSOptions(defaults, queryParams);
		return this.postRequest({
			cmsOption,
			api: '/api/v1/articlecategories',
			apiParam: null,
			observableMsg: 'fetchCMSArticleCategories error',
			applyDeviceFilter: true
		});
	}

	public async fetchCMSArticles(queryParams, returnAll = false) {
		const locInfo = await this.getLocalinfo();
		const defaults = {
			Lang: locInfo.Lang,
			GEO: locInfo.GEO,
			OEM: locInfo.OEM,
			OS: locInfo.OS,
			Segment: locInfo.Segment,
			Brand: locInfo.Brand
		};
		const cmsOption = this.updateServerSwitchCMSOptions(defaults, queryParams);
		return this.postRequest({
			cmsOption,
			api: '/api/v1/articles',
			apiParam: null,
			observableMsg: 'fetchCMSArticles error',
			applyDeviceFilter: true
		});
	}

	public async fetchCMSArticle(articleId, queryParams?) {
		const locInfo = await this.getLocalinfo();
		const defaults = {
			Lang: locInfo.Lang
		};
		const cmsOption = this.updateServerSwitchCMSOptions(defaults, queryParams);
		return this.postRequest({
			cmsOption,
			api: '/api/v1/articles/',
			apiParam: articleId,
			observableMsg: null,
			applyDeviceFilter: false
		});

	}

	public async fetchCMSEntitledAppList(queryParams) {
		const locInfo = await this.getLocalinfo();
		const defaults = {
			Lang: locInfo.Lang
		};
		const cmsOption = this.updateServerSwitchCMSOptions(defaults, queryParams);
		return this.postRequest({
			cmsOption,
			api: '/api/v1/entitledapps',
			apiParam: null,
			observableMsg: 'fetchCMSEntitledAppList error',
			applyDeviceFilter: false
		});
	}

	public async fetchCMSAppDetails(appId, queryParams) {
		const locInfo = await this.getLocalinfo();
		const defaults = {
			Lang: locInfo.Lang
		};
		const cmsOption = this.updateServerSwitchCMSOptions(defaults, queryParams);
		return this.postRequest({
			cmsOption,
			api: '/api/v1/apps/',
			apiParam: appId,
			observableMsg: 'fetchCMSAppDetails error',
			applyDeviceFilter: false
		});
	}

	public async postRequest(param: RequestParam) {
		const {
			cmsOption,
			api,
			apiParam,
			observableMsg,
			applyDeviceFilter } = param;

		let performanceData: MetricPerformance;
		let httpStart = 0;
		let httpEnd = 0;

		let filterStart = 0;
		let filterEnd = 0;
		let success = false;
		const elipsedFromStart = Date.now() - this.metricsService.serviceStartup;
		let results;
		try {

			httpStart = Date.now();
			const composeApi = apiParam ? api + apiParam : api;
			const response: any = await this.commsService.endpointGetCall(composeApi, cmsOption, {}).toPromise();
			httpEnd = Date.now();

			if (applyDeviceFilter) {
				filterStart = httpEnd;
				results = await this.filterCMSContent(response.Results);
				filterEnd = Date.now();

			} else {
				results = response.Results;
			}
			success = true;

			return results;
		} catch (ex) {
			if (observableMsg) {
				throwError(new Error(observableMsg));
			} else {
				throw (ex);
			}
		} finally {
			const httpDuration = httpEnd - httpStart;
			const filterDuration = filterEnd - filterStart;
			performanceData = {
				ItemType: EventName.performance,
				Category: PCategory.CMS,
				Host: this.commsService.getCmsHost(),
				Api: api,
				Param: apiParam,
				Success: success,
				HttpDuration: httpDuration,
				FilterDuration: filterDuration,
				ElipsedFromStart: elipsedFromStart
			};
			this.metricsService.sendMetrics(performanceData);
		}
	}

	ngOnDestroy() {
		if (this.commonNotificationSubscription) {
			this.commonNotificationSubscription.unsubscribe();
		}
	}
}
