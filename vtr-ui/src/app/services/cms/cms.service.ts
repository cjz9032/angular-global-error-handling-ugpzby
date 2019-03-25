import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { CommsService } from '../comms/comms.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json',
		'Authorization': 'Access-Control-Allow-Origin'
	})
};

@Injectable({
	providedIn: 'root'
})
export class CMSService {
	constructor(
		private commsService: CommsService,
		private vantageShellService: VantageShellService
	) { }

	deviceFilter(result) {
		return new Promise((resolve, reject) => {
			return this.vantageShellService.deviceFilter(result).then(
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
			let promises = [];

			results.forEach((result) => {
				promises.push(this.deviceFilter(result));
			});

			Promise.all(promises).then((deviceFilterValues) => {
				let filteredResults = results.filter((result, index) => {
					return deviceFilterValues[index];
				});

				resolve(filteredResults);
			});
		});
	}

	fetchCMSContent(queryParams) {
		return new Promise((resolve, reject) => {
			this.commsService.endpointGetCall('/api/v1/features', queryParams, {}).subscribe(
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
		return new Promise((resolve, reject) => {
			this.commsService.endpointGetCall('/api/v1/articles', queryParams, {}).subscribe(
				(response: any) => {
					if (returnAll) {
						resolve(response.Results);
					} else {
						//Temporarily filter 3 records to show on UI
						resolve(response.Results.filter((result) => {
							return (result.Id === '58f4df46f647422e933037dc36891e55' ||
								result.Id === 'd80509600aef4c55b9d77f603447a960' ||
								result.Id === 'd6ab7ed5239a411c87c0ed726a53e25d')
						}));
					}
				},
				error => {
					console.log('fetchCMSArticles error', error);
					reject('fetchCMSArticles error');
				}
			);
		});
	}

	fetchCMSArticle(articleId, queryParams) {
		return new Promise((resolve, reject) => {
			this.commsService.endpointGetCall('/api/v1/articles/' + articleId, queryParams, {}).subscribe(
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
}
