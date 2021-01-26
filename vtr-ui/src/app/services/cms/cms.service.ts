import { Injectable, SecurityContext, OnDestroy } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { FeatureContent } from 'src/app/data-models/common/feature-content.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { LocalStorageKey } from '../../enums/local-storage-key.enum'; // VAN-5872, server switch feature
import { CommonService } from '../common/common.service'; // VAN-5872, server switch feature
import { CommsService } from '../comms/comms.service';
import { LocalInfoService } from '../local-info/local-info.service';
import { LoggerService } from '../logger/logger.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { throwError, Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { ContentSource } from 'src/app/enums/content.enum';
import { LocalCacheService } from '../local-cache/local-cache.service';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json',
	}),
};

interface RequestParam {
	cmsOption: string;
	api: string;
	apiParam: string;
	observableMsg: string;
	applyDeviceFilter: boolean;
	responseOrigin?: boolean;
}

@Injectable({
	providedIn: 'root',
})
export class CMSService implements OnDestroy {
	language: string;
	region: string;
	segment: string; // VAN-5872, server switch feature
	localInfo: any;
	defaultInfo = {
		Lang: 'en',
		GEO: 'us',
		OEM: 'Lenovo',
		OS: 'Windows',
		Segment: 'Consumer',
		Brand: 'Lenovo',
	};
	fetchRequestMap = {};
	onlineTaskMap = {};

	constructor(
		private commsService: CommsService,
		private vantageShellService: VantageShellService,
		private localInfoService: LocalInfoService,
		private localCacheService: LocalCacheService,
		private commonService: CommonService, // VAN-5872, server switch feature,
		private logger: LoggerService,
		private sanitizer: DomSanitizer
	) {
		localInfoService
			.getLocalInfo()
			.then((result) => {
				this.localInfo = result;
			})
			.catch((e) => {});
	}

	async deviceFilter(filters) {
		if (!filters) {
			return true;
		}

		try {
			return await this.vantageShellService.deviceFilter(filters);
		} catch {
			return false;
		}
	}

	private getDateTime(date: any): number {
		try {
			if (date && typeof date === 'string') {
				return new Date(date.replace(/\./g, '/')).getTime();
			}
		} catch (e) {}
		return -1;
	}

	// VAN-5872, server switch feature
	// retrive from localStorage
	private updateServerSwitchCMSOptions(defaults, queryParams) {
		const cmsOption = Object.assign(defaults, queryParams);
		try {
			const serverSwitchLocalData = this.localCacheService.getLocalCacheValue(
				LocalStorageKey.ServerSwitchKey
			);
			if (serverSwitchLocalData) {
				const langMap = {
					'sr-latn': 'sr',
				};
				if (langMap[serverSwitchLocalData.language.Value]) {
					serverSwitchLocalData.language.Value =
						langMap[serverSwitchLocalData.language.Value];
				}

				this.commsService.setServerSwitchLocalData(serverSwitchLocalData);
				if (serverSwitchLocalData.forceit) {
					Object.assign(cmsOption, {
						Lang: serverSwitchLocalData.language.Value.toLowerCase(),
						GEO: serverSwitchLocalData.country.Value.toLowerCase(),
						Segment: serverSwitchLocalData.segment,
						OEM: serverSwitchLocalData.oem,
						Brand: serverSwitchLocalData.brand,
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

		return Promise.all(promises).then((deviceFilterValues) =>
			contents.filter((content, index) => deviceFilterValues[index])
		);
	}

	public async getLocalinfo(): Promise<any> {
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

	public getOneCMSContent(
		results,
		template,
		position,
		dataSource = ContentSource.CMS
	): FeatureContent[] {
		return results
			.filter(
				(record) =>
					record.Template === template &&
					record.Position === position &&
					(!record.DisplayStartDate ||
						this.getDateTime(record.DisplayStartDate) <= new Date().getTime())
			)
			.filter((record) => {
				try {
					record.Title = this.sanitizer.sanitize(SecurityContext.HTML, record.Title);
					record.Description = this.sanitizer.sanitize(
						SecurityContext.HTML,
						record.Description
					);
					record.DataSource = dataSource;
				} catch (ex) {
					this.logger.error('CMSService.sanitize error:', ex.message);
					return false;
				}
				return true;
			})
			.sort(this.sortCmsContent.bind(this));
	}

	public fetchCMSContent(queryParams) {
		return new Observable((subscriber) => {
			if (this.commonService.isOnline) {
				this.getCMSContent(queryParams)
					.then((response) => {
						subscriber.next(response);
					})
					.catch((ex) => {
						subscriber.error(ex);
					});
			} else {
				this.onlineTaskMap[
					JSON.stringify(queryParams)
				] = this.commonService.notification.subscribe((notification: AppNotification) => {
					if (notification && notification.type === NetworkStatus.Online) {
						this.getCMSContent(queryParams)
							.then((response) => {
								subscriber.next(response);
							})
							.catch((ex) => {
								subscriber.error(ex);
							});
					}
				});
			}
		});
	}

	async getCMSContent(queryParams: any) {
		const locInfo = await this.getLocalinfo();
		const defaults = {
			Lang: locInfo.Lang,
			GEO: locInfo.GEO,
			OEM: locInfo.OEM,
			OS: locInfo.OS,
			Segment: locInfo.Segment,
			Brand: locInfo.Brand,
		};
		const cmsOption = this.updateServerSwitchCMSOptions(defaults, queryParams);

		const requestKey = JSON.stringify(cmsOption);
		if (!this.fetchRequestMap[requestKey]) {
			this.fetchRequestMap[requestKey] = this.postRequest({
				cmsOption,
				api: '/api/v1/features',
				apiParam: null,
				observableMsg: null,
				applyDeviceFilter: true,
			});
		}

		try {
			return await this.fetchRequestMap[requestKey]; // intercept duplicate request
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
			Brand: locInfo.Brand,
		};
		const cmsOption = this.updateServerSwitchCMSOptions(defaults, queryParams);
		return this.postRequest({
			cmsOption,
			api: '/api/v1/articlecategories',
			apiParam: null,
			observableMsg: 'fetchCMSArticleCategories error',
			applyDeviceFilter: true,
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
			Brand: locInfo.Brand,
		};
		const cmsOption = this.updateServerSwitchCMSOptions(defaults, queryParams);
		return this.postRequest({
			cmsOption,
			api: '/api/v1/articles',
			apiParam: null,
			observableMsg: 'fetchCMSArticles error',
			applyDeviceFilter: true,
		});
	}

	public async fetchCMSArticle(articleId, queryParams?) {
		const locInfo = await this.getLocalinfo();
		const defaults = {
			Lang: locInfo.Lang,
		};
		const cmsOption = this.updateServerSwitchCMSOptions(defaults, queryParams);
		return this.postRequest({
			cmsOption,
			api: '/api/v1/articles/',
			apiParam: articleId,
			observableMsg: null,
			applyDeviceFilter: false,
			responseOrigin: true,
		});
	}

	public async fetchCMSEntitledAppList(queryParams) {
		const locInfo = await this.getLocalinfo();
		const defaults = {
			Lang: locInfo.Lang,
			GEO: locInfo.GEO,
		};
		const cmsOption = this.updateServerSwitchCMSOptions(defaults, queryParams);
		return this.postRequest({
			cmsOption,
			api: '/api/v1/entitledapps',
			apiParam: null,
			observableMsg: 'fetchCMSEntitledAppList error',
			applyDeviceFilter: false,
		});
	}

	public async fetchCMSAppDetails(appId, queryParams) {
		const locInfo = await this.getLocalinfo();
		const defaults = {
			Lang: locInfo.Lang,
		};
		const cmsOption = this.updateServerSwitchCMSOptions(defaults, queryParams);
		return this.postRequest({
			cmsOption,
			api: '/api/v1/apps/',
			apiParam: appId,
			observableMsg: 'fetchCMSAppDetails error',
			applyDeviceFilter: false,
		});
	}

	public async postRequest(param: RequestParam) {
		const {
			cmsOption,
			api,
			apiParam,
			observableMsg,
			applyDeviceFilter,
			responseOrigin,
		} = param;

		let results;
		try {
			const composeApi = apiParam ? api + apiParam : api;
			const response: any = await this.commsService
				.endpointGetCall(composeApi, cmsOption, {})
				.toPromise();

			if (applyDeviceFilter) {
				results = await this.filterCMSContent(response.Results);
			} else {
				results = responseOrigin ? response : response.Results;
			}
			return results;
		} catch (ex) {
			if (observableMsg) {
				throwError(new Error(observableMsg));
			} else {
				throw ex;
			}
		}
	}

	public async generateContentQueryParams(queryParams) {
		const locInfo = await this.getLocalinfo();
		const defaults = {
			Lang: locInfo.Lang,
			GEO: locInfo.GEO,
			OEM: locInfo.OEM,
			OS: locInfo.OS,
			Segment: locInfo.Segment,
			Brand: locInfo.Brand,
		};
		return this.updateServerSwitchCMSOptions(defaults, queryParams);
	}

	public async fetchContents(cmsOption: any) {
		const requestKey = JSON.stringify(cmsOption);
		if (!this.fetchRequestMap[requestKey]) {
			this.fetchRequestMap[requestKey] = this.postRequest({
				cmsOption,
				api: '/api/v1/features',
				apiParam: null,
				observableMsg: null,
				applyDeviceFilter: true,
			});
		}

		try {
			return await this.fetchRequestMap[requestKey];
		} finally {
			this.fetchRequestMap[requestKey] = null;
		}
	}

	ngOnDestroy() {
		for (const prop in this.onlineTaskMap) {
			if (this.onlineTaskMap.hasOwnProperty(prop)) {
				this.onlineTaskMap[prop].unsubscribe();
			}
		}
	}
}
