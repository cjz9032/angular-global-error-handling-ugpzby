import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { DeviceService } from 'src/app/services/device/device.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { CommonService } from 'src/app/services/common/common.service';
import { BetaService } from 'src/app/services/beta/beta.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';

@Injectable({
	providedIn: 'root'
})
export class AppSearchService {
	public targetFeature: any = null;
	private readonly scrollAnchors = {};
	private unSupportfeatureEvt: BehaviorSubject<string> = new BehaviorSubject('');
	private loaded = false;
	private isBetaUserRes: any;
	private betaRoutes = [];
	private unsupportedFeatures;
	private regionPromise: any;
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
		private commonService: CommonService,
		private localInfoService: LocalInfoService,
		private betaService: BetaService
		) {
		this.betaMenuMapPaths();
		if (deviceService.showSearch) {
			this.loadSearchIndex();
		}
		this.unsupportedFeatures = new Set();
		const featuresArray = this.commonService.getLocalStorageValue(LocalStorageKey.UnSupportFeatures);
		if (featuresArray !== undefined && featuresArray.length !== undefined) {
			this.unsupportedFeatures = new Set(featuresArray);
		}

		this.regionPromise = new Promise((resolve) => {
			this.localInfoService.getLocalInfo()
				.then((result) => {
					resolve(result.GEO);
				})
				.catch((e) => {
					resolve('us');
				});
		});
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

		const isBetaUser = await this.isBetaUserRes;
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

		const matchBeta = await this.betaVerification(item);
		if (!matchBeta) {
			return false;
		}

		if (item.regionSupport !== undefined) {
			const region = await this.regionPromise;
			if (item.regionSupport[0] === '-') {
				return item.regionSupport.indexOf(region) === -1;
			} else {
				return item.regionSupport.indexOf(region) !== -1;
			}
		}

		return true;
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

		this.isBetaUserRes = this.betaService.getBetaStatus();
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
				if (feature.tags) {
					feature.tags.forEach(keyword => {
						keyword = keyword.toLocaleLowerCase();
						this.addFeatureToSet(tags, keyword, feature);
					});
				}
				if (feature.relevantTags) {
					feature.relevantTags.forEach(keyword => {
						keyword = keyword.toLocaleLowerCase();
						this.addFeatureToSet(relevantTags, keyword, feature);
					});
				}
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

		this.searchResults = resultList.filter(item => !this.unsupportedFeatures.has(item.id));
	}

	activeScroll() {
		if (!this.targetFeature) {
			return;
		}

		const handler = this.scrollAnchors[this.targetFeature.id];
		if (handler) {
			handler();
			this.targetFeature = null;
		} else {
			this.collectError();
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

	private collectError() {
		if (this.targetFeature) {
			this.unsupportedFeatures.add(this.targetFeature.id);
			this.commonService.setLocalStorageValue(LocalStorageKey.UnSupportFeatures, Array.from(this.unsupportedFeatures));
			this.searchResults = this.searchResults.filter(item => !this.unsupportedFeatures.has(item.id));
			this.unSupportfeatureEvt.next(this.targetFeature.desc);
			this.targetFeature = null;
		}
	}

	isScrollPending(anchorIdArray: string[]) {
		if (this.targetFeature && anchorIdArray.indexOf(this.targetFeature.id) !== -1) {
			return true;
		}
	}

	getUnsupportFeatureEvt() {
		return this.unSupportfeatureEvt.asObservable();
	}
}
