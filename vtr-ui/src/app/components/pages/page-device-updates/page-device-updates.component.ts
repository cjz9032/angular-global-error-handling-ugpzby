import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { SystemUpdateService } from 'src/app/services/system-update/system-update.service';
import { CommonService } from 'src/app/services/common/common.service';
import { Subscription } from 'rxjs';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { UpdateProgress } from 'src/app/enums/update-progress.enum';
import { SystemUpdateStatusCode } from 'src/app/enums/system-update-status-code.enum';
import { AvailableUpdateDetail } from 'src/app/data-models/system-update/available-update-detail.model';

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
	public percentCompleted = 0;
	public updateInfo;
	public criticalUpdates: AvailableUpdateDetail[];
	public recommendedUpdates: AvailableUpdateDetail[];
	public optionalUpdates: AvailableUpdateDetail[];
	public isUpdatesAvailable = false;
	public canShowProgress = false;
	public isUpdateDownloading = false;
	public installationPercent = 0;
	public downloadingPercent = 0;

	public isInstallationSuccess = false;
	public isInstallationCompleted = false;

	private notificationSubscription: Subscription;

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
			tooltipText: 'Critical updates can prevent significant problem, major malfunctions, hardware failure, or data corruption.'
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
			tooltipText: 'Recommended driver updates keep your computer running at optimal performance.'
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
			linkPath: ''
		}
	];

	constructor(
		private systemUpdateService: SystemUpdateService
		, private commonService: CommonService
		, private ngZone: NgZone
	) { }

	ngOnInit() {
		this.getLastUpdateScanDetail();
		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});

		if (this.systemUpdateService.isUpdatesAvailable) {
			this.isUpdatesAvailable = true;
			this.setUpdateByCategory(this.systemUpdateService.updateInfo.updateList);
		}

		this.systemUpdateService.getUpdateSchedule();
	}

	ngOnDestroy() {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
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
		const installDate = this.commonService.formatDate(this.lastInstallTime.toISOString());
		const installTime = this.commonService.formatTime(this.lastInstallTime.toISOString());

		return `${this.lastUpdatedText} ${installDate} at ${installTime}`;
	}

	public getNextUpdatedScanText() {
		const scanDate = this.commonService.formatDate(this.nextScheduleScanTime.toISOString());
		const scanTime = this.commonService.formatTime(this.nextScheduleScanTime.toISOString());

		return `${this.nextScanText} ${scanDate} at ${scanTime}`;
	}

	public onCheckForUpdates() {
		if (this.systemUpdateService.isShellAvailable) {
			this.canShowProgress = true;
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

	public onInstallAllUpdate($event: any) {
		if (this.systemUpdateService.isShellAvailable && this.systemUpdateService.isUpdatesAvailable) {
			this.resetState();
			this.systemUpdateService.installUpdates();
		}
	}

	public onInstallSelectedUpdate($event: any) {
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
		console.log('onNotification', notification);

		if (notification) {
			const { type, payload } = notification;

			switch (type) {
				case UpdateProgress.UpdateCheckInProgress:
					this.ngZone.run(() => {
						this.canShowProgress = true;
						this.percentCompleted = payload;
					});
					break;
				case UpdateProgress.UpdateCheckCompleted:
					this.canShowProgress = false;
					this.percentCompleted = 0;
					break;
				case UpdateProgress.UpdatesAvailable:
					this.isUpdatesAvailable = true;
					this.setUpdateByCategory(payload.updateList);
					break;
				case UpdateProgress.UpdatesNotAvailable:
					// todo : no updates available msg
					break;
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
					this.isInstallationSuccess = (payload.status === SystemUpdateStatusCode.SUCCESS);
					break;
				case UpdateProgress.AutoUpdateStatus:
					this.autoUpdateOptions[0].isChecked = payload.criticalAutoUpdates;
					this.autoUpdateOptions[1].isChecked = payload.recommendedAutoUpdates;
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
}
