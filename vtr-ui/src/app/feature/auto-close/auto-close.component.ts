import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSlideToggleChange } from '@lenovo/material/slide-toggle';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { TileItem, MaxSelected } from 'src/app/feature/auto-close/types/auto-close';
import { AutoCloseService } from 'src/app/feature/auto-close/service/auto-close.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
	selector: 'vtr-auto-close',
	templateUrl: './auto-close.component.html',
	styleUrls: ['./auto-close.component.scss'],
})
export class AutoCloseComponent implements OnInit, OnDestroy {
	innerSavedApps: TileItem[];
	runningApps: TileItem[];
	maxSelected: MaxSelected;
	removable: boolean;
	innerAutoCloseChecked = false;
	innerAutoCloseAvailable = false;
	metricsParent = 'Device.AutoClose';
	actionSubscription: Subscription;
	get savedApps() {
		return this.innerSavedApps;
	}

	set savedApps(value) {
		this.localCacheService.setLocalCacheValue(LocalStorageKey.PerformanceBoostList, value);
		this.innerSavedApps = value;
	}

	get autoCloseChecked() {
		return this.innerAutoCloseChecked;
	}

	set autoCloseChecked(value) {
		this.localCacheService.setLocalCacheValue(LocalStorageKey.PerformanceBoostToggle, value);
		this.innerAutoCloseChecked = value;
	}

	get autoCloseAvailable() {
		return this.innerAutoCloseAvailable;
	}

	set autoCloseAvailable(value) {
		this.localCacheService.setLocalCacheValue(LocalStorageKey.PerformanceBoostAvailable, value);
		this.innerAutoCloseAvailable = value;
	}

	constructor(
		private dialogService: DialogService,
		private autoCloseService: AutoCloseService,
		private localCacheService: LocalCacheService,
		private logger: LoggerService,
		private activatedRoute: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.getProtocolActions();
		this.initAutoClose();
	}

	ngOnDestroy(): void {
		if (this.actionSubscription) {
			this.actionSubscription.unsubscribe();
		}
	}

	initAutoClose() {
		const cacheAutoCloseAvailable = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.PerformanceBoostAvailable
		);
		const cacheAutoCloseToggleState = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.PerformanceBoostToggle
		);
		const cacheAutoCloseList = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.PerformanceBoostList
		);

		this.autoCloseAvailable = Boolean(cacheAutoCloseAvailable);
		this.autoCloseChecked = Boolean(cacheAutoCloseToggleState);

		if (cacheAutoCloseList) {
			this.savedApps = cacheAutoCloseList;
		}

		this.autoCloseService.getAutoCloseApps().then((apps: TileItem[]) => {
			this.savedApps = apps;
		});
		this.autoCloseService
			.getState()
			.then((status: boolean) => {
				this.autoCloseChecked = status;
				this.autoCloseAvailable = true;
			})
			.catch(() => {
				this.autoCloseAvailable = false;
			});
	}

	remove(item: TileItem): void {
		this.removeSavedApp(item);
		this.autoCloseService.deleteAutoCloseApp(item);
	}

	openRunningAppsDialog(): void {
		this.runningApps = null;
		const appListDialog = this.dialogService.openAppListDialog(
			this.runningApps,
			this.maxSelected,
			this.metricsParent
		);
		this.autoCloseService.getRunningApps().then((apps: TileItem[]) => {
			this.runningApps = apps;
			appListDialog.componentInstance.data = this.runningApps;
			appListDialog.componentInstance.selectedEmit.subscribe((selectItem: TileItem) => {
				const selectItemIndex = this.savedApps.indexOf(selectItem);
				if (selectItemIndex >= 0) {
					this.removeSavedApp(selectItem);
					this.autoCloseService.deleteAutoCloseApp(selectItem);
				} else {
					this.addSavedApp(selectItem);
					this.autoCloseService.addAutoCloseApp(selectItem);
				}
			});
		});
	}

	updateAutoCloseToggleState($event: MatSlideToggleChange) {
		this.toggleAutoClose($event.checked);
	}

	addSavedApp(app: TileItem) {
		this.savedApps.push(app);
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.PerformanceBoostList,
			this.savedApps
		);
	}

	removeSavedApp(app: TileItem) {
		const index = this.savedApps.indexOf(app);
		if (index >= 0) {
			this.savedApps.splice(index, 1);
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.PerformanceBoostList,
				this.savedApps
			);
		}
	}

	toggleAutoClose(enable: boolean) {
		this.autoCloseService.setState(enable).then((res) => {
			if (res) {
				this.autoCloseChecked = enable;
			}
		});
	}

	getProtocolActions() {
		this.actionSubscription = this.activatedRoute.queryParamMap.subscribe(
			(params: ParamMap) => {
				if (
					params.has('action') &&
					this.activatedRoute.snapshot.queryParams.action === 'on'
				) {
					this.toggleAutoClose(true);
				}
			}
		);
	}
}
