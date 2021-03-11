import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { SystemUpdateService } from 'src/app/services/system-update/system-update.service';
import { CommonService } from 'src/app/services/common/common.service';
import { UpdateHistory } from 'src/app/data-models/system-update/update-history.model';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { UpdateProgress } from 'src/app/enums/update-progress.enum';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { UpdateHistoryStatus } from 'src/app/enums/update-history-status.enum';

@Component({
	selector: 'vtr-installation-history',
	templateUrl: './installation-history.component.html',
	styleUrls: ['./installation-history.component.scss'],
})
export class InstallationHistoryComponent implements OnInit, OnDestroy {
	@Output() reinstallUpdate = new EventEmitter<string>();

	sortAsc = true;
	expandedRecordId = '';
	sortOrderId = 'su_installation_update_sort_order';
	suBackButtonId = 'system-update-back-btn';
	public installationHistory: Array<UpdateHistory> = [];
	private notificationSubscription: Subscription;
	public showAll = false;
	public enableDelete = false;
	private needManualSetFocusForDelete = false;
	public UpdateHistoryStatus = UpdateHistoryStatus;

	constructor(
		public systemUpdateService: SystemUpdateService,
		public commonService: CommonService,
		private translate: TranslateService,
		private localCacheService: LocalCacheService
	) {
		this.getCachedHistory();
		this.checkIfDeleteHistoryEnabled();
	}

	ngOnInit() {
		this.notificationSubscription = this.commonService.notification.subscribe(
			(response: AppNotification) => {
				this.onNotification(response);
			}
		);

		if (this.systemUpdateService.installationHistory) {
			this.sortInstallationHistory(this.systemUpdateService.installationHistory);
		}
	}

	ngOnDestroy() {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
	}

	getCachedHistory() {
		const cachedData = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.SystemUpdateInstallationHistoryList
		);
		if (typeof cachedData !== 'undefined' && cachedData.length > 0) {
			this.installationHistory = cachedData;
		}
	}

	async checkIfDeleteHistoryEnabled() {
		this.enableDelete = false;
		const capabilities = await this.systemUpdateService.getCapability();
		if (capabilities && capabilities.length > 0) {
			capabilities.forEach(capability => {
				if (capability
					&& capability.key === 'Do-DeleteHistoryItems'
					&& capability.keyvalue === 'true') {
						this.enableDelete = true;
					}
			});
		}
	}

	onDeleteClick(item) {
		this.systemUpdateService.deleteHistoryItems([item.packageID]);
		this.needManualSetFocusForDelete = true;
	}

	installUpdates(event) {}

	installSelectedUpdates(event) {}

	toggleSortOrder() {
		this.sortAsc = !this.sortAsc;
		if (this.systemUpdateService.installationHistory) {
			this.sortInstallationHistory(this.systemUpdateService.installationHistory);
		}
	}

	toggleExpand(itemId) {
		if (this.expandedRecordId === itemId) {
			this.expandedRecordId = '';
		} else {
			this.expandedRecordId = itemId;
		}
	}

	public onRetryClick(packageId: string) {
		if (packageId) {
			this.reinstallUpdate.emit(packageId);
		}
	}

	private mapMessage(historyList: Array<UpdateHistory>): Array<UpdateHistory> {
		historyList.forEach((item: UpdateHistory) => {
			const date = this.commonService.formatLocalDate(item.utcInstallDate);
			const time = this.commonService.formatLocalTime(item.utcInstallDate);
			if (item.status === UpdateHistoryStatus.Installed) {
				item.message =
					this.translate.instant('systemUpdates.successInstall') + date + ' ' + time;
			} else {
				item.message =
					this.translate.instant('systemUpdates.failedInstall') + date + ' ' + time;
			}
		});
		return historyList;
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			const { type, payload } = notification;

			switch (type) {
				case UpdateProgress.FullHistory:
					this.sortInstallationHistory(payload);
					if (this.needManualSetFocusForDelete) {
						this.needManualSetFocusForDelete = false;
						this.adjustFocusForDelete();
					}
					break;
				default:
					break;
			}
		}
	}

	private sortInstallationHistory(history: Array<UpdateHistory>) {
		this.installationHistory = this.mapMessage(history);
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.SystemUpdateInstallationHistoryList,
			this.installationHistory
		);
		this.systemUpdateService.sortInstallationHistory(this.installationHistory, this.sortAsc);
		if (this.installationHistory.length > 5 && !this.showAll) {
			this.installationHistory = this.installationHistory.slice(0, 5);
		} else {
			this.showAll = true;
		}
	}

	public onShowAllClick() {
		this.showAll = true;
		if (this.systemUpdateService.installationHistory) {
			this.sortInstallationHistory(this.systemUpdateService.installationHistory);
		}
		this.adjustFocusForShowAll();
	}

	private adjustFocusForShowAll() {
		let focusId = this.sortOrderId;
		if (this.installationHistory && this.installationHistory.length >= 5) {
			focusId = 'su_installation_update_expand_' + this.installationHistory[4].packageID;
		}
		this.focusOnElement(focusId);
	}

	private adjustFocusForDelete() {
		let focusId = this.sortOrderId;
		if (!this.installationHistory || this.installationHistory.length < 1) {
			focusId = this.suBackButtonId;
		}
		this.focusOnElement(focusId);
	}

	private focusOnElement(element) {
		if (element && document.getElementById(element)) {
			document.getElementById(element).focus();
		}
	}

	public convertReleaseDate(dateStr: string) {
		return this.commonService.formatLocalDate(`${dateStr}T00:00:00`);
	}
}
