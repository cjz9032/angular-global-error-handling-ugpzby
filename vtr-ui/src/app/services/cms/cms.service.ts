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

	constructor(
		private commsService: CommsService,
		private vantageShellService: VantageShellService,
		localInfoService: LocalInfoService,
		private commonService: CommonService// VAN-5872, server switch feature
	) {
		localInfoService.getLocalInfo().then(result => {
			this.localInfo = result;
		}).catch(e => {
			this.localInfo = {
				Lang: 'en',
				GEO: 'us',
				OEM: 'Lenovo',
				OS: 'Windows',
				Segment: 'SMB',
				Brand: 'Lenovo'
			};
			console.log(e);
		});
	}

	deviceFilter(filters) {
		return new Promise((resolve, reject) => {
			if (!filters) {
				console.log('vantageShellService.deviceFilter skipped filter call due to empty filter.');
				return resolve(true);
			}

			return this.vantageShellService.deviceFilter(filters).then(
				(result) => {
					resolve(result);
				},
				(reason) => {
					console.log('vantageShellService.deviceFilter error', reason);
					resolve(false);
				}
			);
		});
	}

	filterCMSContent(results) {
		return new Promise((resolve, reject) => {
			const promises = [];

			results.forEach((result) => {
				promises.push(this.deviceFilter(result.Filters));
			});

			Promise.all(promises).then((deviceFilterValues) => {
				const filteredResults = results.filter((result, index) => {
					return deviceFilterValues[index];
				});

				resolve(filteredResults);
			});
		});
	}

	fetchCMSContent(queryParams) {
		if (!this.localInfo) {
			return;
		}
		const defaults = {
			Lang: this.localInfo.Lang,
			GEO: this.localInfo.GEO,
			OEM: this.localInfo.OEM,
			OS: this.localInfo.OS,
			Segment: this.localInfo.Segment,
			Brand: this.localInfo.Brand
		};
		// Object.assign(defaults, queryParams);

		// VAN-5872, server switch feature
		// retrive from localStorage
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
			this.filterCMSContent(response.Results).then(
				(result) => {
					subscriber.next(result);
					subscriber.complete();
				},
				(reason) => {
					console.log('fetchCMSContent error', reason);
					subscriber.error(reason);
				}
			);
		},
			error => {
				console.log('fetchCMSContent error', error);
				subscriber.error(error);
			}
		);
	}

	fetchCMSArticleCategories(queryParams) {
		if (!this.localInfo) {
			return;
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
								console.log('fetchCMSContent error', reason);
								reject('fetchCMSContent error');
							}
						);
					},
					error => {
						console.log('fetchCMSContent error', error);
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
								console.log('fetchCMSContent error', reason);
								reject('fetchCMSContent error');
							}
						);
					},
					error => {
						console.log('fetchCMSArticles error', error);
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
						console.log('fetchCMSArticle error', error);
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

	private updateServerSwitchCMSOptions(defaults, queryParams) {
		const CMSOption = Object.assign(defaults, queryParams);
		try {
			const serverSwitchLocalData = this.commonService.getLocalStorageValue(LocalStorageKey.ServerSwitchKey);
			if (serverSwitchLocalData) {
				this.commsService.setServerSwitchLocalData(serverSwitchLocalData);
				if (serverSwitchLocalData.forceit) {
					Object.assign(CMSOption, {
						Lang: (serverSwitchLocalData.language.Value).toLowerCase(),
						GEO: (serverSwitchLocalData.country.Value).toLowerCase(),
						Segment: serverSwitchLocalData.segment.Value
					});
				}

			}
		} catch (error) {
			console.error(error.message);
		}
		return CMSOption;

	}
}
