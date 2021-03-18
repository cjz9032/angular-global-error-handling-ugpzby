import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSlideToggleChange } from '@lenovo/material/slide-toggle';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { TileItem, MaxSelected } from 'src/app/feature/types/auto-close';
import { AutoCloseService } from 'src/app/feature/service/auto-close.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

@Component({
	selector: 'vtr-auto-close',
	templateUrl: './auto-close.component.html',
	styleUrls: ['./auto-close.component.scss'],
})
export class AutoCloseComponent implements OnInit {
	someItem = [];
	innerSavedApps: TileItem[];
	runningApps: TileItem[];
	maxSelected: MaxSelected;
	removable: boolean;
	innerAutoCloseChecked = false;
	innerAutoCloseAvailable = false;
	metricsParent = 'AutoClose';

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
		private localCacheService: LocalCacheService
	) {}

	ngOnInit(): void {
		this.initAutoClose();
	}

	initAutoClose() {
		const cacheAutoCloseAvailabe = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.PerformanceBoostAvailable
		);
		const cacheAutoCloseToggleState = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.PerformanceBoostToggle
		);
		const cacheAutoCloseList = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.PerformanceBoostList
		);

		this.autoCloseAvailable = Boolean(cacheAutoCloseAvailabe);
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
				this.autoCloseChecked = false;
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
			this.maxSelected
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
		this.autoCloseChecked = $event.checked;
		this.autoCloseService.setState(this.autoCloseChecked);
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
}
