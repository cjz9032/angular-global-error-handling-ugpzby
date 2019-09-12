import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { DeviceService } from 'src/app/services/device/device.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { CommonService } from 'src/app/services/common/common.service';

@Injectable({
	providedIn: 'root'
})
export class AppSearchService {
	public scrollAnchor: string;
	public readonly notification: Observable<string>;
	private readonly scrollAnchors = {};
	private notificationSubject: BehaviorSubject<string>;
	private loaded = false;
	private isBetaUserPromise: any;
	private betaRoutes = [];
	public searchText = '';
	public searchResults = [
		/*{
			icon: ['fal', 'search'],
			text: 'Suggested search Item',
			route: '/dashboard',
			Id: 'vtrAppSearchScroll',
		}*/
	];
	private searchDB = {
		features: {
			tags: {},
			relevantTags: {}
		},
		articles: {
			tags: {},
			relevantTags: {}
		}
	};

	constructor(
		private translateService: TranslateService,
		private http: HttpClient,
		private deviceService: DeviceService,
		private configService: ConfigService,
		private commonService: CommonService) {
		this.notification = this.notificationSubject;
		this.betaMenuMapPaths();
		this.loadSearchIndex();
	}

	betaMenuMapPaths() {
		const betaMenu = this.configService.betaItem;
		if (betaMenu && betaMenu.length > 0) {
			this.betaRoutes = betaMenu.map(menuItem => '/' + menuItem.path);
		}
	}

	private async betaVerification(item: any) {
		if (!item.route) {
			return true;
		}

		const isBetaUser = await this.isBetaUserPromise;
		if (!isBetaUser && this.betaRoutes.indexOf(item.route) !== -1) {
			return false;
		}
		return true;
	}

	async isFeatureSupported(item) {
		if (item.gamingSupport === false && this.deviceService.isGaming) {
			return false;
		}

		if (item.armSupport === false && this.deviceService.isArm) {
			return false;
		}

		if (item.smodeSupport === false && this.deviceService.isSMode) {
			return false;
		}

		return await this.betaVerification(item);
	}

	addFeatureToSet(dataSet, keyword, feature) {
		if (!dataSet[keyword]) {
			dataSet[keyword] = [];
		}
		dataSet[keyword].push(feature);
	}

	async loadSearchIndex() {
		if (this.loaded) {
			return;
		}


		if (this.translateService.currentLang && this.translateService.currentLang !== 'en') {
			return;
		}

		this.isBetaUserPromise = this.commonService.isBetaUser();
		this.loaded = true;
		const tags = this.searchDB.features.tags;
		const relevantTags = this.searchDB.features.relevantTags;


		const dataSource = await this.http.get('./assets/i18n/app-search/en.json').toPromise() as any;
		if (!dataSource.features) {
			return;
		}

		Object.keys(dataSource.features).forEach(async (key) => {
			const featuresGroup = dataSource.features[key];
			if (!featuresGroup || !key) {
				return;
			}

			let itemRoute = key;
			if (key[0] !== '/') {
				itemRoute = '/' + key;
			}

			if (!await this.isFeatureSupported(featuresGroup)) {
				return;
			}

			Object.keys(featuresGroup).forEach(async (subKey) => {
				const feature = featuresGroup[subKey];
				if (typeof feature !== 'object') {
					return;
				}

				feature.id = subKey;
				feature.route = itemRoute;
				if (!await this.isFeatureSupported(feature)) {
					return;
				}

				feature.tags.forEach(keyword => {
					keyword = keyword.toLocaleLowerCase();
					this.addFeatureToSet(tags, keyword, feature);
				});

				feature.relevantTags.forEach(keyword => {
					keyword = keyword.toLocaleLowerCase();
					this.addFeatureToSet(relevantTags, keyword, feature);
				});
			});
		});
	}

	addSearchResult(resultSet, resultList, item) {
		if (!resultSet[item.id]) {
			resultSet[item.id] = true;
			resultList.push(item);
		}
	}

	search(keywords: string) {
		const resultList = [];
		const resultSet = {};

		if (!keywords) {
			this.searchResults = resultList;
			return resultList;
		}

		keywords = keywords.toLocaleLowerCase();
		let result = this.searchDB.features.tags[keywords];
		if (result) {
			result.forEach(item => {
				this.addSearchResult(resultSet, resultList, item);
			});
		}

		Object.keys(this.searchDB.features.tags).forEach(
			(key) => {
				if (key !== keywords
					&& (key.indexOf(keywords) !== -1 || keywords.indexOf(key) !== -1)) {
					this.searchDB.features.tags[key].forEach(item => {
						this.addSearchResult(resultSet, resultList, item);
					});
				}
			}
		);

		result = this.searchDB.features.relevantTags[keywords];
		if (result) {
			result.forEach(item => {
				this.addSearchResult(resultSet, resultList, item);
			});
		}

		Object.keys(this.searchDB.features.relevantTags).forEach(
			(key) => {
				if (key !== keywords
					&& (key.indexOf(keywords) !== -1 || keywords.indexOf(key) !== -1)) {
					this.searchDB.features.relevantTags[key].forEach(item => {
						this.addSearchResult(resultSet, resultList, item);
					});
				}
			}
		);

		this.searchResults = resultList;
		return resultList;
	}

	activeScroll(anchorId: string) {
		this.scrollAnchor = anchorId;
		const handler = this.scrollAnchors[anchorId];
		if (handler) {
			handler();
		}
	}

	registerAnchor(anchorIdArray: Array<string>, scrollAction: any) {
		if (!anchorIdArray || anchorIdArray.length === 0) {
			return;
		}

		anchorIdArray.forEach((anchorId) => {
			this.scrollAnchors[anchorId] = scrollAction;
		});
	}

	deRegisterAnchor(anchorIdArray: Array<string>) {
		if (!anchorIdArray || anchorIdArray.length === 0) {
			return;
		}

		anchorIdArray.forEach((anchorId) => {
			this.scrollAnchors[anchorId] = null;
		});
	}
}
