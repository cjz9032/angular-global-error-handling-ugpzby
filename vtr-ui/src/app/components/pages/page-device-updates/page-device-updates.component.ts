import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { SystemUpdateService } from 'src/app/services/system-update/system-update.service';
import { CommonService } from 'src/app/services/common/common.service';
import { Subscription } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

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
import { UpdateFailToastMessage } from 'src/app/enums/update.enum';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { MetricHelper } from 'src/app/data-models/metrics/metric-helper.model';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
	selector: 'vtr-page-device-updates',
	templateUrl: './page-device-updates.component.html',
	styleUrls: ['./page-device-updates.component.scss']
})
export class PageDeviceUpdatesComponent implements OnInit, OnDestroy {
	title = 'systemUpdates.title';
	back = 'systemUpdates.back';
	backarrow = '< ';
	updateToDateTitle = 'systemUpdates.banner.title';

	cardContentPositionA: any = {};

	private lastUpdatedText = 'systemUpdates.banner.last';
	private nextScanText = 'systemUpdates.banner.next';
	private neverCheckedText = 'systemUpdates.banner.neverChecked';
	private metricHelper: MetricHelper;
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
	private timeStartSearch;

	public isInstallationSuccess = false;
	public isInstallationCompleted = false;
	public percentCompleted = 0;
	public isUpdatesAvailable = false;
	public isUpdateDownloading = false;
	public isCheckingPluginStatus = true;
	public installationPercent = 0;
	public downloadingPercent = 0;
	public isInstallingAllUpdates = true;

	public isOnline = true;
	public offlineSubtitle: string;
	public supportLink = 'https://support.lenovo.com/';

	nextUpdatedDate = '11/12/2018 at 10:00 AM';
	installationHistory = 'systemUpdates.installationHistory';

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
			header: 'systemUpdates.autoUpdateSettings.critical.title',
			name: 'critical-updates',
			subHeader: '',
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isChecked: true,
			isDisabled: false,
			tooltipText: 'systemUpdates.autoUpdateSettings.critical.tooltip',
			type: 'auto-updates'
		},
		{
			readMoreText: '',
			rightImageSource: ['far', 'question-circle'],
			leftImageSource: ['fas', 'battery-three-quarters'],
			header: 'systemUpdates.autoUpdateSettings.recommended.title',
			name: 'recommended-updates',
			subHeader: '',
			isCheckBoxVisible: false,
			isSwitchVisible: true,
			isChecked: true,
			isDisabled: false,
			tooltipText: 'systemUpdates.autoUpdateSettings.recommended.tooltip',
			type: 'auto-updates'
		},
		{
			readMoreText: '',
			rightImageSource: '',
			leftImageSource: ['fas', 'battery-three-quarters'],
			header: 'systemUpdates.autoUpdateSettings.windows.title',
			name: 'windows-updates',
			subHeader: '',
			isCheckBoxVisible: false,
			isSwitchVisible: false,
			isChecked: true,
			isDisabled: false,
			linkText: 'systemUpdates.autoUpdateSettings.windows.url',
			linkPath: 'ms-settings:windowsupdate',
			type: 'auto-updates'

		}
	];

	public updateDetails = {
		manufacturer: 'Lenovo',
		version: '11.85.45.123',
		installedVersion: 'Not available',
		downloadSize: '7.3 MB',
		diskSpaceNeeded: '30.5 MB'
	};

	constructor(
		public systemUpdateService: SystemUpdateService,
		private commonService: CommonService,
		private ngZone: NgZone,
		private modalService: NgbModal,
		private cmsService: CMSService,
		private activatedRoute: ActivatedRoute,
		private translate: TranslateService,
		shellService: VantageShellService,
		private deviceService: DeviceService
	) {
		this.isOnline = this.commonService.isOnline;
		this.metricHelper = new MetricHelper(shellService.getMetrics());

		this.fetchCMSArticles();
		this.getSpecificSupportLink();
		this.translateStrings();
		this.getCashValue();
	}

	private translateStrings() {
		this.translate.stream(this.title).subscribe((res) => {
			this.title = res;
		});
		this.translate.stream(this.back).subscribe((res) => {
			this.back = res;
		});
		this.translate.stream(this.lastUpdatedText).subscribe((res) => {
			this.lastUpdatedText = res;
		});
		this.translate.stream(this.nextScanText).subscribe((res) => {
			this.nextScanText = res;
		});
		this.translate.stream(this.installationHistory).subscribe((res) => {
			this.installationHistory = res;
		});
		this.translate.stream(this.autoUpdateOptions[0].header).subscribe((res) => {
			this.autoUpdateOptions[0].header = res;
		});
		this.translate.stream(this.autoUpdateOptions[0].tooltipText).subscribe((res) => {
			this.autoUpdateOptions[0].tooltipText = res;
		});
		this.translate.stream(this.autoUpdateOptions[1].header).subscribe((res) => {
			this.autoUpdateOptions[1].header = res;
		});
		this.translate.stream(this.autoUpdateOptions[1].tooltipText).subscribe((res) => {
			this.autoUpdateOptions[1].tooltipText = res;
		});
		this.translate.stream(this.autoUpdateOptions[2].header).subscribe((res) => {
			this.autoUpdateOptions[2].header = res;
		});
		this.translate.stream(this.autoUpdateOptions[2].linkText).subscribe((res) => {
			this.autoUpdateOptions[2].linkText = res;
		});
		this.translate.stream(this.updateToDateTitle).subscribe((res) => {
			this.updateToDateTitle = res;
		});
		this.translate.stream(this.neverCheckedText).subscribe((res) => {
			this.neverCheckedText = res;
		});
	}

	ngOnInit() {
		const action = this.activatedRoute.snapshot.queryParams['action'];
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
		if (action && action.toLowerCase() === 'enable') {
			this.systemUpdateService.setUpdateSchedule(true, false);
		} else {
			this.systemUpdateService.getUpdateSchedule();
		}
		this.systemUpdateService.getUpdateHistory();
		this.getScheduleUpdateStatus(false);
		this.isComponentInitialized = true;
		this.setUpdateTitle();
	}

	getCashValue() {
		let cashData = this.commonService.getLocalStorageValue(LocalStorageKey.SystemUpdateCriticalUpdateStatus);
		if (typeof(cashData) !== 'undefined') {
			this.autoUpdateOptions[0].isChecked = cashData;
			this.isScheduleScanEnabled = cashData;
		}
		cashData = this.commonService.getLocalStorageValue(LocalStorageKey.SystemUpdateRecommendUpdateStatus);
		if (typeof(cashData) !== 'undefined') {
			this.autoUpdateOptions[1].isChecked = cashData;
			if (!this.autoUpdateOptions[0].isChecked) {
				this.autoUpdateOptions[1].isDisabled = true;
			}
		}
		cashData = this.commonService.getLocalStorageValue(LocalStorageKey.SystemUpdateLastInstallTime);
		if (cashData) {
			this.lastInstallTime = cashData;
		}
		cashData = this.commonService.getLocalStorageValue(LocalStorageKey.SystemUpdateNextScheduleScanTime);
		if (cashData) {
			this.nextScheduleScanTime = cashData;
		}

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

	private getSpecificSupportLink() {
		const machineInfo = this.deviceService.getMachineInfoSync();
		if (machineInfo && machineInfo.serialnumber && machineInfo.mtm && machineInfo.mtm.toLowerCase() !== 'invalid') {
			const specificSupportLink = `${this.supportLink}qrcode?sn=${machineInfo.serialnumber}&mtm=${machineInfo.mtm}`;
			this.supportLink = specificSupportLink;
		}
	}

	private setUpdateTitle(title?: string) {
		if (title) {
			this.updateTitle = title;
		} else {
			this.updateTitle = this.updateToDateTitle;
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
						this.commonService.setLocalStorageValue(LocalStorageKey.SystemUpdateLastInstallTime, this.lastInstallTime);
					}
					// this.lastScanTime = new Date(value.lastScanTime);
					this.nextScheduleScanTime = value.nextScheduleScanTime;
					this.commonService.setLocalStorageValue(LocalStorageKey.SystemUpdateNextScheduleScanTime, this.nextScheduleScanTime);
					this.isScheduleScanEnabled = value.scheduleScanEnabled;
					this.getNextUpdatedScanText();
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
		return this.neverCheckedText;
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
			this.isInstallingAllUpdates = false;
			this.systemUpdateService.isInstallingAllUpdates = true;
			this.resetState();
			this.systemUpdateService.checkForUpdates();
			this.timeStartSearch = new Date();
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
		// set the value twice to trigger the ui refresh, Some times the ui get some strange problems
		document.body.style.zoom = '1.1';
		document.body.style.zoom = '1.0';
	}

	public onIgnoredUpdate($event: any) {
		const packageName = $event.packageName;
		const isIgnored = $event.isIgnored;
		if (isIgnored === true) {
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
				const recommendUpdate = this.autoUpdateOptions.find((update) => {
					return update.name === 'recommended-updates';
				});
				if (!checked) {
					recommendedAutoUpdates = false;
					recommendUpdate.isChecked = false;
					recommendUpdate.isDisabled = true;
				} else {
					recommendUpdate.isDisabled = false;
				}
			} else if (name === 'recommended-updates') {
				recommendedAutoUpdates = checked;
				const criticalUpdate = this.autoUpdateOptions.find((update) => {
					return update.name === 'critical-updates';
				});
				if (checked && !criticalUpdate.isChecked) {
					criticalUpdate.isChecked = true;
					criticalAutoUpdates = true;
				}
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
		modalRef.componentInstance.OkText = 'systemUpdates.popup.okayButton';
		modalRef.componentInstance.CancelText = 'systemUpdates.popup.cancelButton';
		modalRef.componentInstance.metricsParent = 'Pages.SystemUpdate.RebootRequiredControl';

		modalRef.result.then(
			result => {
				// on open
				if (result) {
					if (this.systemUpdateService.getACAttachedStatus()) {
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
		const header = 'systemUpdates.popup.reboot';
		const description = 'systemUpdates.popup.rebootForceMsg';
		modalRef.componentInstance.header = header;
		modalRef.componentInstance.description = description;
	}

	private showPowerOffForceModal(modalRef: NgbModalRef) {
		const header = 'systemUpdates.popup.shutdown';
		const description = 'systemUpdates.popup.shutdownForceMsg';
		modalRef.componentInstance.header = header;
		modalRef.componentInstance.description = description;
	}

	private showRebootDelayedModal(modalRef: NgbModalRef) {
		const header = 'systemUpdates.popup.reboot';
		const description = 'systemUpdates.popup.rebootDelayedMsg';
		modalRef.componentInstance.header = header;
		modalRef.componentInstance.description = description;
	}

	private setUpdateByCategory(updateList: Array<AvailableUpdateDetail>) {
		if (updateList) {
			this.ignoredUpdates = this.filterIgnoredUpdate(updateList, true);
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

	private filterUpdateByResult(updateList: Array<AvailableUpdateDetail>, updateStatusArray: Array<string>) {
		const filterArray = updateStatusArray.map(item => item.toLocaleLowerCase());
		const updates = updateList.filter((value: AvailableUpdateDetail) => {
			return filterArray.indexOf(value.installationStatus.toLowerCase()) > -1;
		});
		return updates;
	}

	private filterUpdate(updateList: Array<AvailableUpdateDetail>, packageSeverity: string) {
		const updates = updateList.filter((value: AvailableUpdateDetail) => {
			return (value.packageSeverity.toLowerCase() === packageSeverity.toLowerCase());
		});
		return updates;
	}

	public mapPackageListToIdString(updateList: Array<AvailableUpdateDetail>) {
		return updateList.map(item => item.packageID).join(',');
	}

	private mapStatusToMessage(status: number, defaultValue = 'unknown') {
		let message = defaultValue;
		for (const key in SystemUpdateStatusMessage) {
			if (SystemUpdateStatusMessage.hasOwnProperty(key)) {
				if (SystemUpdateStatusMessage[key].code === status) {
					message = SystemUpdateStatusMessage[key].message;
				}
			}
		}
		return message;
	}

	private mapStatusToMessageKey(status: number, defaultValue = 'unknown') {
		let messageKey = defaultValue;
		for (const key in SystemUpdateStatusMessage) {
			if (SystemUpdateStatusMessage.hasOwnProperty(key)) {
				if (SystemUpdateStatusMessage[key].code === status) {
					messageKey = key;
				}
			}
		}
		return messageKey;
	}

	private sendInstallUpdateMetrics(updateList: Array<AvailableUpdateDetail>, ignoredUpdates: Array<AvailableUpdateDetail>) {
		const successUpdates = this.filterUpdateByResult(updateList, [UpdateActionResult.Success]);
		let failedUpdates = this.filterUpdateByResult(updateList,
			[UpdateActionResult.DownloadFailed, UpdateActionResult.InstallFailed]);

		if (ignoredUpdates && ignoredUpdates.length > 0) {
			failedUpdates = failedUpdates.filter(item => {
				for (const idx in ignoredUpdates) {
					if (ignoredUpdates[idx].packageID === item.packageID) {
						return false;
					}
				}
				return true;
			});

			const packageIds = this.mapPackageListToIdString(ignoredUpdates);
			this.metricHelper.sendInstallUpdateMetric(ignoredUpdates.length, packageIds, 'Ignored-NotInstallDueToACAdapterNotPluggedIn');
		}

		if (successUpdates.length > 0) {
			const packageIds = this.mapPackageListToIdString(successUpdates);
			this.metricHelper.sendInstallUpdateMetric(successUpdates.length, packageIds, 'success');
		}

		if (failedUpdates.length > 0) {
			const packageIds = this.mapPackageListToIdString(failedUpdates);
			this.metricHelper.sendInstallUpdateMetric(failedUpdates.length, packageIds, 'failure');
		}
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

					let messageKey = 'unknown';
					if (this.isUserCancelledUpdateCheck) {
						// when user cancels update check its throwing unknown exception
						messageKey = 'user cancel';
					} else {
						let metricMessage;
						metricMessage = this.mapStatusToMessage(payload.status);
						messageKey = this.mapStatusToMessageKey(payload.status);
						this.setUpdateTitle(metricMessage);
					}

					this.metricHelper.sendSystemUpdateMetric(
						0, '', messageKey,
						MetricHelper.timeSpan(new Date(), this.timeStartSearch));
					break;
				case UpdateProgress.UpdatesAvailable:
					this.isUpdateCheckInProgress = false;
					this.percentCompleted = this.systemUpdateService.percentCompleted;
					this.isUpdatesAvailable = this.systemUpdateService.isUpdatesAvailable;
					this.isInstallationCompleted = this.systemUpdateService.isInstallationCompleted;
					this.setUpdateByCategory(payload.updateList);
					this.systemUpdateService.getIgnoredUpdates();
					this.metricHelper.sendSystemUpdateMetric(
						payload.updateList.length,
						this.mapPackageListToIdString(payload.updateList),
						'success',
						MetricHelper.timeSpan(new Date(), this.timeStartSearch));
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
					this.sendInstallUpdateMetrics(payload.updateList, this.systemUpdateService.ignoredRebootDelayUpdates);
					break;
				case UpdateProgress.AutoUpdateStatus:
					this.autoUpdateOptions[0].isChecked = payload.criticalAutoUpdates;
					this.autoUpdateOptions[1].isChecked = payload.recommendedAutoUpdates;
					this.isScheduleScanEnabled = payload.criticalAutoUpdates;
					this.commonService.setLocalStorageValue(LocalStorageKey.SystemUpdateCriticalUpdateStatus, payload.criticalAutoUpdates);
					this.commonService.setLocalStorageValue(LocalStorageKey.SystemUpdateRecommendUpdateStatus, payload.recommendedAutoUpdates);
					if (!payload.criticalAutoUpdates) {
						this.autoUpdateOptions[1].isDisabled = true;
					} else {
						this.autoUpdateOptions[1].isDisabled = false;
					}
					this.getNextUpdatedScanText();
					break;
				case NetworkStatus.Online:
					if (this.isCheckingPluginStatus) {
						this.getScheduleUpdateStatus(false);
					}
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
					this.isCheckingPluginStatus = false;
					break;
				case UpdateProgress.ScheduleUpdateDownloading:
					this.ngZone.run(() => {
						this.isUpdateCheckInProgress = false;
						this.isCheckingPluginStatus = false;
						this.isUpdateDownloading = this.systemUpdateService.isUpdateDownloading;
						this.installationPercent = this.systemUpdateService.installationPercent;
						this.downloadingPercent = this.systemUpdateService.downloadingPercent;
					});
					break;
				case UpdateProgress.ScheduleUpdateInstalling:
					this.ngZone.run(() => {
						this.isUpdateCheckInProgress = false;
						this.isCheckingPluginStatus = false;
						this.isUpdateDownloading = this.systemUpdateService.isUpdateDownloading;
						this.downloadingPercent = this.systemUpdateService.downloadingPercent;
						this.installationPercent = this.systemUpdateService.installationPercent;
					});
					break;
				case UpdateProgress.ScheduleUpdateIdle:
					this.isUpdateCheckInProgress = false;
					this.isCheckingPluginStatus = false;
					this.isUpdateDownloading = this.systemUpdateService.isUpdateDownloading;
					this.resetState();
					break;
				case UpdateProgress.ScheduleUpdateCheckComplete:
					this.isCheckingPluginStatus = false;
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

			const header = 'systemUpdates.popup.rebootPending';
			const description = 'systemUpdates.popup.rebootRequiredMsg';
			modalRef.componentInstance.header = header;
			modalRef.componentInstance.description = description;
			modalRef.componentInstance.OkText = 'systemUpdates.popup.rebootButton';
			modalRef.componentInstance.CancelText = 'systemUpdates.popup.dismissButton';
			modalRef.componentInstance.metricsParent = 'Pages.SystemUpdate.RebootRequiredControl';
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

	public onCancelUpdateDownload() {
		this.systemUpdateService.cancelUpdateDownload();
	}
}
