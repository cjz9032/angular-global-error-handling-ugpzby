import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { SystemUpdateService } from 'src/app/services/system-update/system-update.service';
import { CommonService } from 'src/app/services/common/common.service';
import { Subscription } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { UpdateProgress } from 'src/app/enums/update-progress.enum';
import { AvailableUpdateDetail } from 'src/app/data-models/system-update/available-update-detail.model';
import { InstallUpdate } from 'src/app/data-models/system-update/install-update.model';
import { UpdateInstallAction } from 'src/app/enums/update-install-action.enum';
import { UpdateInstallSeverity } from 'src/app/enums/update-install-severity.enum';
import { ModalCommonConfirmationComponent } from '../../modal/modal-common-confirmation/modal-common-confirmation.component';
import { UpdateRebootType } from 'src/app/enums/update-reboot-type.enum';
import { SystemUpdateStatusMessage } from 'src/app/data-models/system-update/system-update-status-message.model';

@Component({
	selector: 'vtr-page-device-updates',
	templateUrl: './page-device-updates.component.html',
	styleUrls: ['./page-device-updates.component.scss']
})
export class PageDeviceUpdatesComponent implements OnInit, OnDestroy {
	title = 'System Updates';
	back = 'BACK';
	backarrow = '< ';
	private lastUpdatedText = 'Last update was on';
	private nextScanText = 'Next update scan is scheduled on';
	private lastInstallTime = new Date('1970-01-01T01:00:00');
	// private lastScanTime = new Date('1970-01-01T01:00:00');
	private nextScheduleScanTime = new Date('1970-01-01T01:00:00');
	private isScheduleScanEnabled = false;
	public percentCompleted = 0;
	public updateInfo;
	public criticalUpdates: AvailableUpdateDetail[];
	public recommendedUpdates: AvailableUpdateDetail[];
	public optionalUpdates: AvailableUpdateDetail[];
	public isUpdatesAvailable = false;
	public isUpdateCheckInProgress = false;
	public isUpdateDownloading = false;
	public installationPercent = 0;
	public downloadingPercent = 0;
	public isRebootRequired = false;
	public isInstallationSuccess = false;
	public isInstallationCompleted = false;
	public showFullHistory = false;
	private notificationSubscription: Subscription;
	private isComponentInitialized = false;
	public updateTitle = '';

	nextUpdatedDate = '11/12/2018 at 10:00 AM';
	installationHistory = 'Installation History';

	installationHistoryList = [
		{
			status: 'fail',
			icon: 'times',
			installationDate: '14 FEB 2018',
			path: '/'
		},
		{
			status: 'pause',
			icon: 'minus',
			installationDate: '16 MAR 2018',
			path: '/'
		},
		{
			status: 'success',
			icon: 'check',
			installationDate: '21 JUL 2018',
			path: '/'
		}
	];

	public autoUpdateOptions = [
		{
			readMoreText: '',
			rightImageSource: ['far', 'question-circle'],
			leftImageSource: ['fas', 'battery-three-quarters'],
			header: 'Critical Updates',
			name: 'critical-updates',
			subHeader: '',
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isChecked: true,
			tooltipText: 'Critical updates can prevent significant problem, major malfunctions, hardware failure, or data corruption.',
			type: 'auto-updates'
		},
		{
			readMoreText: '',
			rightImageSource: ['far', 'question-circle'],
			leftImageSource: ['fas', 'battery-three-quarters'],
			header: 'Recommended Updates',
			name: 'recommended-updates',
			subHeader: '',
			isCheckBoxVisible: false,
			isSwitchVisible: true,
			isChecked: true,
			tooltipText: 'Recommended driver updates keep your computer running at optimal performance.',
			type: 'auto-updates'
		},
		{
			readMoreText: '',
			rightImageSource: '',
			leftImageSource: ['fas', 'battery-three-quarters'],
			header: 'Windows Updates',
			name: 'windows-updates',
			subHeader: '',
			isCheckBoxVisible: false,
			isSwitchVisible: false,
			isChecked: true,
			linkText: 'Windows Settings',
			linkPath: '',
			type: 'auto-updates'

		}
	];

	constructor(
		private systemUpdateService: SystemUpdateService
		, private commonService: CommonService
		, private ngZone: NgZone
		, private modalService: NgbModal
	) { }

	ngOnInit() {
		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});

		if (this.systemUpdateService.isUpdatesAvailable && !this.systemUpdateService.isInstallationComplete) {
			this.isUpdatesAvailable = true;
			this.setUpdateByCategory(this.systemUpdateService.updateInfo.updateList);
		}

		this.getLastUpdateScanDetail();
		this.systemUpdateService.getUpdateSchedule();
		this.systemUpdateService.getUpdateHistory();
		this.getScheduleUpdateStatus(false);
		this.isComponentInitialized = true;
		this.setUpdateTitle();
	}

	ngOnDestroy() {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
	}

	private setUpdateTitle(title?: string) {
		if (title) {
			this.updateTitle = title;
		} else {
			this.updateTitle = 'An up-to-date system is a healthy system.';
		}
	}

	private getLastUpdateScanDetail() {
		if (this.systemUpdateService.isShellAvailable) {
			this.systemUpdateService.getMostRecentUpdateInfo()
				.then((value: any) => {
					// console.log('getLastUpdateScanDetail.then', value);
					this.lastInstallTime = new Date(value.lastInstallTime);
					// this.lastScanTime = new Date(value.lastScanTime);
					this.nextScheduleScanTime = new Date(value.nextScheduleScanTime);
					this.isScheduleScanEnabled = value.scheduleScanEnabled;
					// lastInstallTime: "2019-03-01T10:09:53"
					// lastScanTime: "2019-03-12T18:24:03"
					// nextScheduleScanTime: "2019-03-15T10:07:42"
					// scheduleScanEnabled: true
				}).catch(error => {
					console.error('getLastUpdateScanDetail', error);
				});
		}
	}

	public getLastUpdatedText() {
		if (this.lastInstallTime) {
			const installDate = this.commonService.formatDate(this.lastInstallTime.toISOString());
			const installTime = this.commonService.formatTime(this.lastInstallTime.toISOString());
			return `${this.lastUpdatedText} ${installDate} at ${installTime}`;
		}
		return `${this.lastUpdatedText} not available`;
	}

	public getNextUpdatedScanText() {
		if (!this.isScheduleScanEnabled) {
			return '';
		} else if (this.nextScheduleScanTime) {
			const scanDate = this.commonService.formatDate(this.nextScheduleScanTime.toISOString());
			const scanTime = this.commonService.formatTime(this.nextScheduleScanTime.toISOString());
			return `${this.nextScanText} ${scanDate} at ${scanTime}`;
		}
		return `${this.nextScanText} not available`;
	}

	public onCheckForUpdates() {
		if (this.systemUpdateService.isShellAvailable) {
			this.isUpdateCheckInProgress = true;
			this.isUpdatesAvailable = false;
			this.resetState();
			this.systemUpdateService.checkForUpdates();
		}
	}

	public onCancelUpdateCheck() {
		if (this.systemUpdateService.isShellAvailable) {
			this.systemUpdateService.cancelUpdateCheck();
		}
	}

	public onUpdateSelectionChange($event: any) {
		console.log($event);
		const item = $event.target;
		this.systemUpdateService.toggleUpdateSelection(item.name, item.checked);
	}

	private installAllUpdate() {
		if (this.systemUpdateService.isShellAvailable && this.systemUpdateService.isUpdatesAvailable) {
			this.resetState();
			this.systemUpdateService.installAllUpdates();
		}
	}

	private installSelectedUpdate() {
		if (this.systemUpdateService.isShellAvailable && this.systemUpdateService.isUpdatesAvailable) {
			this.resetState();
			this.systemUpdateService.installSelectedUpdates();
		}
	}

	public onUpdateToggleOnOff($event) {
		console.log('onUpdateToggleOnOff', $event);
		if (this.systemUpdateService.isShellAvailable) {
			const { name, checked } = $event.target;
			let { criticalAutoUpdates, recommendedAutoUpdates } = this.systemUpdateService.autoUpdateStatus;
			if (name === 'critical-updates') {
				criticalAutoUpdates = checked;
			} else if (name === 'recommended-updates') {
				recommendedAutoUpdates = checked;
			}
			this.systemUpdateService.setUpdateSchedule(criticalAutoUpdates, recommendedAutoUpdates);
		}
	}

	public onToggleFullHistory() {
		this.showFullHistory = !this.showFullHistory;
	}

	public onReinstallUpdate(packageID: string) {
		if (packageID) {
			const update = new InstallUpdate();
			update.packageID = packageID;
			update.action = UpdateInstallAction.DownloadAndInstall;
			update.severity = UpdateInstallSeverity.Recommended;
			this.systemUpdateService.installFailedUpdate(update);
		}
	}

	public isUpdateListVisible() {
		const isVisible = (this.isUpdatesAvailable && !this.isUpdateDownloading) || this.isInstallationCompleted;
		return isVisible;
	}

	public onRebootClick($event) {
		this.systemUpdateService.restartWindows();
	}

	public onDismissClick($event) {
		this.isRebootRequired = false;
	}

	public showInstallConfirmation(source: string) {
		const modalRef = this.modalService
			.open(ModalCommonConfirmationComponent, {
				size: 'lg',
				centered: true,
				windowClass: 'common-confirmation-modal'
			});
		const { rebootType, packages } = this.systemUpdateService.getRebootType(this.systemUpdateService.updateInfo.updateList, source);

		if (rebootType === UpdateRebootType.RebootDelayed) {
			this.showRebootDelayedModal(modalRef);
		} else if (rebootType === UpdateRebootType.RebootForced) {
			this.showRebootForceModal(modalRef);
		} else if (rebootType === UpdateRebootType.PowerOffForced) {
			this.showPowerOffForceModal(modalRef);
		} else {
			modalRef.dismiss();
			// its normal update type installation which doesn't require rebooting/power-off
			this.installUpdateBySource(source);
			return;
		}
		modalRef.componentInstance.packages = packages;
		modalRef.result.then(
			result => {
				// on open
				console.log('common-confirmation-modal', result, source);
				if (result) {
					this.installUpdateBySource(source);
				}
			},
			reason => {
				// on close
				console.log('common-confirmation-modal', reason, source);
			}
		);
	}

	private installUpdateBySource(source: string) {
		if (source === 'selected') {
			this.installSelectedUpdate();
		} else {
			this.installAllUpdate();
		}
	}

	private showRebootForceModal(modalRef: NgbModalRef) {
		const header = 'Reboot Pending';
		const description = 'The update(s) you selected will cause the system to reboot automatically after installation.';
		modalRef.componentInstance.header = header;
		modalRef.componentInstance.description = description;
	}

	private showPowerOffForceModal(modalRef: NgbModalRef) {
		const header = 'Shut Down';
		const description = 'The update(s) you selected will cause the system to shut down automatically after installation.';
		modalRef.componentInstance.header = header;
		modalRef.componentInstance.description = description;
	}

	private showRebootDelayedModal(modalRef: NgbModalRef) {
		const header = 'Reboot Pending';
		const description = 'The update(s) you selected will cause the system to reboot after installation, during the installation of updates' +
			', please do not turn off your system, remove power source or accessories. We recommend saving your work in preparation for your system rebooting.';
		modalRef.componentInstance.header = header;
		modalRef.componentInstance.description = description;
	}

	private setUpdateByCategory(updateList: Array<AvailableUpdateDetail>) {
		if (updateList) {
			this.optionalUpdates = this.filterUpdate(updateList, 'optional');
			this.recommendedUpdates = this.filterUpdate(updateList, 'recommended');
			this.criticalUpdates = this.filterUpdate(updateList, 'critical');
		}
	}

	private filterUpdate(updateList: Array<AvailableUpdateDetail>, packageSeverity: string) {
		const updates = updateList.filter((value: AvailableUpdateDetail) => {
			return (value.packageSeverity.toLowerCase() === packageSeverity.toLowerCase()
				&& value.isSelected);
		});
		return updates;
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			const { type, payload } = notification;

			switch (type) {
				case UpdateProgress.UpdateCheckInProgress:
					this.ngZone.run(() => {
						this.isUpdateCheckInProgress = true;
						this.percentCompleted = payload;
					});
					break;
				case UpdateProgress.UpdateCheckCompleted:
					this.isUpdateCheckInProgress = false;
					this.percentCompleted = 0;

					for (const key in SystemUpdateStatusMessage) {
						if (SystemUpdateStatusMessage.hasOwnProperty(key)) {
							if (SystemUpdateStatusMessage[key].code === payload.status) {
								this.setUpdateTitle(SystemUpdateStatusMessage[key].message);
							}
						}
					}

					break;
				case UpdateProgress.UpdatesAvailable:
					this.isUpdateCheckInProgress = false;
					this.percentCompleted = 0;
					this.isUpdatesAvailable = true;
					this.setUpdateByCategory(payload.updateList);
					break;
				// case UpdateProgress.UpdatesNotAvailable:
				// 	// todo : no updates available msg
				// 	break;
				case UpdateProgress.InstallationStarted:
					this.setUpdateByCategory(this.systemUpdateService.updateInfo.updateList);
					break;
				case UpdateProgress.InstallingUpdate:
					this.ngZone.run(() => {
						this.isUpdateDownloading = true;
						this.installationPercent = payload.installPercentage;
						this.downloadingPercent = payload.downloadPercentage;
					});
					break;
				case UpdateProgress.InstallationComplete:
					this.isUpdateDownloading = false;
					this.isInstallationCompleted = true;
					this.isInstallationSuccess = (payload.status === SystemUpdateStatusMessage.SUCCESS.code);
					this.checkRebootRequired();
					break;
				case UpdateProgress.AutoUpdateStatus:
					this.autoUpdateOptions[0].isChecked = payload.criticalAutoUpdates;
					this.autoUpdateOptions[1].isChecked = payload.recommendedAutoUpdates;
					break;
				default:
					break;
			}
			this.onScheduleUpdateNotification(type, payload);
		}
	}

	private onScheduleUpdateNotification(type: string, payload: any) {
		if (this.isComponentInitialized) {
			console.log('onScheduleUpdateNotification', type, payload);
			switch (type) {
				case UpdateProgress.ScheduleUpdateChecking:
					this.isUpdateCheckInProgress = true;
					break;
				case UpdateProgress.ScheduleUpdateDownloading:
					this.isUpdateCheckInProgress = false;
					this.isUpdateDownloading = true;
					this.installationPercent = 0;
					if (payload.downloadProgress) {
						this.downloadingPercent = payload.downloadProgress.progressinPercentage;
					}
					break;
				case UpdateProgress.ScheduleUpdateInstalling:
					this.isUpdateCheckInProgress = false;
					this.isUpdateDownloading = true;
					this.downloadingPercent = 100;
					if (payload.installProgress) {
						this.installationPercent = payload.installProgress.progressinPercentage;
					}
					break;
				case UpdateProgress.ScheduleUpdateIdle:
					this.isUpdateCheckInProgress = false;
					this.isUpdateDownloading = false;
					this.resetState();
					break;
				case UpdateProgress.ScheduleUpdateCheckComplete:
					this.isUpdateDownloading = false;
					this.isInstallationCompleted = true;
					this.isInstallationSuccess = (payload.status === SystemUpdateStatusMessage.SUCCESS.code);
					this.setUpdateByCategory(payload.updateList);
					this.checkRebootRequired();
					break;
				default:
					break;
			}
		}
	}

	private resetState() {
		this.isUpdateDownloading = false;
		this.isInstallationSuccess = false;
		this.isInstallationCompleted = false;
	}

	private getScheduleUpdateStatus(reportProgress: boolean) {
		this.systemUpdateService.getScheduleUpdateStatus(reportProgress);
	}

	private checkRebootRequired() {
		this.isRebootRequired = this.systemUpdateService.isRebootRequired();
	}
}
