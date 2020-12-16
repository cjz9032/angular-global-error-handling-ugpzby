import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AvailableUpdateDetail } from 'src/app/data-models/system-update/available-update-detail.model';
import { SystemUpdateService } from 'src/app/services/system-update/system-update.service';
import { UpdateInstallTitleId } from 'src/app/enums/update-install-id.enum';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { UpdateProgress } from 'src/app/enums/update-progress.enum';

@Component({
	selector: 'vtr-available-updates',
	templateUrl: './available-updates.component.html',
	styleUrls: ['./available-updates.component.scss'],
})
export class AvailableUpdatesComponent implements OnInit {
	@Input() criticalUpdates: AvailableUpdateDetail[];
	@Input() recommendedUpdates: AvailableUpdateDetail[];
	@Input() optionalUpdates: AvailableUpdateDetail[];
	@Input() criticalUpdatesToInstall: AvailableUpdateDetail[];
	@Input() recommendedUpdatesToInstall: AvailableUpdateDetail[];
	@Input() optionalUpdatesToInstall: AvailableUpdateDetail[];
	@Input() ignoredUpdatesToInstall: AvailableUpdateDetail[];
	@Input() isInstallationSuccess = false;
	@Input() isInstallingAllUpdates = true;
	@Input() isUpdateDownloading = false;

	@Input() set ignoredUpdates(value: AvailableUpdateDetail[]) {
		this.mIgnoredUpdates = value;
		this.expandIgnoredForDependencyUpdates();
	}
	get ignoredUpdates(): AvailableUpdateDetail[] {
		return this.mIgnoredUpdates;
	}

	@Input() set isInstallationCompleted(value: boolean) {
		this.mIsInstallationCompleted = value;
		this.expandIgnoredForInstallationResult();
	}
	get isInstallationCompleted(): boolean {
		return this.mIsInstallationCompleted;
	}

	@Output() ignoreUpdate = new EventEmitter<any>();
	@Output() installAllUpdate = new EventEmitter<any>();
	@Output() installSelectedUpdate = new EventEmitter<any>();

	public isUpdateSelected = false;

	public isCollapsed = true;
	public isSelectAll = false;
	public disableSelectAll = false;

	private mIsInstallationCompleted = false;
	private mIgnoredUpdates: AvailableUpdateDetail[];
	private notificationSubscription: Subscription;

	public UpdateInstallTitleId = UpdateInstallTitleId;

	constructor(
		private systemUpdateService: SystemUpdateService,
		private commonService: CommonService,
		) {
		this.notificationSubscription = this.commonService.notification.subscribe(
			(response: AppNotification) => {
				this.onNotification(response);
			}
		);
	}

	public criticalUpdatesIcon = 'assets/icons/Icon_Critical_Update.svg';
	public recommendedUpdatesIcon = 'assets/icons/Icon_Recommended_Update.svg';
	public optionalUpdateIcon = 'assets/icons/Icon_Optional_Update.svg';
	public ignoredUpdateIcon = 'assets/icons/Icon_Eye_Slash.svg';

	ngOnInit() {
		if (!this.isInstallingAllUpdates) {
			this.criticalUpdates = this.criticalUpdates.filter((item: AvailableUpdateDetail) => {
				return item.isSelected;
			});

			this.recommendedUpdates = this.recommendedUpdates.filter(
				(item: AvailableUpdateDetail) => {
					return item.isSelected;
				}
			);

			this.optionalUpdates = this.optionalUpdates.filter((item: AvailableUpdateDetail) => {
				return item.isSelected;
			});
		}
		this.checkSelectedUpdateStatus();
		this.checkSelectAllStatus();
	}

	onInstallAllUpdates(event) {
		this.installAllUpdate.emit(event);
	}

	onInstallSelectedUpdates(event) {
		this.installSelectedUpdate.emit(event);
	}

	public onSelectAllClick($event: any) {
		this.isSelectAll = $event.target.checked;
		this.systemUpdateService.toggleSelectAllUpdates(this.isSelectAll);
		this.checkSelectedUpdateStatus();
	}

	public onKeyPress($event: any) {
		if ($event.keyCode === 13) {
			$event.target.click();
		}
	}

	public onCheckChange($event: any) {
		const item = $event.target;
		this.systemUpdateService.toggleUpdateSelection(item.name, item.checked);
		// set the value twice to trigger the ui refresh, Some times the ui get some strange problems
		document.body.style.zoom = '1.1';
		document.body.style.zoom = '1.0';

		this.checkSelectedUpdateStatus();
		this.checkSelectAllStatus();
	}

	public onIgnoreUpdate($event: any) {
		this.ignoreUpdate.emit($event);
		this.checkSelectAllStatus();
	}

	public onToggle() {
		this.isCollapsed = !this.isCollapsed;
	}

	private onNotification(notification) {
		if (notification) {
			const { type, payload } = notification;
			switch (type) {
				case UpdateProgress.IgnoredUpdates:
					this.checkSelectAllStatus();
					break;
			}
		}
	}

	private checkSelectAllStatus() {
		let selectAll = true;
		let unIgnoredUpdates = 0;
		let disableSelect = true;
		this.systemUpdateService.updateInfo.updateList.forEach((update) => {
			if (!update.isIgnored) {
				unIgnoredUpdates++;
			}
			if (!update.isIgnored && !update.isDependency) {
				disableSelect = false;
			}
			if (!update.isIgnored && !update.isSelected) {
				selectAll = false;
			}
		});
		this.disableSelectAll = disableSelect;
		this.isSelectAll = unIgnoredUpdates > 0 && selectAll;
	}

	private checkSelectedUpdateStatus() {
		const selectedUpdates = this.systemUpdateService.getSelectedUpdates(
			this.systemUpdateService.updateInfo.updateList
		);
		this.isUpdateSelected = selectedUpdates.length > 0;
		this.expandIgnoredForDependencyUpdates();
	}

	private expandIgnoredForDependencyUpdates() {
		if (this.isCollapsed) {
			const dependencyInIgnored = this.ignoredUpdates.find((x) => x.isDependency);
			if (dependencyInIgnored) {
				this.isCollapsed = false;
			}
		}
	}

	private expandIgnoredForInstallationResult() {
		if (this.mIsInstallationCompleted && this.ignoredUpdates.length > 0 && this.isCollapsed) {
			this.isCollapsed = false;
		}
	}
}
