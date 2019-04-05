import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { SystemUpdateService } from 'src/app/services/system-update/system-update.service';
import { CommonService } from 'src/app/services/common/common.service';
import { UpdateHistory } from 'src/app/data-models/system-update/update-history.model';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { UpdateProgress } from 'src/app/enums/update-progress.enum';

@Component({
	selector: 'vtr-installation-history',
	templateUrl: './installation-history.component.html',
	styleUrls: ['./installation-history.component.scss']
})
export class InstallationHistoryComponent implements OnInit, OnDestroy {
	@Output() reinstallUpdate = new EventEmitter<string>();

	sortAsc = true;
	expandedRecordId = '';
	public installationHistory: Array<UpdateHistory> = [];
	private notificationSubscription: Subscription;
	public showAll = false;

	constructor(
		public systemUpdateService: SystemUpdateService,
		public commonService: CommonService
	) { }

	ngOnInit() {
		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});

		if (this.systemUpdateService.installationHistory) {
			this.sortInstallationHistory(this.systemUpdateService.installationHistory);
		}
	}

	ngOnDestroy() {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
	}

	installUpdates(event) {
		console.log('installUpdates', event);
	}

	installSelectedUpdates(event) {
		console.log('installSelectedUpdates', event);
	}

	toggleSortOrder() {
		this.sortAsc = !this.sortAsc;
		if (this.systemUpdateService.isShellAvailable) {
			this.systemUpdateService.sortInstallationHistory(this.installationHistory, this.sortAsc);
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
			const date = this.commonService.formatDate(item.utcInstallDate);
			const time = this.commonService.formatTime(item.utcInstallDate);
			if (item.status.toLocaleLowerCase() === 'installed') {
				item.message = `Successfully installed on ${date} at ${time}`;
			} else {
				item.message = `Failed installed on ${date} at ${time}`;
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
					break;
				default:
					break;
			}
		}
	}

	private sortInstallationHistory(history: Array<UpdateHistory>) {
		this.installationHistory = this.mapMessage(history);
		this.systemUpdateService.sortInstallationHistory(this.installationHistory, this.sortAsc);
		if (this.installationHistory.length > 5 && !this.showAll) {
			this.installationHistory = this.installationHistory.slice(0, 5);
		}
	}

	public onShowAllClick() {
		this.showAll = true;
		if (this.systemUpdateService.installationHistory) {
			this.sortInstallationHistory(this.systemUpdateService.installationHistory);
		}
	}
}
