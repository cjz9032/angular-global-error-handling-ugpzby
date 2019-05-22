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
import { CMSService } from 'src/app/services/cms/cms.service';
import { UpdateActionResult } from 'src/app/enums/update-action-result.enum';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import {UpdateFailToastMessage} from 'src/app/enums/update.enum'

@Component({
	selector: 'vtr-page-device-updates',
	templateUrl: './page-device-updates.component.html',
	styleUrls: ['./page-device-updates.component.scss']
})
export class PageDeviceUpdatesComponent implements OnInit, OnDestroy {
	title = 'System Updates';
	back = 'BACK';
	backarrow = '< ';

	cardContentPositionA: any = {};

	private lastUpdatedText = 'Last update was on';
	private nextScanText = 'Next update scan is scheduled on';
	private lastInstallTime: string;
	// private lastScanTime = new Date('1970-01-01T01:00:00');
	private nextScheduleScanTime: string;
	private isScheduleScanEnabled = false;
	public criticalUpdates: AvailableUpdateDetail[];
	public recommendedUpdates: AvailableUpdateDetail[];
	public optionalUpdates: AvailableUpdateDetail[];
	public ignoredUpdates: AvailableUpdateDetail[];
	public isUpdateCheckInProgress = false;
	public isRebootRequested = false;
	public showFullHistory = false;
	private notificationSubscription: Subscription;
	private isComponentInitialized = false;
	public updateTitle = '';
	private isUserCancelledUpdateCheck = false;

	public isInstallationSuccess = false;
	public isInstallationCompleted = false;
	public percentCompleted = 0;
	public isUpdatesAvailable = false;
	public isUpdateDownloading = false;
	public installationPercent = 0;
	public downloadingPercent = 0;
	public isInstallingAllUpdates = true;

	public isOnline = true;
	public offlineSubtitle: string;

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
			linkText: 'Windows settings',
			linkPath: 'ms-settings:windowsupdate',
			type: 'auto-updates'

		}
	];

	public updateDetails = {
		manufacturer: 'Lenovo',
		version: '11.85.45.123',
		installedVersion: 'Not avaialable',
		downloadSize: '7.3 MB',
		diskSpaceNeeded: '30.5 MB'
	};

	constructor(
		public systemUpdateService: SystemUpdateService,
		private commonService: CommonService,
		private ngZone: NgZone,
		private modalService: NgbModal,
		private cmsService: CMSService
	) {
		this.isOnline = this.commonService.isOnline;
		this.fetchCMSArticles();
	}

	ngOnInit() {
		this.isInstallationSuccess = this.systemUpdateService.isInstallationSuccess;
		this.isInstallationCompleted = this.systemUpdateService.isInstallationCompleted;
		this.percentCompleted = this.systemUpdateService.percentCompleted;
		this.isUpdatesAvailable = this.systemUpdateService.isUpdatesAvailable;
		this.isUpdateDownloading = this.systemUpdateService.isUpdateDownloading;
		this.installationPercent = this.systemUpdateService.installationPercent;
		this.downloadingPercent = this.systemUpdateService.downloadingPercent;
		this.isInstallingAllUpdates = this.systemUpdateService.isInstallingAllUpdates;

		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});

		if (this.systemUpdateService.isUpdatesAvailable && !this.systemUpdateService.isInstallationCompleted) {
			this.systemUpdateService.isUpdatesAvailable = true;
			this.setUpdateByCategory(this.systemUpdateService.updateInfo.updateList);
		}

		this.getLastUpdateScanDetail();
		this.systemUpdateService.getUpdateSchedule();
		this.systemUpdateService.getUpdateHistory();
		this.getScheduleUpdateStatus(false);
		this.isComponentInitialized = true;
		this.setUpdateTitle();
	}

	fetchCMSArticles() {
		const queryOptions = {
			'Page': 'system-updates',
			'Lang': 'EN',
			'GEO': 'US',
			'OEM': 'Lenovo',
			'OS': 'Windows',
			'Segment': 'SMB',
			'Brand': 'Lenovo'
		};

		this.cmsService.fetchCMSContent(queryOptions).then(
			(response: any) => {
				const cardContentPositionA = this.cmsService.getOneCMSContent(response, 'inner-page-right-side-article-image-background', 'position-A')[0];
				if (cardContentPositionA) {
					this.cardContentPositionA = cardContentPositionA;
					if (this.cardContentPositionA.BrandName) {
						this.cardContentPositionA.BrandName = this.cardContentPositionA.BrandName.split('|')[0];
					}
				}
			},
			error => {
				console.log('fetchCMSContent error', error);
			}
		);
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
			// tslint:disable-next-line: no-console
			console.time('getMostRecentUpdateInfo');
			this.systemUpdateService.getMostRecentUpdateInfo()
				.then((value: any) => {
					// tslint:disable-next-line: no-console
					console.timeEnd('getMostRecentUpdateInfo');

					// console.log('getLastUpdateScanDetail.then', value);
					if (value.lastInstallTime && value.lastInstallTime.length > 0) {
						this.lastInstallTime = value.lastInstallTime;
					}
					// this.lastScanTime = new Date(value.lastScanTime);
					this.nextScheduleScanTime = value.nextScheduleScanTime;
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
		if (this.lastInstallTime && this.lastInstallTime.length > 0) {
			const installDate = this.commonService.formatDate(this.lastInstallTime);
			const installTime = this.commonService.formatTime(this.lastInstallTime);
			return `${this.lastUpdatedText} ${installDate} at ${installTime}`;
		}
		return `Welcome to use System Update.`;
	}

	public getNextUpdatedScanText() {
		if (!this.isScheduleScanEnabled) {
			return '';
		} else if (this.nextScheduleScanTime && this.nextScheduleScanTime.length > 0) {
			const scanDate = this.commonService.formatDate(this.nextScheduleScanTime);
			const scanTime = this.commonService.formatTime(this.nextScheduleScanTime);
			return `${this.nextScanText} ${scanDate} at ${scanTime}`;
		}
		return '';
	}

	public onCheckForUpdates() {
		if (this.systemUpdateService.isShellAvailable) {
			this.setUpdateTitle();
			this.isUserCancelledUpdateCheck = false;
			this.isUpdateCheckInProgress = true;
			this.isUpdatesAvailable = false;
			this.systemUpdateService.isUpdatesAvailable = false;
			this.isInstallingAllUpdates = true;
			this.systemUpdateService.isInstallingAllUpdates = true;
			this.resetState();
			this.systemUpdateService.checkForUpdates();
		}
	}

	public onCancelUpdateCheck() {
		if (this.systemUpdateService.isShellAvailable) {
			this.isUserCancelledUpdateCheck = true;
			this.systemUpdateService.cancelUpdateCheck();
		}
	}

	public onUpdateSelectionChange($event: any) {
		const item = $event.target;
		this.systemUpdateService.toggleUpdateSelection(item.name, item.checked);
	}

	public onIgnoredUpdate($event: any){
		const packageName = $event.packageName;
		const isIgnored = $event.isIgnored;
		if (isIgnored === true){
			this.systemUpdateService.ignoreUpdate(packageName);
		} else {
			this.systemUpdateService.unIgnoreUpdate(packageName);
		}
	}

	private installAllUpdate(removeDelayedUpdates: boolean) {
		if (this.systemUpdateService.isShellAvailable && this.systemUpdateService.isUpdatesAvailable) {
			this.isInstallingAllUpdates = true;
			this.systemUpdateService.isInstallingAllUpdates = true;
			this.resetState();
			this.systemUpdateService.installAllUpdates(removeDelayedUpdates);
		}
	}

	private installSelectedUpdate(removeDelayedUpdates: boolean) {
		if (this.systemUpdateService.isShellAvailable && this.systemUpdateService.isUpdatesAvailable) {
			this.isInstallingAllUpdates = false;
			this.systemUpdateService.isInstallingAllUpdates = false;
			this.resetState();
			this.systemUpdateService.installSelectedUpdates(removeDelayedUpdates);
		}
	}

	public onUpdateToggleOnOff($event) {
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
		const isVisible = (this.systemUpdateService.isUpdatesAvailable && !this.systemUpdateService.isUpdateDownloading) || this.systemUpdateService.isInstallationCompleted;
		return isVisible;
	}

	public onRebootClick($event) {
		this.systemUpdateService.restartWindows();
	}

	public onDismissClick($event) {
		this.isRebootRequested = false;
	}

	public showInstallConfirmation(source: string) {
		const modalRef = this.modalService
			.open(ModalCommonConfirmationComponent, {
				backdrop: 'static',
				size: 'lg',
				centered: true,
				windowClass: 'common-confirmation-modal'
			});
		modalRef.componentInstance.metricsParent = "Pages.SystemUpdate.RebootRequiredControl";
		const { rebootType, packages } = this.systemUpdateService.getRebootType(this.systemUpdateService.updateInfo.updateList, source);
		let removeDelayedUpdates = false;
		if (rebootType === UpdateRebootType.RebootDelayed) {
			this.showRebootDelayedModal(modalRef);
		} else if (rebootType === UpdateRebootType.RebootForced) {
			this.showRebootForceModal(modalRef);
		} else if (rebootType === UpdateRebootType.PowerOffForced) {
			this.showPowerOffForceModal(modalRef);
		} else {
			modalRef.dismiss();
			// its normal update type installation which doesn't require rebooting/power-off
			this.installUpdateBySource(source, removeDelayedUpdates);
			return;
		}
		modalRef.componentInstance.packages = packages;
		modalRef.componentInstance.OkText = 'device.systemUpdates.popup.okayButton';
		modalRef.componentInstance.CancelText = 'device.systemUpdates.popup.cancelButton';
		modalRef.result.then(
			result => {
				// on open
				if (result) {
					if(this.systemUpdateService.getACAttachedStatus()) {
						removeDelayedUpdates = false;
					} else {
						removeDelayedUpdates = true;
					}
					this.installUpdateBySource(source, removeDelayedUpdates);
				}
			},
			reason => {
				// on close
				console.log('common-confirmation-modal on close', reason, source);
			}
		);
	}

	public onGetSupportClick($event: any) {
	}

	private installUpdateBySource(source: string, removeDelayedUpdates: boolean) {
		if (source === 'selected') {
			this.installSelectedUpdate(removeDelayedUpdates);
		} else {
			this.installAllUpdate(removeDelayedUpdates);
		}
	}

	private showRebootForceModal(modalRef: NgbModalRef) {
		const header = 'device.systemUpdates.popup.reboot';
		const description = 'device.systemUpdates.popup.rebootForceMsg';
		modalRef.componentInstance.header = header;
		modalRef.componentInstance.description = description;
	}

	private showPowerOffForceModal(modalRef: NgbModalRef) {
		const header = 'device.systemUpdates.popup.shutdown';
		const description = 'device.systemUpdates.popup.shutdownForceMsg';
		modalRef.componentInstance.header = header;
		modalRef.componentInstance.description = description;
	}

	private showRebootDelayedModal(modalRef: NgbModalRef) {
		const header = 'device.systemUpdates.popup.reboot';
		const description = 'device.systemUpdates.popup.rebootDelayedMsg';
		modalRef.componentInstance.header = header;
		modalRef.componentInstance.description = description;
	}

	private setUpdateByCategory(updateList: Array<AvailableUpdateDetail>) {
		if (updateList) {
			this.ignoredUpdates =  this.filterIgnoredUpdate(updateList, true);
			const unIgnoredUpdates = this.filterIgnoredUpdate(updateList, false);
			this.optionalUpdates = this.filterUpdate(unIgnoredUpdates, 'optional');
			this.recommendedUpdates = this.filterUpdate(unIgnoredUpdates, 'recommended');
			this.criticalUpdates = this.filterUpdate(unIgnoredUpdates, 'critical');
		}
	}

	private showToastMessage(updateList: Array<AvailableUpdateDetail>) {
		const failedUpdates = updateList.find((update) => {
			return (update.installationStatus === UpdateActionResult.DownloadFailed 
				|| update.installationStatus === UpdateActionResult.InstallFailed);
		});
		if (failedUpdates) {
			this.systemUpdateService.queueToastMessage(UpdateFailToastMessage.MessageID, '', '');
		}
	}

	private filterIgnoredUpdate(updateList: Array<AvailableUpdateDetail>, isIgnored: boolean) {
		const updates = updateList.filter((value: AvailableUpdateDetail) => {
			return (value.isIgnored === isIgnored);
		});
		return updates;
	}

	private filterUpdate(updateList: Array<AvailableUpdateDetail>, packageSeverity: string) {
		const updates = updateList.filter((value: AvailableUpdateDetail) => {
			return (value.packageSeverity.toLowerCase() === packageSeverity.toLowerCase());
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
						this.percentCompleted = this.systemUpdateService.percentCompleted;
					});
					break;
				case UpdateProgress.UpdateCheckCompleted:
					this.isUpdateCheckInProgress = false;
					this.percentCompleted = this.systemUpdateService.percentCompleted;

					for (const key in SystemUpdateStatusMessage) {
						if (SystemUpdateStatusMessage.hasOwnProperty(key)) {
							if (SystemUpdateStatusMessage[key].code === payload.status) {
								if (this.isUserCancelledUpdateCheck) {
									// when user cancels update check its throwing unknown exception
								} else {
									this.setUpdateTitle(SystemUpdateStatusMessage[key].message);
								}
							}
						}
					}
					break;
				case UpdateProgress.UpdatesAvailable:
					this.isUpdateCheckInProgress = false;
					this.percentCompleted = this.systemUpdateService.percentCompleted;
					this.isUpdatesAvailable = this.systemUpdateService.isUpdatesAvailable;
					this.isInstallationCompleted = this.systemUpdateService.isInstallationCompleted;
					this.setUpdateByCategory(payload.updateList);
					this.systemUpdateService.getIgnoredUpdates();
					break;
				case UpdateProgress.InstallationStarted:
					this.setUpdateByCategory(this.systemUpdateService.updateInfo.updateList);
					break;
				case UpdateProgress.InstallingUpdate:
					this.isUpdateCheckInProgress = false;
					this.ngZone.run(() => {
						this.isUpdateDownloading = this.systemUpdateService.isUpdateDownloading;
						this.installationPercent = this.systemUpdateService.installationPercent;
						this.downloadingPercent = this.systemUpdateService.downloadingPercent;
					});
					break;
				case UpdateProgress.InstallationComplete:
					this.systemUpdateService.getUpdateHistory();
					this.isUpdateDownloading = this.systemUpdateService.isUpdateDownloading;
					this.isInstallationCompleted = this.systemUpdateService.isInstallationCompleted;
					this.isInstallationSuccess = this.systemUpdateService.isInstallationSuccess;
					this.checkRebootRequested();
					this.showToastMessage(payload.updateList);
					this.setUpdateByCategory(payload.updateList);					
					break;
				case UpdateProgress.AutoUpdateStatus:
					this.autoUpdateOptions[0].isChecked = payload.criticalAutoUpdates;
					this.autoUpdateOptions[1].isChecked = payload.recommendedAutoUpdates;
					break;
				case NetworkStatus.Online:
				case NetworkStatus.Offline:
					this.isOnline = notification.payload.isOnline;
					this.offlineSubtitle = `${this.getLastUpdatedText()}<br>${this.getNextUpdatedScanText()}`;
					break;
				case UpdateProgress.UpdateDownloadCancelled:
					this.ngZone.run(() => {
						this.isUpdateDownloading = this.systemUpdateService.isUpdateDownloading;
						this.isInstallingAllUpdates = this.systemUpdateService.isInstallingAllUpdates;
						this.percentCompleted = this.systemUpdateService.percentCompleted;
						this.isUpdatesAvailable = this.systemUpdateService.isUpdatesAvailable;
						this.installationPercent = this.systemUpdateService.installationPercent;
						this.downloadingPercent = this.systemUpdateService.downloadingPercent;
					});
					this.setUpdateByCategory(this.systemUpdateService.updateInfo.updateList);
					break;
				case UpdateProgress.IgnoredUpdates:
					this.setUpdateByCategory(notification.payload);
					break;
				default:
					break;
			}
			this.onScheduleUpdateNotification(type, payload);
		}
	}

	// handle background update notification
	private onScheduleUpdateNotification(type: string, payload: any) {
		if (this.isComponentInitialized) {
			switch (type) {
				case UpdateProgress.ScheduleUpdateChecking:
					this.isUpdateCheckInProgress = true;
					break;
				case UpdateProgress.ScheduleUpdateDownloading:
					this.ngZone.run(() => {
						this.isUpdateCheckInProgress = false;
						this.isUpdateDownloading = this.systemUpdateService.isUpdateDownloading;
						this.installationPercent = this.systemUpdateService.installationPercent;
						this.downloadingPercent = this.systemUpdateService.downloadingPercent;
					});
					break;
				case UpdateProgress.ScheduleUpdateInstalling:
					this.ngZone.run(() => {
						this.isUpdateCheckInProgress = false;
						this.isUpdateDownloading = this.systemUpdateService.isUpdateDownloading;
						this.downloadingPercent = this.systemUpdateService.downloadingPercent;
						this.installationPercent = this.systemUpdateService.installationPercent;
					});
					break;
				case UpdateProgress.ScheduleUpdateIdle:
					this.isUpdateCheckInProgress = false;
					this.isUpdateDownloading = this.systemUpdateService.isUpdateDownloading;
					this.resetState();
					break;
				case UpdateProgress.ScheduleUpdateCheckComplete:
					this.isUpdateDownloading = this.systemUpdateService.isUpdateDownloading;
					this.isInstallationCompleted = this.systemUpdateService.isInstallationCompleted;
					this.isInstallationSuccess = this.systemUpdateService.isInstallationSuccess;
					this.setUpdateByCategory(payload.updateList);
					this.systemUpdateService.getUpdateHistory();
					this.checkRebootRequested();
					break;
				default:
					break;
			}
		}
	}

	private resetState() {
		this.systemUpdateService.isUpdateDownloading = false;
		this.systemUpdateService.isInstallationSuccess = false;
		this.systemUpdateService.isInstallationCompleted = false;
	}

	private getScheduleUpdateStatus(reportProgress: boolean) {
		this.systemUpdateService.getScheduleUpdateStatus(reportProgress);
	}

	private checkRebootRequested() {
		this.isRebootRequested = this.systemUpdateService.isRebootRequested();
		if (this.isRebootRequested) {
			const modalRef = this.modalService
				.open(ModalCommonConfirmationComponent, {
					backdrop: 'static',
					size: 'lg',
					centered: true,
					windowClass: 'common-confirmation-modal'
				});

			const header = 'device.systemUpdates.popup.rebootPending';
			const description = 'device.systemUpdates.popup.rebootRequiredMsg';
			modalRef.componentInstance.header = header;
			modalRef.componentInstance.description = description;
			modalRef.componentInstance.OkText = 'device.systemUpdates.popup.rebootButton';
			modalRef.componentInstance.CancelText = 'device.systemUpdates.popup.dismissButton';
			modalRef.result.then(
				(result) => {
					if (result) {
						this.systemUpdateService.restartWindows();
					} else {
						this.isRebootRequested = false;
						modalRef.close();
					}
				}
			);
		}
	}

	private setIgnoredUpdates(ignoredUpdates){
		const ignoredUpdateDetails = [];
		const unIgnoredRecommendUpdates = [];
		const unIgnoredOptionalUpdates = [];
		if (this.recommendedUpdates && this.recommendedUpdates.length > 0) {
			this.recommendedUpdates.forEach((update) => {
				const result = ignoredUpdates.find(x => x.packageName === update.packageName);
				if (result) {
					update.isIgnored = true;
					ignoredUpdateDetails.push(update);
				} else {
					update.isIgnored = false;
					unIgnoredRecommendUpdates.push(update);
				}
			});

		}

		if (this.optionalUpdates && this.optionalUpdates.length > 0) {
			this.optionalUpdates.forEach((update) => {
				const result = ignoredUpdates.find(x => x.packageName === update.packageName);
				if (result) {
					update.isIgnored = true;
					ignoredUpdateDetails.push(update);
				} else {
					update.isIgnored = false;
					unIgnoredOptionalUpdates.push(update);
				}
			});

		}

		if (this.ignoredUpdates && this.ignoredUpdates.length > 0) {
			this.ignoredUpdates.forEach((update) => {
				const result = ignoredUpdates.find(x => x.packageName === update.packageName);
				if (result) {
					update.isIgnored = true;
					ignoredUpdateDetails.push(update);
				} else if (update.packageSeverity === UpdateInstallSeverity.Recommended) {
					update.isIgnored = false;
					unIgnoredRecommendUpdates.push(update);
				} else if (update.packageSeverity === UpdateInstallSeverity.Optional) {
					update.isIgnored = false;
					unIgnoredOptionalUpdates.push(update);
				}
			});
		}

		this.recommendedUpdates = unIgnoredRecommendUpdates;
		this.optionalUpdates = unIgnoredOptionalUpdates;
		this.ignoredUpdates = ignoredUpdateDetails;
	}

	public onCancelUpdateDownload() {
		this.systemUpdateService.cancelUpdateDownload();
	}
}
