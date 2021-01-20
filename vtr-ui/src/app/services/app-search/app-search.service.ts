import { Injectable, OnDestroy, ɵɵInheritDefinitionFeature } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { MenuItemEvent } from 'src/app/enums/menuItemEvent.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { featureSource } from './model/features.model';
import {
	IFeature,
	INavigationAction,
	IProtocolAction,
	SearchResult,
	SearchResultType as ResultType,
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
	private featureMap = {};
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

	public search(userInput: string): Observable<SearchResult> {
		const featureList = this.searchEngine
			.search(userInput)
			?.map((feature) => Object.assign({}, this.featureMap[feature.item.id]));

		return this.checkFeatureApplicable(featureList, 10, 20000);
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
		const route = '/' + this.actionToRoutePath(featureAction);
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
			const feature = this.mapFeatureSourceToFeature(sourceItem as IFeature);
			if (!feature.id || !feature.categoryId) {
				this.logger.error(`invalid feature source ${JSON.stringify(sourceItem)}`);
				return;
			}

			this.featureMap[feature.id] = feature;
		});

		this.searchEngine.updateSearchContext(Object.values(this.featureMap));
	}

	private mapFeatureSourceToFeature(sourceItem: IFeature): IFeature {
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

		return feature;
	}

	private checkFeatureApplicable(
		features: IFeature[],
		maxParallel: number,
		timeout: number
	): Observable<SearchResult> {
		return new Observable((subscriber) => {
			let parallelThread = Math.min(maxParallel, features.length);
			const taskStack = Array.from(features);

			let timeoutHandler = setTimeout(() => {
				timeoutHandler = null;
				this.searchComplete(subscriber, null, ResultType.timeout, features);
			}, timeout);

			let counter = 0;
			Array.from(Array(parallelThread)).forEach(async () => {
				const mockThreadId = counter++;
				await this.mockDetectionThread(taskStack, mockThreadId);
				if (--parallelThread <= 0) {
					this.searchComplete(subscriber, timeoutHandler, ResultType.complete, features);
				}
			});

			if (parallelThread <= 0) {
				this.searchComplete(subscriber, timeoutHandler, ResultType.complete, features);
			}
		});
	}

	private searchComplete(
		subscriber,
		timeoutHandler,
		resultType: ResultType,
		features: IFeature[]
	) {
		if (timeoutHandler) {
			clearTimeout(timeoutHandler);
		}

		subscriber.next(
			new SearchResult(
				resultType,
				features.filter((feature) => feature.applicable)
			)
		);
		subscriber.complete();
	}

	private async mockDetectionThread(taskStack, mockThreadId) {
		while (true) {
			const feature = taskStack.pop();
			if (!feature) {
				break;
			}

			this.logger.info(`start detection for ${mockThreadId} - ${feature.id}`);
			feature.applicable = await this.applicableDetections.isFeatureApplicable(feature.id);
			this.logger.info(`end detection for ${mockThreadId} - ${feature.id}`);
		}
	}
}
