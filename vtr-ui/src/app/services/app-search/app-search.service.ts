import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { MenuItemEvent } from 'src/app/enums/menuItemEvent.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { featureSource } from './features.model';
import { IFeature, IFeatureAction, INavigationAction, SearchActionType } from './interface.model';
import { SearchEngineWraper } from './search-engine-wraper';
import find from 'lodash/find';
import { first } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
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
		private commonService: CommonService
	) {
		this.subscription = this.commonService.notification.subscribe(
			(notification: AppNotification) => {
				this.onNotification(notification);
			}
		);
	}

	public async load() {
		if (this.featureLoad) {
			return;
		}

		// ensure that the translation resources has been loaded
		await this.translate.get('appSearch').toPromise();

		if (this.featureLoad) {
			return;
		}

		this.featureLoad = true;
		this.searchEngine = new SearchEngineWraper();

		// transfer pages to feature map
		featureSource.forEach((feature) => {
			feature.featureName = this.translate.instant(
				feature.featureName || `${feature.id}.featureName`
			);
			feature.category = this.translate.instant(
				feature.category || `${feature.categoryId}.category`
			);

			this.featureMap[feature.id] = feature;
			this.searchContext[feature.id] = {
				id: feature.id,
				featureName: feature.featureName,
				highRelevantKeywords: this.translate.instant(`${feature.id}.highRelevantKeywords`),
				lowRelevantKeywords: this.translate.instant(`${feature.id}.lowRelevantKeywords`),
			};
		});

		this.searchEngine.updateSearchContext(Object.values(this.searchContext));
	}

	public search(userInput: string): Array<IFeature> {
		const featureIdList = this.searchEngine.search(userInput);

		const returnList = [];
		if (featureIdList && featureIdList.length > 0) {
			featureIdList.forEach((feature) => {
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
		// todo
	}

	public handleAction(featureAction: IFeatureAction) {
		if (featureAction.type === SearchActionType.navigation) {
			const navAction = featureAction as INavigationAction;
			let route = '/' + this.actionToRoutePath(navAction);

			if (route.startsWith('/user')) {
				// not support user route at present
				this.router.navigateByUrl('/');
			} else {
				this.router.navigateByUrl(route);
			}
		}
	}

	private actionToRoutePath(navAction: INavigationAction) {
		let route = '';
		if (navAction.menuId) {
			if (typeof navAction.menuId === 'string') {
				route = this.menuRouteMap[navAction.menuId] || '';
			} else if (navAction.menuId.length > 0) {
				const menuId = find(navAction.menuId, (id) => Boolean(this.menuRouteMap[id]));
				route = this.menuRouteMap[menuId] || '';
			}
		}

		if (!route && navAction.route) {
			route = navAction.route.trim();
		}

		return route;
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

	private extractRouteMap(menuItems: any, parentPath: string = null) {
		menuItems.forEach((item) => {
			if (this.isMenuAvailble(item)) {
				this.mapItemIdToPath(item, parentPath);
			}
		});
	}
	// map all item and its descendant items to its parent path if the menu node is hidden
	private mapItemIdToPath(item, parentPath) {
		let itemPath = parentPath;
		if (item.singleLayerRouting) {
			itemPath = item.path?.trim() || '';
		} else {
			itemPath = this.trimAndCombinePath(parentPath, item.path);
		}

		if (item.id && itemPath) {
			this.menuRouteMap[item.id] = itemPath;
		}

		if (item.subitems?.length > 0) {
			this.extractRouteMap(item.subitems, itemPath);
		}
	}

	private trimAndCombinePath(parentPath, itemPath) {
		const parent = parentPath?.trim();
		const item = itemPath?.trim();

		if (parent && item) {
			return parent + '/' + item;
		}

		return parent || item || '';
	}

	private isMenuAvailble(menuItem): boolean {
		if (menuItem.hide === true) {
			return false;
		}

		// For features in user menu, need seperate logic to adjudge the feature availability.
		return true;
	}
}
