import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
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
import { LocalCacheService } from '../local-cache/local-cache.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { MenuItemEvent } from 'src/app/enums/menuItemEvent.enum';
import mapValues from 'lodash/mapValues';
import { MatSnackBar } from '@lenovo/material/snack-bar';
import { FeatureInapplicableMessageComponent } from 'src/app/components/app-search/feature-inapplicable-message/feature-inapplicable-message.component';

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
	private lastFullFeaturesDetectionTime: number;
	private scheduleUpdateTask: boolean;
	constructor(
		private translate: TranslateService,
		private router: Router,
		private commonService: CommonService,
		private logger: LoggerService,
		private deviceService: DeviceService,
		private hypService: HypothesisService,
		private applicableDetections: FeatureApplicableDetections,
		private localCacheService: LocalCacheService,
		private snackBar: MatSnackBar
	) {
		this.isAvailable().then((available) => {
			if (available) {
				this.searchEngine = new SearchEngineWraper();
				this.lastFullFeaturesDetectionTime = this.localCacheService.getLocalCacheValue(
					LocalStorageKey.LastFullFeaturesDetectionTime
				);
				this.subscription = this.commonService.notification.subscribe(
					(notification: AppNotification) => {
						this.onNotification(notification);
					}
				);

				this.loadFeatureListAsync();
			}
		});
	}

	public async isAvailable() {
		if (this.available != null) {
			return this.available;
		}

		try {
			const result = await this.hypService.getFeatureSetting('AppSearch');
			this.available =
				result?.toString().toLowerCase() === 'true' && this.translate.currentLang === 'en';
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

		this.logger.info(`search for ${userInput}, match feature: ${JSON.stringify(featureList)}`);

		return this.verifyFeatureApplicability(featureList, 10, 3000);
	}

	public handleAction(featureId: string) {
		const feature: IFeature = this.featureMap[featureId];
		const action: any = feature.action;
		if (action?.route || action?.menuId) {
			this.handleNavigateAction(feature.action as INavigationAction).then(success => {
				if (!success) {
					feature.applicable = false;
					this.persistFeatureStatus();
					this.showFeatureUnavailableTips(feature.featureName);
				}
			});
		} else if (action?.url) {
			this.handleProtocolAction(feature.action as IProtocolAction);
		} else if (typeof feature.action === 'function') {
			feature.action(feature);
		} else {
			this.logger.error(`[AppSearch]invalid action: ${JSON.stringify(feature)}`);
		}

		this.verifySingleFeatureApplicability(feature);
	}

	public async verifySingleFeatureApplicability(feature: IFeature): Promise<SearchResult> {
		await this.mockDetectionThread([feature], 'SingleFeature');
		return new SearchResult(ResultType.complete, [feature]);
	}

	private async handleNavigateAction(featureAction: INavigationAction) {
		const route = '/' + this.actionToRoutePath(featureAction);
		if (route.startsWith('/user')) {
			// not support user route at present
			this.router.navigateByUrl('/');
		} else {
			const success = await this.router.navigateByUrl(route);
			if (!success) {
				this.router.navigateByUrl('/');
				return false;
			}
		}

		return true;
	}

	private handleProtocolAction(featureAction: IProtocolAction) {
		const uri = featureAction.url;
		if (!uri) {
			this.logger.error(`[AppSearch] invalid protocol ${JSON.stringify(featureAction)}`);
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
		switch (notification.type) {
			case MenuItemEvent.MenuItemChange:
				this.updateRouteMap(notification.payload);
				break;
			default:
				break;
		}
	}

	private updateRouteMap(payload) {
		this.menuRouteMap = {};
		if (!payload) {
			this.logger.info(`[AppSearch]invalid menu payload`);
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

	private async loadFeatureListAsync() {
		if (this.featureLoad) {
			return;
		}

		await this.translate.get('appSearch').toPromise();
		if (this.featureLoad) {
			this.logger.info(`[AppSearch]waringing: duplicate feature loading-1`);
			return;
		}
		this.featureLoad = true;

		featureSource.forEach((sourceItem) => {
			const feature = this.mapFeatureSourceToFeature(sourceItem as IFeature);
			if (!feature.id || !feature.categoryId) {
				this.logger.error(
					`[AppSearch]invalid feature source ${JSON.stringify(sourceItem)}`
				);
				return;
			}

			this.featureMap[feature.id] = feature;
		});

		this.loadFeatureStatusFromCache();

		this.searchEngine.updateSearchContext(Object.values(this.featureMap));
	}

	private loadFeatureStatusFromCache() {
		const applicableStatus = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.FeaturesApplicableStatus
		);

		this.logger.info(
			`[AppSearch]Load Feature status from cache: ${JSON.stringify(applicableStatus)}`
		);

		if (applicableStatus) {
			const featureIds = Object.keys(applicableStatus);
			featureIds.forEach((featureId) => {
				if (this.featureMap[featureId]) {
					this.featureMap[featureId].applicable = applicableStatus[featureId];
				}
			});
		}
	}

	private async runFullFeaturesDetections() {
		this.logger.info(`[AppSearch]Full feature detections start`);

		const taskStack = Object.values(this.featureMap);
		let threadCount = Math.min(5, taskStack.length);
		Array.from(Array(threadCount)).forEach(async (item, index) => {
			const mockThreadId = `Full feature ${index}`;
			const startTime = Date.now();
			await this.mockDetectionThread(taskStack as IFeature[], mockThreadId);
			if (--threadCount <= 0) {
				this.logger.info(
					`[AppSearch]Full features detections end ${JSON.stringify(
						this.getFeatureStatusMap()
					)}`
				);
				this.localCacheService.setLocalCacheValue(
					LocalStorageKey.LastFullFeaturesDetectionTime,
					Date.now()
				);
			}

			this.logger.info(
				`[AppSearch]Detection thread(${mockThreadId}) end, Duriation: ${
					Date.now() - startTime
				}`
			);
		});
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

	private verifyFeatureApplicability(
		features: IFeature[],
		maxParallel: number,
		timeout: number
	): Observable<SearchResult> {
		return new Observable((subscriber) => {
			const taskStack = Array.from(
				features.filter((feaure) => feaure.applicable === undefined)
			);

			let parallelThread = Math.min(maxParallel, taskStack.length);
			if (parallelThread <= 0) {
				this.searchComplete(subscriber, null, ResultType.complete, features);
			}

			let timeoutHandler = setTimeout(() => {
				timeoutHandler = null;
				this.searchComplete(subscriber, null, ResultType.timeout, features);
			}, timeout);

			this.logger.info(
				`[AppSearch]Detection threads start, Feature Counts:${taskStack.length}`
			);

			let counter = 0;
			Array.from(Array(parallelThread)).forEach(async () => {
				const mockThreadId = counter++;
				const startTime = Date.now();
				await this.mockDetectionThread(taskStack, mockThreadId);
				if (--parallelThread <= 0) {
					this.searchComplete(subscriber, timeoutHandler, ResultType.complete, features);
				}

				this.logger.info(
					`[AppSearch]Detection thread(${mockThreadId}) end, Duriation: ${
						Date.now() - startTime
					}`
				);
			});
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

		if (
			!this.lastFullFeaturesDetectionTime ||
			Math.abs(Date.now() - this.lastFullFeaturesDetectionTime) > 24 * 60 * 1000 // 8 hours
		) {
			this.lastFullFeaturesDetectionTime = Date.now();
			this.runFullFeaturesDetections();
		}
	}

	private async mockDetectionThread(taskStack: IFeature[], mockThreadId: any) {
		while (true) {
			const feature = taskStack.pop();
			if (!feature) {
				break;
			}

			const applicable = feature.applicable;
			this.logger.info(
				`[AppSearch]Single featue detection start, ThreadId:${mockThreadId} - FeatureId:${feature.id}`
			);

			const startTime = Date.now();
			const actionCallback = (result: boolean, isTimeout: boolean) => {
				feature.applicable = Boolean(result);
				this.logger.info(
					`[AppSearch]Single featue detection end, ThreadId:${mockThreadId} - Duration:${
						Date.now() - startTime
					} -result: ${feature.applicable} timeout: ${isTimeout}- FeatureId:${feature.id}`
				);

				if (applicable !== feature.applicable) {
					this.persistFeatureStatus();
				}
			};
			await this.wrapActionWithTimeout(
				async () => this.applicableDetections.isFeatureApplicable(feature.id),
				actionCallback,
				3000
			);
		}
	}

	private async wrapActionWithTimeout(
		action: () => Promise<any>,
		callback: (result: boolean, isTimeout: boolean) => void,
		timeout: number
	) {
		return new Promise<void>((resolve) => {
			let detectionTimeout = setTimeout(() => {
				callback?.(null, true);
				detectionTimeout = null;
				resolve();
			}, 60 * 1000);

			action().then((result) => {
				callback?.(result, false);
				if (detectionTimeout) {
					clearTimeout(detectionTimeout);
				}
				resolve();
			});
		});
	}

	private persistFeatureStatus() {
		if (this.scheduleUpdateTask) {
			return;
		}

		this.scheduleUpdateTask = true;
		setTimeout(() => {
			if (!this.scheduleUpdateTask) {
				return;
			}

			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.FeaturesApplicableStatus,
				this.getFeatureStatusMap()
			);

			this.logger.info(
				`[AppSearch]Persist feature status, ${JSON.stringify(this.getFeatureStatusMap())}`
			);
			this.scheduleUpdateTask = false;
		}, 1000);
	}

	private getFeatureStatusMap() {
		return mapValues(this.featureMap, (feature) => (feature as IFeature).applicable);
	}

	private showFeatureUnavailableTips(featureName: string) {
		const message = this.translate.instant('appSearch.featureInapplicable', {
			featureName,
		});

		this.snackBar.openFromComponent(FeatureInapplicableMessageComponent,  {
			horizontalPosition: 'center',
			verticalPosition: 'top',
			panelClass: ['snackbar-feature-unavailable'],
			duration: 2000,
			data: {
				message
			}
		  });
	}
}
