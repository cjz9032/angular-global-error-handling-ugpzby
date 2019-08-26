import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { CommsService } from '../comms/comms.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { CommonService } from '../common/common.service'; // VAN-5872, server switch feature
import { LocalStorageKey } from '../../enums/local-storage-key.enum'; // VAN-5872, server switch feature
import { Observable } from 'rxjs/internal/Observable';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { LocalInfoService } from '../local-info/local-info.service';
import { DevService } from '../dev/dev.service';
import { LoggerService } from '../logger/logger.service';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json',
		Authorization: 'Access-Control-Allow-Origin'
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
	defaultInfo = { Lang: 'en', GEO: 'us', OEM: 'Lenovo', OS: 'Windows', Segment: 'SMB', Brand: 'Lenovo' };

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
		}).catch(e => {
			this.localInfo = this.defaultInfo;
			console.log(e);
		});
	}

	deviceFilter(filters) {
		return new Promise((resolve, reject) => {
			if (!filters) {
				console.log('vantageShellService.deviceFilter skipped filter call due to empty filter.');
				// this.devService.writeLog('vantageShellService.deviceFilter skipped filter call due to empty filter.');
				return resolve(true);
			}

			return this.vantageShellService.deviceFilter(filters).then(
				(result) => {
					this.devService.writeLog('vantageShellService.deviceFilter filters', JSON.stringify(filters));
					this.devService.writeLog('vantageShellService.deviceFilter result', JSON.stringify(result));
					resolve(result);

				},
				(reason) => {
					console.log('vantageShellService.deviceFilter error', reason);
					this.devService.writeLog('vantageShellService.deviceFilter error', reason);
					resolve(false);
				}
			);
		});
	}

	filterCMSContent(results) {
		return new Promise((resolve, reject) => {
			const promises = [];

			// this.devService.writeLog('filterCMSContent results :: ', JSON.stringify(results));
			results.forEach((result) => {
				promises.push(this.deviceFilter(result.Filters));
				/* this.devService.writeLog('filterCMSContent result', JSON.stringify(result)); */
			});

			Promise.all(promises).then((deviceFilterValues) => {
				const filteredResults = results.filter((result, index) => {
					this.devService.writeLog('filterCMSContent deviceFilterValues :: result ', JSON.stringify(result));
					return deviceFilterValues[index];
				});
				this.devService.writeLog('filterCMSContent filteredResults :: filteredResults ', JSON.stringify(filteredResults));
				resolve(filteredResults);
			});
		});
	}

	fetchCMSContent(queryParams) {
		if (!this.localInfo) {
			return new Observable(subscriber => {
				this.localInfoService.getLocalInfo().then(result => {
					this.localInfo = result;
					this.fetchCMSContent(queryParams).subscribe((result2: any) => {
						subscriber.next(result2);
					});
				}).catch(e => {
					this.localInfo = this.defaultInfo;
					this.fetchCMSContent(queryParams).subscribe((result2: any) => {
						subscriber.next(result2);
					});
				});
			});
		}
		const defaults = {
			Lang: this.localInfo.Lang,
			GEO: this.localInfo.GEO,
			OEM: this.localInfo.OEM,
			OS: this.localInfo.OS,
			Segment: this.localInfo.Segment,
			Brand: this.localInfo.Brand
		};

		const CMSOption = this.updateServerSwitchCMSOptions(defaults, queryParams);
		// console.log('@sahinul cms service',CMSOption);

		return new Observable(subscriber => {
			if (this.commonService.isOnline) {
				this.getCMSContent(CMSOption, subscriber);
			} else {
				this.commonService.notification.subscribe((notification: AppNotification) => {
					if (notification && notification.type === NetworkStatus.Online) {
						this.getCMSContent(CMSOption, subscriber);
					}
				}
				);
			}
		});
	}

	getCMSContent(CMSOption: any, subscriber: any) {
		this.commsService.endpointGetCall(
			/*'/api/v1/features', Object.assign(defaults, queryParams), {}*/
			'/api/v1/features', CMSOption, httpOptions// VAN-5872, server switch feature
		).subscribe((response: any) => {
			/* this.devService.writeLog('getCMSContent ', JSON.stringify(response.Results)); */
			this.filterCMSContent(response.Results).then(
				(result) => {
					this.devService.writeLog('getCMSContent::filterCMSContent::result', JSON.stringify(result));
					subscriber.next(result);
					subscriber.complete();
				},
				(reason) => {
					this.devService.writeLog('getCMSContent::error', reason);
					console.log('getCMSContent::error', reason);
					subscriber.error(reason);
				}
			);
		},
			error => {
				console.log('getCMSContent::error', error);
				subscriber.error(error);
			}
		);
	}

	fetchCMSArticleCategories(queryParams) {
		if (!this.localInfo) {
			return this.localInfoService.getLocalInfo().then(result => {
				this.localInfo = result;
				return this.fetchCMSArticleCategories(queryParams);
			}).catch(e => {
				this.localInfo = this.defaultInfo;
				return this.fetchCMSArticleCategories(queryParams);
			});
		}
		// VAN-5872, server switch feature
		// retrive from localStorage
		const defaults = {
			Lang: this.localInfo.Lang,
			GEO: this.localInfo.GEO,
			OEM: this.localInfo.OEM,
			OS: this.localInfo.OS,
			Segment: this.localInfo.Segment,
			Brand: this.localInfo.Brand
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
								console.log('fetchCMSArticleCategories:error', reason);
								reject('fetchCMSContent error');
							}
						);
					},
					error => {
						console.log('fetchCMSArticleCategories::error', error);
						reject('fetchCMSContent error');
					}
				);
		});
	}

	fetchCMSArticles(queryParams, returnAll = false) {
		// VAN-5872, server switch feature
		// retrive from localStorage
		const defaults = {
			Lang: this.localInfo.Lang,
			GEO: this.localInfo.GEO,
			OEM: this.localInfo.OEM,
			OS: this.localInfo.OS,
			Segment: this.localInfo.Segment,
			Brand: this.localInfo.Brand
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
								console.log('fetchCMSArticles:: error', reason);
								reject('fetchCMSContent error');
							}
						);
					},
					error => {
						console.log('fetchCMSArticles:: error', error);
						reject('fetchCMSArticles error');
					}
				);
		});
	}

	fetchCMSArticle(articleId, queryParams?) {
		// VAN-5872, server switch feature
		// retrive from localStorage
		const defaults = {
			Lang: this.localInfo.Lang,
			GEO: this.localInfo.GEO,
			OEM: this.localInfo.OEM,
			OS: this.localInfo.OS,
			Segment: this.localInfo.Segment,
			Brand: this.localInfo.Brand
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
						console.log('fetchCMSArticle::error', error);
						reject('fetchCMSArticle error');
					}
				);
		});
	}

	getOneCMSContent(results, template, position) {
		return results.filter((record) => {
			return record.Template === template;
		}).filter((record) => {
			return record.Position === position;
		}).sort((a, b) => a.Priority.localeCompare(b.Priority));
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
						console.log('fetchCMSEntitledAppList::error ', error);
						reject('fetchCMSEntitledAppList error');
					}
				);
		});
	}
}
