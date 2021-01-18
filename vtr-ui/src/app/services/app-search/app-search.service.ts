import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { MenuItemEvent } from 'src/app/enums/menuItemEvent.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { featureSource } from './model/features.model';
import {
	IFeature,
	INavigationAction,
	IProtocolAction,
	IAvailableDetection,
} from './model/interface.model';
import { SearchEngineWraper } from './search-engine/search-engine-wraper';
import { LoggerService } from '../logger/logger.service';
import { DeviceService } from '../device/device.service';
import { HypothesisService } from '../hypothesis/hypothesis.service';
import { FeatureApplicableDetections } from './feature-applicable-detections';

@Injectable({
	providedIn: 'root',
})
export class AppSearchService implements OnDestroy {
	private featureLoad = false;
	private candidateFeatureMap = {};
	private searchContext = {};
	private menuRouteMap = {};
	private subscription: Subscription;
	private searchEngine: SearchEngineWraper;
	private available;
	constructor(
		private translate: TranslateService,
		private router: Router,
		private commonService: CommonService,
		private logger: LoggerService,
		private deviceService: DeviceService,
		private hypService: HypothesisService,
		private applicableDetections: FeatureApplicableDetections
	) {
		(async () => {
			const available = await this.isAvailabe();
			if (available) {
				this.subscription = this.commonService.notification.subscribe(
					(notification: AppNotification) => {
						this.onNotification(notification);
					}
				);

				this.searchEngine = new SearchEngineWraper();
				this.loadAsync();
			}
		})();
	}

	public async isAvailabe() {
		if (this.available != null) {
			return this.available;
		}

		try {
			const result = await this.hypService.getFeatureSetting('AppSearch');
			this.available = result?.toString().toLowerCase() === 'true';
		} catch {
			this.available = false;
		}

		return this.available;
	}

	public ngOnDestroy() {
		this.subscription?.unsubscribe();
	}

	public search(userInput: string): Array<IFeature> {
		const resultList = this.searchEngine
			.search(userInput)
			?.map((feature) => Object.assign({}, this.searchContext[feature.item.id]));
		return resultList || [];
	}

	public async registerByFeatureId(registerParamList: IAvailableDetection[]) {
		if (!(registerParamList?.length > 0) || !this.isAvailabe()) {
			return;
		}

		await this.loadAsync();

		registerParamList.forEach((registerParam) => {
			var feature = this.candidateFeatureMap[registerParam.featureId];
			if (!feature) {
				this.logger.info(
					`provided invalid featureId when registering a feature: ${JSON.stringify(
						registerParam
					)}`
				);
				return;
			}

			if (registerParam.isAvailable && typeof registerParam.isAvailable != 'function') {
				this.logger.info(
					`provided invalid detection function when registering a feature: ${JSON.stringify(
						registerParam
					)}`
				);
				return;
			}

			if (!registerParam.isAvailable || registerParam.isAvailable()) {
				this.searchContext[feature.id] = feature;
			}
		});

		if (!this.searchEngine) {
			this.searchEngine = new SearchEngineWraper();
		}

		this.searchEngine.updateSearchContext(Object.values(this.searchContext));
	}

	public async registerByFeatures(featureList: IFeature[]) {
		if (!(featureList?.length > 0) || !this.available()) {
			return;
		}

		await this.loadAsync();

		featureList.forEach((feature) => {
			if (feature.isAvailable && typeof feature.isAvailable != 'function') {
				this.logger.info(
					`provided invalid detection function when registering a feature: ${JSON.stringify(
						feature
					)}`
				);
				return;
			}

			if (!feature.isAvailable || feature.isAvailable()) {
				this.searchContext[feature.id] = feature;
			}

			feature.isAvailable = null;
		});

		this.addFeaturesToSearchContext(featureList);
	}

	public unRegisterByFeatureId(featureIds: string | string[]) {
		let featureIdList;
		if (featureIds as string) {
			featureIdList = [featureIds];
		} else {
			featureIdList = featureIds as string[];
		}

		featureIdList.forEach((featureId) => {
			delete this.searchContext[featureId];
		});

		this.searchEngine.updateSearchContext(Object.values(this.searchContext));
	}

	public unRegisterByCategoryId(categoryId: string) {
		const featureList = Object.values(this.searchContext).filter(
			(feature) => (feature as IFeature).categoryId === categoryId
		);

		if (featureList.length == 0) {
			return;
		}

		featureList.forEach((item) => {
			const feature = item as IFeature;
			delete this.searchContext[feature.id];
		});
		this.searchEngine.updateSearchContext(Object.values(this.searchContext));
	}

	public handleAction(feature: IFeature) {
		const action: any = feature.action;
		if (action?.route || action?.menuId) {
			this.handleNavigateAction(feature.action as INavigationAction);
		} else if (action?.url) {
			this.handleProtocolAction(feature.action as IProtocolAction);
		} else if (typeof feature.action === 'function') {
			feature.action(feature);
		} else {
			this.logger.info(`invalid protocol action: ${JSON.stringify(feature)}`);
		}
	}

	private handleNavigateAction(featureAction: INavigationAction) {
		let route = '/' + this.actionToRoutePath(featureAction);
		if (route.startsWith('/user')) {
			// not support user route at present
			this.router.navigateByUrl('/');
		} else {
			this.router.navigateByUrl(route);
		}
	}

	private handleProtocolAction(featureAction: IProtocolAction) {
		const uri = featureAction.url;
		if (!uri) {
			this.logger.info(`invalid protocol action: ${JSON.stringify(featureAction)}`);
			return;
		}
		this.deviceService.launchUri(uri);
	}

	private actionToRoutePath(navAction: INavigationAction) {
		let route = navAction.route?.trim() || '';
		if (route) {
			return route;
		}

		if (navAction.menuId) {
			route = this.menuRouteMap[navAction.menuId] || '';
		}

		return route;
	}

	private onNotification(notification: AppNotification) {
		if (notification.type === MenuItemEvent.MenuItemChange) {
			// if notification.payLoad contains app-search and is available and is not hide
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

	private async loadAsync() {
		if (!this.featureLoad) {
			await this.translate.get('appSearch').toPromise();
			this.load();
		}
	}

	private async load() {
		if (this.featureLoad) {
			this.logger.info(`waringing: duplicate feature loading-1`);
			return;
		}

		this.featureLoad = true;

		featureSource.forEach((sourceItem) => {
			const nameKey = sourceItem.featureName || `${sourceItem.id}.featureName`;
			const categoryKey = sourceItem.categoryName || `${sourceItem.categoryId}.categoryName`;
			const highRelevantKeywordsKey =
				sourceItem.highRelevantKeywords || `${sourceItem.id}.highRelevantKeywords`;
			const lowRelevantKeywordsKey =
				sourceItem.lowRelevantKeywords || `${sourceItem.id}.lowRelevantKeywords`;

			const feature: IFeature = Object.assign(sourceItem, {
				featureName: this.translate.instant(nameKey),
				categoryName: this.translate.instant(categoryKey),
				highRelevantKeywords: this.translate.instant(highRelevantKeywordsKey),
				lowRelevantKeywords: this.translate.instant(lowRelevantKeywordsKey),
			});

			if (!feature.id || !feature.categoryId) {
				this.logger.error(
					`invalid feature definition, feature.id:${feature.id} || categoryId: ${feature.categoryId}`
				);
				return;
			}

			this.candidateFeatureMap[feature.id] = feature;
			if (this.applicableDetections.isFeatureApplicable(feature.id)) {
				this.searchContext[feature.id] = feature;
			}

			this.searchEngine.updateSearchContext(Object.values(this.searchContext));
		});
	}

	private addFeaturesToSearchContext(featureList: IFeature[]) {
		featureList.forEach((feature) => {
			if (!feature.id || !feature.categoryId) {
				this.logger.error(
					`invalid feature definition, feature.id:${feature.id} || categoryId: ${feature.categoryId}`
				);
				return;
			}

			this.searchContext[feature.id] = feature;
		});

		if (!this.searchEngine) {
			this.searchEngine = new SearchEngineWraper();
		}

		this.searchEngine.updateSearchContext(Object.values(this.searchContext));
	}
}
