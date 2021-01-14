import { Injectable, OnDestroy } from '@angular/core';
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
import { LoggerService } from '../logger/logger.service';

@Injectable({
	providedIn: 'root',
})
export class AppSearchService implements OnDestroy {
	private featureLoad = false;
	private featureMap = {};
	private searchContext = {};
	private menuRouteMap = {};
	private subscription: Subscription;
	private searchEngine: SearchEngineWraper;
	constructor(
		private translate: TranslateService,
		private router: Router,
		private commonService: CommonService,
		private logger: LoggerService
	) {
		this.subscription = this.commonService.notification.subscribe(
			(notification: AppNotification) => {
				this.onNotification(notification);
			}
		);
	}

	public ngOnDestroy() {
		this.subscription?.unsubscribe();
	}

	public async load() {
		if (this.featureLoad) {
			this.logger.info(`waringing: duplicate feature loading-1`);
			return;
		}

		// ensure that the translation resources has been loaded
		await this.translate.get('appSearch').toPromise();
		if (this.featureLoad) {
			this.logger.info(`waringing: duplicate feature loading-2`);
			return;
		}

		this.featureLoad = true;
		this.searchEngine = new SearchEngineWraper();

		const featureList = featureSource.map((feature) => {
			const nameKey = feature.featureName || `${feature.id}.featureName`;
			const categoryKey = feature.category || `${feature.categoryId}.category`;
			feature.featureName = this.translate.instant(nameKey);
			feature.category = this.translate.instant(categoryKey);
			return feature;
		});

		// transfer feature list to feature map
		featureList.forEach((feature) => {
			if (!feature.id || !feature.categoryId) {
				this.logger.error(
					`invalid feature definition, feature.id:${feature.id} || categoryId: ${feature.categoryId}`
				);
				return;
			}

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
		const searchedList = this.searchEngine.search(userInput);
		return (
			searchedList?.map((feature) => Object.assign({}, this.featureMap[feature.item.id])) ||
			[]
		);
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
			let route = '/' + this.actionToRoutePath(featureAction as INavigationAction);

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
				const menuId = find(navAction.menuId, (menuId) =>
					Boolean(this.menuRouteMap[menuId])
				);
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
			this.logger.info(`invalid menu payload`);
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
