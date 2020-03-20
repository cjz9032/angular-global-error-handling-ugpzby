import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { CommsService } from '../comms/comms.service';
import { CommonService } from '../common/common.service'; // VAN-5872, server switch feature
import { LocalStorageKey } from '../../enums/local-storage-key.enum'; // VAN-5872, server switch feature
import { Observable } from 'rxjs/internal/Observable';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { FeatureContent } from 'src/app/data-models/common/feature-content.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { LocalInfoService } from '../local-info/local-info.service';
import { DevService } from '../dev/dev.service';
import { LoggerService } from '../logger/logger.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { throwError } from 'rxjs';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json',
	})
};

@Injectable({
	providedIn: 'root'
})
export class CMSService {
	language: string;
	region: string;
	segment: string; // VAN-5872, server switch feature
	localInfo: any;
	defaultInfo = { Lang: 'en', GEO: 'us', OEM: 'Lenovo', OS: 'Windows', Segment: 'Consumer', Brand: 'Lenovo' };
	fetchRequestMap = {};
	constructor(
		private commsService: CommsService,
		private vantageShellService: VantageShellService,
		private localInfoService: LocalInfoService,
		private commonService: CommonService, // VAN-5872, server switch feature,
		private devService: DevService,
		private logger: LoggerService
	) {
		localInfoService.getLocalInfo().then(result => {
			this.localInfo = result;
		}).catch(e => {});
	}

	deviceFilter(filters) {
		return new Promise((resolve, reject) => {
			if (!filters) {
				// console.log('vantageShellService.deviceFilter skipped filter call due to empty filter.');
				// this.devService.writeLog('vantageShellService.deviceFilter skipped filter call due to empty filter.');
				return resolve(true);
			}

			return this.vantageShellService.deviceFilter(filters).then(
				(result) => {
					// this.devService.writeLog('vantageShellService.deviceFilter filters', JSON.stringify(filters));
					// this.devService.writeLog('vantageShellService.deviceFilter result', JSON.stringify(result));
					resolve(result);

				},
				(reason) => {
					// console.log('vantageShellService.deviceFilter error', reason);
					// this.devService.writeLog('vantageShellService.deviceFilter error', reason);
					resolve(false);
				}
			);
		});
	}

	private filterCMSContent(results) {
		return new Promise((resolve, reject) => {
			const promises = [];

			// this.devService.writeLog('filterCMSContent results :: ', JSON.stringify(results));
			results.forEach((result) => {
				promises.push(this.deviceFilter(result.Filters));
				/* this.devService.writeLog('filterCMSContent result', JSON.stringify(result)); */
			});

			Promise.all(promises).then((deviceFilterValues) => {
				const filteredResults = results.filter((result, index) => {
					// this.devService.writeLog('filterCMSContent deviceFilterValues :: result ', JSON.stringify(result));
					return deviceFilterValues[index];
				});
				// this.devService.writeLog('filterCMSContent filteredResults :: filteredResults ', JSON.stringify(filteredResults));
				resolve(filteredResults);
			});
		});
	}

	fetchCMSContent(queryParams) {
		if (!this.localInfo) {
			return new Observable(subscriber => {
				this.localInfoService.getLocalInfo().then(result => {
					this.localInfo = result;
				}).finally(()=>{
					this.requestCMSContent(queryParams, this.localInfo || this.defaultInfo ).subscribe(subscriber);
				});
			});
		} else {
			return this.requestCMSContent(queryParams, this.localInfo);
		}
	}

	requestCMSContent(queryParams, locInfo) {
		const defaults = {
			Lang: locInfo.Lang,
			GEO: locInfo.GEO,
			OEM: locInfo.OEM,
			OS: locInfo.OS,
			Segment: locInfo.Segment,
			Brand: locInfo.Brand
		};

		const CMSOption = this.updateServerSwitchCMSOptions(defaults, queryParams);
		// console.log('@sahinul cms service',CMSOption);

		return new Observable(subscriber => {
			if (this.commonService.isOnline) {
				this.getCMSContent(CMSOption).then(response => {
					subscriber.next(response);
				}).catch(ex => {
					subscriber.error(ex);
				});
			} else {
				this.commonService.notification.subscribe((notification: AppNotification) => {
					if (notification && notification.type === NetworkStatus.Online) {
						this.getCMSContent(CMSOption).then(response => {
							subscriber.next(response);
						}).catch(ex => {
							subscriber.error(ex);
						});
					}
				});
			}
		});
	}

	async getCMSContent(CMSOption: any) {
		const requestKey = CMSOption ? JSON.stringify(CMSOption) : 'default_request_key';
		if (!this.fetchRequestMap[requestKey]) {
			this.fetchRequestMap[requestKey] = this.commsService.endpointGetCall(
				'/api/v1/features', CMSOption, httpOptions// VAN-5872, server switch feature
			).toPromise();
		};

		try {
			const response = await this.fetchRequestMap[requestKey];
			return await this.filterCMSContent(response.Results);
		} finally {
			this.fetchRequestMap[requestKey] = null;
		}
	}

	fetchCMSArticleCategories(queryParams) {
		if (!this.localInfo) {
			return this.localInfoService.getLocalInfo().then(result => {
				this.localInfo = result;
				return this.requestCMSArticleCategories(queryParams, this.localInfo);
			}).catch(e => {
				return this.requestCMSArticleCategories(queryParams, this.defaultInfo);
			});
		} else {
			return this.requestCMSArticleCategories(queryParams, this.localInfo);
		}
	}

	requestCMSArticleCategories(queryParams, locInfo) {
		// VAN-5872, server switch feature
		// retrive from localStorage
		const defaults = {
			Lang: locInfo.Lang,
			GEO: locInfo.GEO,
			OEM: locInfo.OEM,
			OS: locInfo.OS,
			Segment: locInfo.Segment,
			Brand: locInfo.Brand
		};
		const CMSOption = this.updateServerSwitchCMSOptions(defaults, queryParams);

		return new Promise((resolve, reject) => {
			this.commsService.endpointGetCall('/api/v1/articlecategories',
				/*queryParams*/
				CMSOption, // VAN-5872, server switch feature
				{}).subscribe(
					(response: any) => {
						this.filterCMSContent(response.Results).then(
							(result) => {
								resolve(result);
							},
							(reason) => {
								// reject('fetchCMSContent error');
								throwError(new Error('fetchCMSContent error'))
							}
						);
					},
					error => {
						// reject('fetchCMSContent error');
						throwError(new Error('fetchCMSContent error'))
					}
				);
		});
	}


	async fetchCMSArticles(queryParams, returnAll = false) {
		if (!this.localInfo) {
			try {
				this.localInfo = await this.localInfoService.getLocalInfo();
			} catch (ex) {}
		}

		const localInfo = this.localInfo || this.defaultInfo;
		return this.requestCMSArticles(queryParams, localInfo);
	}


	requestCMSArticles(queryParams, locInfo) {
		// VAN-5872, server switch feature
		// retrive from localStorage
		const defaults = {
			Lang: locInfo.Lang,
			GEO: locInfo.GEO,
			OEM: locInfo.OEM,
			OS: locInfo.OS,
			Segment: locInfo.Segment,
			Brand: locInfo.Brand
		};
		const CMSOption = this.updateServerSwitchCMSOptions(defaults, queryParams);

		return new Promise((resolve, reject) => {
			this.commsService.endpointGetCall('/api/v1/articles',
				/*queryParams*/
				CMSOption, // VAN-5872, server switch feature
				{}).subscribe(
					(response: any) => {
						this.filterCMSContent(response.Results).then(
							(result) => {
								resolve(result);
							},
							(reason) => {
								// reject('fetchCMSContent error');
								throwError(new Error('fetchCMSContent error'))
							}
						);
					},
					error => {
						// reject('fetchCMSArticles error');
						throwError(new Error('fetchCMSContent error'))
					}
				);
		});
	}


	async fetchCMSArticle(articleId, queryParams?) {
		if (!this.localInfo) {
			try {
				this.localInfo = await this.localInfoService.getLocalInfo();
			} catch (ex) {}
		}

		const localInfo = this.localInfo || this.defaultInfo;
		return this.requestCMSArticle(articleId, localInfo, queryParams);
	}

	requestCMSArticle(articleId, locInfo, queryParams?) {
		const defaults = {
			Lang: locInfo.Lang
		};

		const CMSOption = this.updateServerSwitchCMSOptions(defaults, queryParams);

		return new Promise((resolve, reject) => {
			this.commsService.endpointGetCall(
				'/api/v1/articles/' + articleId,
				/*Object.assign({ Lang: that.language }, queryParams)*/
				CMSOption // VAN-5872, server switch feature
			)
				.subscribe(
					(response: any) => {
						resolve(response);
					},
					error => {
                        reject('fetchCMSArticle error');
                    }
				);
		});
	}

	getOneCMSContent(results, template, position): FeatureContent[] {
		return results.filter((record) => {
			return (
				record.Template === template &&
				record.Position === position &&
				(
					!record.DisplayStartDate ||
					this.getDateTime(record.DisplayStartDate) <= new Date().getTime()
				)
			);
		}).sort(this.sortCmsContent.bind(this));
	}

	sortCmsContent(a, b): number {
		if (a.Priority === b.Priority) {
			return this.getDateTime(b.DisplayStartDate) - this.getDateTime(a.DisplayStartDate);
		}
		return a.Priority.localeCompare(b.Priority);
	}

	getDateTime(date: any): number {
		try{
			if (date && typeof date === 'string') {
				return new Date(date.replace(/\./g, '\/')).getTime();
			}
		}catch(e){}
		return -1;
	}

	/* const CMSOption = Object.assign(defaults, queryParams);
		const serverSwitchLocalData = this.commonService.getLocalStorageValue(LocalStorageKey.ServerSwitchKey);
		if (serverSwitchLocalData) {
			if (serverSwitchLocalData.forceit) {
				Object.assign(CMSOption, {
					Lang: (serverSwitchLocalData.language.Value).toUpperCase(),
					GEO: (serverSwitchLocalData.country.Value).toUpperCase(),
					Segment: serverSwitchLocalData.segment.Value
				});
			}
		} */
	// Object.assign(defaults, queryParams);
	// VAN-5872, server switch feature
	// retrive from localStorage
	private updateServerSwitchCMSOptions(defaults, queryParams) {
		const CMSOption = Object.assign(defaults, queryParams);
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
					Object.assign(CMSOption, {
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
		return CMSOption;

	}

	fetchCMSEntitledAppList(queryParams) {
		const defaults = {
			Lang: this.localInfo.Lang,
			GEO: this.localInfo.GEO
		};

		const CMSOption = this.updateServerSwitchCMSOptions(defaults, queryParams);

		return new Promise((resolve, reject) => {
			this.commsService.endpointGetCall('/api/v1/entitledapps',
				CMSOption,
				{}).subscribe(
					(response: any) => {
						resolve(response.Results);
					},
					error => {
						// reject('fetchCMSEntitledAppList error');
						throwError(new Error('fetchCMSEntitledAppList error'))
					}
				);
		});
	}

	fetchCMSAppDetails(appId, queryParams) {
		const defaults = {
			Lang: this.localInfo.Lang
		};

		const CMSOption = this.updateServerSwitchCMSOptions(defaults, queryParams);

		return new Promise((resolve, reject) => {
			this.commsService.endpointGetCall('/api/v1/apps/' + appId,
				CMSOption,
				{}).subscribe(
					(response: any) => {
						resolve(response.Results);
					},
					error => {
						// reject('fetchCMSAppDetails error');
						throwError(new Error('fetchCMSAppDetails error'))
					}
				);
		});
	}
}
