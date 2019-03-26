import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { CommonService } from '../common/common.service';
import { UpdateProgress } from 'src/app/enums/update-progress.enum';
import { InstallUpdate } from 'src/app/data-models/system-update/install-update.model';
import { AvailableUpdate } from 'src/app/data-models/system-update/available-update.model';
import { AvailableUpdateDetail } from 'src/app/data-models/system-update/available-update-detail.model';
import { UpdateActionResult } from 'src/app/enums/update-action-result.enum';
import { UpdateHistory } from 'src/app/data-models/system-update/update-history.model';
import { ScheduleUpdateStatus } from 'src/app/data-models/system-update/schedule-update-status.model';
import { UpdateRebootType } from 'src/app/enums/update-reboot-type.enum';
import { SystemUpdateStatusMessage } from 'src/app/data-models/system-update/system-update-status-message.model';
import { UpdateInstallSeverity } from 'src/app/enums/update-install-severity.enum';

@Injectable({
	providedIn: 'root'
})
export class SystemUpdateService {

	constructor(
		shellService: VantageShellService
		, private commonService: CommonService) {
		this.systemUpdateBridge = shellService.getSystemUpdate();
		if (this.systemUpdateBridge) {
			this.isShellAvailable = true;
		}
	}
	private systemUpdateBridge: any;
	public autoUpdateStatus: any;
	public isShellAvailable = false;
	public isCheckForUpdateComplete = true;
	public isUpdatesAvailable = false;
	public isInstallationComplete = false;
	public updateInfo: AvailableUpdate;
	public installationHistory: Array<UpdateHistory>;

	/**
	 * gets data about last scan, install & schedule scan date-time for Check for Update section
	 */
	public getMostRecentUpdateInfo() {
		if (this.systemUpdateBridge) {
			return this.systemUpdateBridge.getMostRecentUpdateInfo();
		}
		return undefined;
	}

	/**
	 * return data about Auto update settings section
	 */
	public getUpdateSchedule() {
		if (this.systemUpdateBridge) {
			return this.systemUpdateBridge.getUpdateSchedule()
				.then((response) => {
					console.log('getUpdateSchedule', response);
					this.autoUpdateStatus = {
						criticalAutoUpdates: (response.criticalAutoUpdates === 'ON') ? true : false,
						recommendedAutoUpdates: (response.recommendedAutoUpdates === 'ON') ? true : false
					};
					this.commonService.sendNotification(UpdateProgress.AutoUpdateStatus, this.autoUpdateStatus);
				});
		}
		return undefined;
	}

	/**
	 * set option for Auto update settings section
	 * @param criticalUpdate boolean value, true = on, false = off
	 * @param recommendedUpdate  boolean value, true = on, false = off
	 */
	public setUpdateSchedule(criticalUpdate: boolean, recommendedUpdate: boolean) {
		if (this.systemUpdateBridge) {
			const request = {
				criticalAutoUpdates: (criticalUpdate) ? 'ON' : 'OFF',
				recommendedAutoUpdates: (recommendedUpdate) ? 'ON' : 'OFF'
			};
			this.systemUpdateBridge.setUpdateSchedule(request)
				.then((response) => {
					console.log('setUpdateSchedule', response);
				}).catch((error) => {
					// get current status
					this.getUpdateSchedule();
				});
		}
	}

	public getUpdateHistory() {
		if (this.systemUpdateBridge) {
			this.systemUpdateBridge.getUpdateHistory()
				.then((response: Array<UpdateHistory>) => {
					console.log('getUpdateHistory', response);
					this.installationHistory = response;
					this.commonService.sendNotification(UpdateProgress.FullHistory, this.installationHistory);
				}).catch((error) => {
					// get current status
					console.log('getUpdateHistory.error', error);
				});
		}
	}
	public checkForUpdates() {
		// checkForUpdates requires callback
		if (this.systemUpdateBridge) {
			this.isCheckForUpdateComplete = false;
			this.isInstallationComplete = false;
			this.systemUpdateBridge.checkForUpdates((progressPercentage: number) => {
				console.log('checkForUpdates callback', progressPercentage);
				this.commonService.sendNotification(UpdateProgress.UpdateCheckInProgress, progressPercentage);
			}).then((response) => {
				console.log('checkForUpdates response', response, typeof response.status);
				this.isCheckForUpdateComplete = true;
				const status = parseInt(response.status, 10);
				if (status === SystemUpdateStatusMessage.SUCCESS.code) { // success
					this.isUpdatesAvailable = (response.updateList && response.updateList.length > 0);
					this.updateInfo = { status: status, updateList: this.mapAvailableUpdateResponse(response.updateList) };
					// if (this.isUpdatesAvailable) {
					this.commonService.sendNotification(UpdateProgress.UpdatesAvailable, this.updateInfo);
					// } else {
					// 	this.commonService.sendNotification(UpdateProgress.UpdatesNotAvailable);
					// }
				} else {
					this.commonService.sendNotification(UpdateProgress.UpdateCheckCompleted, { ...response, status });
				}
			}).catch((error) => {
				console.log('checkForUpdates.error', error);
			});
		}
		return undefined;
	}

	public cancelUpdateCheck() {
		if (this.systemUpdateBridge) {
			this.systemUpdateBridge.cancelSearch()
				.then((status: boolean) => {
					// todo: ui changes to show on update cancel
				})
				.catch((error) => {
					console.log('cancelUpdateCheck.error', error);
				});
		}
	}

	public getScheduleUpdateStatus(canReportProgress: boolean) {
		if (this.systemUpdateBridge) {
			console.log('getScheduleUpdateStatus main', canReportProgress);

			this.systemUpdateBridge.getStatus(canReportProgress, (response: any) => {
				console.log('getScheduleUpdateStatus callback', response);
				this.processScheduleUpdate(response.payload);
			}).then((response: ScheduleUpdateStatus) => {
				console.log('getScheduleUpdateStatus response', response);
				this.processScheduleUpdate(response);
			});
		}
	}

	private processScheduleUpdate(response: any) {
		const status = response.status.toLowerCase();
		if ((status === 'installing' || status === 'checking' || status === 'downloading') && response.updateTaskList === null) {
			this.getScheduleUpdateStatus(true);
		} else if (status === 'installing') {
			this.commonService.sendNotification(UpdateProgress.ScheduleUpdateInstalling, response);
		} else if (status === 'checking') {
			this.commonService.sendNotification(UpdateProgress.ScheduleUpdateChecking, response);
		} else if (status === 'downloading') {
			this.commonService.sendNotification(UpdateProgress.ScheduleUpdateDownloading, response);
		} else if (status === 'idle') {
			if (response.updateTaskList && response.updateTaskList.length > 0) {
				this.updateInfo = this.mapScheduleInstallResponse(response.updateTaskList);
				this.commonService.sendNotification(UpdateProgress.ScheduleUpdateCheckComplete, this.updateInfo);
			} else {
				this.commonService.sendNotification(UpdateProgress.ScheduleUpdateIdle, response);
			}
		}
	}

	public installAllUpdates() {
		if (this.systemUpdateBridge && this.isUpdatesAvailable) {
			const updates = this.mapToInstallRequest(this.updateInfo.updateList);
			this.installUpdates(updates, true);
		}
	}

	public installSelectedUpdates() {
		if (this.systemUpdateBridge && this.isUpdatesAvailable) {
			const updatesToInstall = this.getSelectedUpdates(this.updateInfo.updateList);
			const updates = this.mapToInstallRequest(updatesToInstall);
			console.log('installSelectedUpdates', updatesToInstall, updates);
			this.installUpdates(updates, false);
		}
	}

	public installFailedUpdate(update: InstallUpdate) {
		if (this.systemUpdateBridge) {
			console.log('installFailedUpdate', update);
			const updates = new Array<InstallUpdate>();
			updates.push(update);
			this.installUpdates(updates, false);
		}
	}

	public restartWindows() {
		if (this.systemUpdateBridge) {
			this.commonService.sendNotification(UpdateProgress.WindowsRebootRequested);
			this.systemUpdateBridge.restartWindows()
				.then((status: boolean) => {
					if (status) {
						this.commonService.sendNotification(UpdateProgress.WindowsRebooting);
					}
				})
				.catch((error) => {
					console.log('cancelUpdateCheck.error', error);
				});
		}
	}

	public getIgnoredUpdates() {

	}

	public ignoreUpdate() {

		// package name
	}
	public unignoreUpdate() {

		// package name
	}

	public toggleUpdateSelection(packageName: string, isSelected: boolean) {
		if (this.updateInfo.updateList && this.updateInfo.updateList.length > 0) {
			const update = this.updateInfo.updateList.find((value) => {
				return value.packageName === packageName;
			});
			if (update.packageName === packageName) {
				update.isSelected = isSelected;
			}
		}
	}

	public sortInstallationHistory(history: Array<UpdateHistory>, isAscending = true) {
		if (history) {
			history.sort((a: UpdateHistory, b: UpdateHistory) => {
				const d1 = new Date(b.utcInstallDate);
				const d2 = new Date(a.utcInstallDate);
				if (!isAscending) {
					return d2.getTime() - d1.getTime();
				}
				return d1.getTime() - d2.getTime();
			});
		}
	}

	public isRebootRequired(): boolean {
		if (this.updateInfo) {
			for (let index = 0; index < this.updateInfo.updateList.length; index++) {
				const update = this.updateInfo.updateList[index];
				if ((update.packageRebootType === 'RebootRequested' || update.packageRebootType === 'RebootDelayed') && update.isInstalled) {
					return true;
				}
			}
		}
		return false;
	}

	// returns reboot type and array of update name which requires pop up to show before installation
	public getRebootType(updateList: Array<AvailableUpdateDetail>, source: string): { rebootType: UpdateRebootType, packages: Array<string> } {
		let rebootType = UpdateRebootType.Unknown;
		const packages = new Array<string>();

		const rebootDelayedUpdates = this.getUpdateByRebootType(updateList, UpdateRebootType.RebootDelayed, source);
		const rebootForcedUpdates = this.getUpdateByRebootType(updateList, UpdateRebootType.RebootForced, source);
		const powerOffForcedUpdates = this.getUpdateByRebootType(updateList, UpdateRebootType.PowerOffForced, source);

		// Priority #1 RebootDelayed : return details of it, no need to check other.
		if (rebootDelayedUpdates && rebootDelayedUpdates.length > 0) {
			rebootType = UpdateRebootType.RebootDelayed;
			const updates = rebootDelayedUpdates.map<string>((value) => {
				return value.packageDesc;
			});
			packages.push(...updates);
		}
		// Priority #2 RebootForced : return details of it, no need to check other.
		if (rebootForcedUpdates && rebootForcedUpdates.length > 0) {
			if (rebootType === UpdateRebootType.Unknown) {
				rebootType = UpdateRebootType.RebootForced;
			}
			const updates = rebootForcedUpdates.map((value) => {
				return value.packageDesc;
			});
			packages.push(...updates);
		}
		// Priority #3 PowerOffForced : return details of it, no need to check other.
		if (powerOffForcedUpdates && powerOffForcedUpdates.length > 0) {
			if (rebootType === UpdateRebootType.Unknown) {
				rebootType = UpdateRebootType.PowerOffForced;
			}
			const updates = powerOffForcedUpdates.map((value) => {
				return value.packageDesc;
			});
			packages.push(...updates);
		}
		return { rebootType, packages };
	}

	private getUpdateByRebootType(updateList: Array<AvailableUpdateDetail>, rebootType: UpdateRebootType, source: string): Array<AvailableUpdateDetail> {

		const updates = updateList.filter((value: AvailableUpdateDetail) => {
			return ((value.packageRebootType.toLowerCase() === rebootType.toLocaleLowerCase()) && (value.isSelected || source === 'all'));
		});
		return updates;
	}

	private installUpdates(updates: Array<InstallUpdate>, isInstallingAllUpdates: boolean) {
		let isInvoked = false;
		this.systemUpdateBridge.installUpdates(updates, (progress: any) => {
			if (!isInvoked) {
				isInvoked = true;
				this.commonService.sendNotification(UpdateProgress.InstallationStarted);
			}
			console.log('installUpdates callback', progress);
			this.commonService.sendNotification(UpdateProgress.InstallingUpdate, progress);
		}).then((response: any) => {
			console.log('installUpdates response', response);
			if (response) {
				this.isInstallationComplete = true;
				this.mapInstallationStatus(this.updateInfo.updateList, response.updateResultList, isInstallingAllUpdates);
				const payload = new AvailableUpdate();
				payload.status = parseInt(response.status, 10);
				payload.updateList = this.updateInfo.updateList;
				this.commonService.sendNotification(UpdateProgress.InstallationComplete, payload);
			}
		});
	}

	private mapToInstallRequest(updateList: Array<AvailableUpdateDetail>): InstallUpdate[] {
		const packageToInstall: InstallUpdate[] = [];

		if (updateList && updateList.length > 0) {
			updateList.forEach((update) => {
				const pkg = new InstallUpdate();
				pkg.packageID = update.packageID;
				pkg.severity = update.packageSeverity;
				packageToInstall.push(pkg);
			});
		}
		return packageToInstall;
	}

	private mapAvailableUpdateResponse(updateList: Array<any>): AvailableUpdateDetail[] {
		const updates: AvailableUpdateDetail[] = [];

		if (updateList && updateList.length > 0) {
			updateList.forEach((update) => {
				const updateDetail = new AvailableUpdateDetail();
				updateDetail.licenseUrl = update.licenseUrl;
				updateDetail.packageDesc = update.packageDesc;
				updateDetail.packageID = update.packageID;
				updateDetail.packageName = update.packageName;
				updateDetail.packageRebootType = update.packageRebootType;
				updateDetail.packageReleaseDate = update.packageReleaseDate;
				updateDetail.packageSeverity = update.packageSeverity;
				updateDetail.packageSize = update.packageSize;
				updateDetail.packageTips = update.packageTips;
				updateDetail.packageType = update.packageType;
				updateDetail.packageVendor = update.packageVendor;
				updateDetail.packageVersion = update.packageVersion;
				updateDetail.readmeUrl = update.readmeUrl;
				updateDetail.coreqPackageID = update.coreqPackageID;
				updateDetail.currentInstalledVersion = update.currentInstalledVersion;
				updateDetail.diskSpaceRequired = update.diskSpaceRequired;
				updateDetail.isInstalled = false;
				updateDetail.isSelected = (updateDetail.packageSeverity === UpdateInstallSeverity.Critical);
				updateDetail.installationStatus = UpdateActionResult.Unknown;
				updates.push(updateDetail);
			});
		}
		return updates;
	}

	private mapInstallationStatus(updates: AvailableUpdateDetail[], updateInstallationList: Array<any>, isInstallingAllUpdates: boolean) {
		updates.forEach((update: AvailableUpdateDetail) => {
			if (isInstallingAllUpdates || update.isSelected) {
				const pkg = updateInstallationList.find((uil) => {
					return update.packageID === uil.packageID;
				});
				update.installationStatus = pkg.actionResult;
				update.isInstalled = (update.installationStatus === UpdateActionResult.Success);
			}
		});
	}

	private mapScheduleInstallResponse(updateTaskList: Array<any>): AvailableUpdate {
		const updates: Array<AvailableUpdateDetail> = [];
		const availableUpdate = new AvailableUpdate();
		let installedCount = 0;
		updateTaskList.forEach((updateTask: any) => {
			const update = new AvailableUpdateDetail();
			update.packageID = updateTask.packageID;
			update.packageDesc = updateTask.packageDisplayName;
			update.packageRebootType = updateTask.packageRebootType;
			update.packageVersion = updateTask.packageVersion;
			update.packageSeverity = updateTask.packageType;

			if (updateTask.packageState === 'install-failed') {
				update.installationStatus = UpdateActionResult.InstallFailed;
			} else if (updateTask.packageState === 'download-failed') {
				update.installationStatus = UpdateActionResult.DownloadFailed;
			} else if (updateTask.packageState === 'installed') {
				update.installationStatus = UpdateActionResult.Success;
				installedCount++;
			}
			updates.push(update);
		});
		availableUpdate.status = (updateTaskList.length === installedCount) ? SystemUpdateStatusMessage.SUCCESS.code : SystemUpdateStatusMessage.FAILURE.code;
		availableUpdate.updateList = updates;
		return availableUpdate;
	}

	private getSelectedUpdates(updateList: Array<AvailableUpdateDetail>): Array<AvailableUpdateDetail> {
		if (updateList && updateList.length > 0) {
			const updates = updateList.filter((value) => {
				return value.isSelected;
			});
			return updates;
		}
		return undefined;
	}
}
