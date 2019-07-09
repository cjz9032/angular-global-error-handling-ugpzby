import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { CommsService } from '../comms/comms.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { RegionService } from '../region/region.service';

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
	language: string;
	region: string;

	constructor(
		private commsService: CommsService,
		private vantageShellService: VantageShellService,
		regionService: RegionService
	) {
		regionService.getRegion().subscribe({
			next: x => {
				this.region = x;
			},
			error: err => {
				this.region = 'us';
			}
		});
		regionService.getLanguage().subscribe({
			next: x => {
				this.language = x;
			},
			error: err => {
				this.language = 'en';
			}
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
			let promises = [];

			results.forEach((result) => {
				promises.push(this.deviceFilter(result.Filters));
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
		const defaults = {
			'Lang': this.language,
			'GEO': this.region,
			'OEM': 'Lenovo',
			'OS': 'Windows',
			'Segment': 'SMB',
			'Brand': 'Lenovo'
		};
		Object.assign(defaults, queryParams);
		return new Promise((resolve, reject) => {
			this.commsService.endpointGetCall(
				'/api/v1/features', Object.assign(defaults, queryParams), {}
			).subscribe((response: any) => {
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

	fetchCMSArticleCategories(queryParams) {
		return new Promise((resolve, reject) => {
			this.commsService.endpointGetCall('/api/v1/articlecategories', queryParams, {}).subscribe(
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
		const that = this;
		return new Promise((resolve, reject) => {
			this.commsService.endpointGetCall(
				'/api/v1/articles/' + articleId,
				Object.assign({ Lang: that.language }, queryParams))
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
}
