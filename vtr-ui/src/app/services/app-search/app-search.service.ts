import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { MenuItemEvent } from 'src/app/enums/menuItemEvent.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { featureMap as featureSource } from './features.model';
import { IFeature, IFeatureAction, INavigationAction, SearchActionType } from './interface.model';
import { SearchEngineWraper } from './search-engine-wraper';

@Injectable({
	providedIn: 'root'
})

export class AppSearchService {
	private featureLoad = false;
	private featureMap = {};
	private searchContext = {};
	private searchEngine: SearchEngineWraper;
	private subscription: Subscription;
	private menuRouteMap = {};

	constructor(
		private translate: TranslateService,
		private router: Router,
		private commonService: CommonService) {
			this.subscription = this.commonService.notification.subscribe(
				(notification: AppNotification) => {
					this.onNotification(notification);
				}
			);
	}

	public load() {
		if (this.featureLoad) {
			return;
		}

		this.featureLoad = true;
		this.searchEngine = new SearchEngineWraper();

		const featureTranslation = this.translate.instant('appSearch');

		// transfer pages to feature map
		Object.keys(featureSource.pages).forEach(pageName => {
			this.featureMap[`appSearch.pages.${pageName}`] = featureSource.pages[pageName];
		});

		// register pages keywords to search engine
		Object.keys(featureTranslation.pages).forEach(pageName => {
			const featureId = `appSearch.pages.${pageName}`;
			const featureName = featureTranslation.pages[pageName].featureName;
			this.featureMap[featureId].featureName = featureName;
			this.featureMap[featureId].category = featureName; // for a page, feature name is also category name

			this.searchContext[featureId] = {
				id: featureId,
				featureName: featureTranslation.pages[pageName].featureName,
				highRelevantKeywords: featureTranslation.pages[pageName].highRelevantKeywords,
				lowRelevantKeywords: featureTranslation.pages[pageName].lowRelevantKeywords
			};
		});

		// transfer features to feature map
		Object.keys(featureSource.features).forEach(pageName => {
			const pages = featureSource.features[pageName];
			Object.keys(pages).forEach(featureKey => {
				if (featureKey === 'category') {
					return;
				}

				const featureId = `appSearch.features.${pageName}.${featureKey}`;
				this.featureMap[featureId] = pages[featureKey];
			});
		});

		// register feature keywords to search engine
		Object.keys(featureTranslation.features).forEach(pageName => {
			const pageFeatures = featureSource.features[pageName];
			Object.keys(pageFeatures).forEach(featureKey => {
				const featureId = `appSearch.features.${pageName}.${featureKey}`;
				this.featureMap[featureId].featureName = featureTranslation.features[pageName][featureKey].featureName;
				this.featureMap[featureId].category = featureTranslation.features[pageName].category;

				this.searchContext[featureId] = {
					id: featureId,
					featureName: featureTranslation.features[pageName][featureKey].featureName,
					highRelevantKeywords: featureTranslation.features[pageName][featureKey].highRelevantKeywords,
					lowRelevantKeywords: featureTranslation.features[pageName][featureKey].lowRelevantKeywords
				};
			});
		});

		this.searchEngine.updateSearchContext(Object.values(this.searchContext));
	}

	public search(userInput: string): Array<IFeature> {
		const featureIdList = this.searchEngine.search(userInput);

		const returnList = [];
		if (featureIdList && featureIdList.length > 0) {
			featureIdList.forEach(feature => {
				if (feature?.item?.id) {
					returnList.push(Object.assign({}, this.featureMap[feature.item.id]));
				}
			});
		}

		return returnList;
	}

	public register(feature: IFeature, keywords: string[]) {
		this.featureMap[feature.id] = feature;

		const translation = this.translate.instant('appSearch');
		feature.featureName = translation[feature.id];
		this.searchEngine.updateSearchContext(Object.values(this.searchContext));

	}

	public unRegister(featureId: string) {
		this.searchEngine.updateSearchContext(Object.values(this.searchContext));
	}

	public handleAction(featureAction: IFeatureAction) {
		if (featureAction.type === SearchActionType.navigation) {
			const navAction = featureAction as INavigationAction;
			let route = '/dashboard';

			if (navAction.menuId && this.menuRouteMap[navAction.menuId]) {
				route = '/' + this.menuRouteMap[navAction.menuId];
			} else if (navAction.route) {
				route = navAction.route;
			}

			this.router.navigate([route]);
		}
	}

	private onNotification(notification: AppNotification) {
		if (notification.type === MenuItemEvent.MenuItemChange) {
			// if notification.payLoad contains app-search and is available and is not hide
			this.load();
			this.updateRouteMap(notification.payload);
		}
	}

	private updateRouteMap(payload) {
		this.menuRouteMap = {};
		if (!payload) {
			return;
		}

		this.extractRouteMap(payload);
	}

	private extractRouteMap(menuItems: any, upperPath: string = null) {
		menuItems.forEach(item => {
			if (!this.isMenuAvailble(item)) {
				return;
			}

			let routePath = upperPath
			if (item.id && item.path) {
				routePath = upperPath ? upperPath + "/" + item.path : item.path;
				this.menuRouteMap[item.id] = upperPath ? upperPath + "/" + item.path: item.path;
			}

			if (item.subitems?.length > 0) {
				this.extractRouteMap(item.subitems, routePath);
			}
		});
	}

	private isMenuAvailble(menuItem): boolean {
		if (menuItem.hide === true) {
			return false;
		}

		// For features in user menu, need seperate logic to adjudge the feature availability.
		return true;
	}
}
