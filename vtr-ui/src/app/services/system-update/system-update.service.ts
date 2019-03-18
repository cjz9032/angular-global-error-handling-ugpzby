import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { CommonService } from '../common/common.service';
import { UpdateProgress } from 'src/app/enums/update-progress.enum';
import { InstallUpdate } from 'src/app/data-models/system-update/install-update.model';
import { UpdateInstallationResult } from 'src/app/data-models/system-update/update-installation-result.model';
import { AvailableUpdate } from 'src/app/data-models/system-update/available-update.model';
import { AvailableUpdateDetail } from 'src/app/data-models/system-update/available-update-detail.model';
import { UpdateActionResult } from 'src/app/enums/update-action-result.enum';
import { UpdateHistory } from 'src/app/data-models/system-update/update-history.model';

@Injectable({
	providedIn: 'root'
})
export class SystemUpdateService {

	private systemUpdateBridge: any;
	public autoUpdateStatus: any;
	public isShellAvailable = false;
	public isCheckForUpdateComplete = true;
	public isUpdatesAvailable = false;
	public updateInfo: AvailableUpdate;
	public installationHistory: Array<UpdateHistory>;

	constructor(
		shellService: VantageShellService
		, private commonService: CommonService) {
		this.systemUpdateBridge = shellService.getSystemUpdate();
		if (this.systemUpdateBridge) {
			this.isShellAvailable = true;
		}
	}

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
			this.systemUpdateBridge.checkForUpdates((progressPercentage: number) => {
				console.log('checkForUpdates callback', progressPercentage);
				this.commonService.sendNotification(UpdateProgress.UpdateCheckInProgress, progressPercentage);
			}).then((response) => {
				console.log('checkForUpdates response', response);
				this.updateInfo = { status: response.status, updateList: this.mapAvailableUpdateResponse(response.updateList) };
				this.isCheckForUpdateComplete = true;
				this.isUpdatesAvailable = (response && response.updateList.length > 0);
				this.commonService.sendNotification(UpdateProgress.UpdateCheckCompleted, this.updateInfo);
				if (this.isUpdatesAvailable) {
					this.commonService.sendNotification(UpdateProgress.UpdatesAvailable, this.updateInfo);
				} else {
					this.commonService.sendNotification(UpdateProgress.UpdatesNotAvailable);
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

		// 1. reportProgress //true or false
		// 2. function callback
		if (this.systemUpdateBridge) {
			this.systemUpdateBridge.installUpdates(canReportProgress, (progress: any) => {
				console.log('getScheduleUpdateStatus callback', progress);
				// this.commonService.sendNotification(UpdateProgress.InstallingUpdate, progress);
			}).then((response: UpdateInstallationResult) => {
				console.log('getScheduleUpdateStatus response', response);
				this.commonService.sendNotification(UpdateProgress.UpdateScheduleComplete, response);
			});
		}
	}

	public installAllUpdates() {
		if (this.systemUpdateBridge && this.isUpdatesAvailable) {
			const updates = this.mapToInstallRequest(this.updateInfo.updateList);
			this.installUpdates(updates);
		}
	}

	public installSelectedUpdates() {
		if (this.systemUpdateBridge && this.isUpdatesAvailable) {
			const updatesToInstall = this.getSelectedUpdates(this.updateInfo.updateList);
			const updates = this.mapToInstallRequest(updatesToInstall);
			console.log('installSelectedUpdates', updatesToInstall, updates);
			this.installUpdates(updates);
		}
	}

	public installFailedUpdate(update: InstallUpdate) {
		if (this.systemUpdateBridge) {
			console.log('installFailedUpdate', update);
			const updates = new Array<InstallUpdate>();
			updates.push(update);
			this.installUpdates(updates);
		}
	}

	public restartWindows() {
		if (this.systemUpdateBridge) {
			this.systemUpdateBridge.restartWindows()
				.then((status: boolean) => {
					// todo: ui changes to show on windows is restarting
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

	private installUpdates(updates: Array<InstallUpdate>) {
		let isInvoked = false;
		this.systemUpdateBridge.installUpdates(updates, (progress: number) => {
			if (!isInvoked) {
				isInvoked = true;
				this.commonService.sendNotification(UpdateProgress.InstallationStarted);
			}
			console.log('installUpdates callback', progress);
			this.commonService.sendNotification(UpdateProgress.InstallingUpdate, progress);
		}).then((response: UpdateInstallationResult) => {
			console.log('installUpdates response', response);
			this.commonService.sendNotification(UpdateProgress.InstallationComplete, response);
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
		const packageToInstall: AvailableUpdateDetail[] = [];

		if (updateList && updateList.length > 0) {
			updateList.forEach((update) => {
				const pkg = new AvailableUpdateDetail();
				pkg.licenseUrl = update.licenseUrl;
				pkg.packageDesc = update.packageDesc;
				pkg.packageID = update.packageID;
				pkg.packageName = update.packageName;
				pkg.packageRebootType = update.packageRebootType;
				pkg.packageReleaseDate = update.packageReleaseDate;
				pkg.packageSeverity = update.packageSeverity;
				pkg.packageSize = update.packageSize;
				pkg.packageTips = update.packageTips;
				pkg.packageType = update.packageType;
				pkg.packageVendor = update.packageVendor;
				pkg.packageVersion = update.packageVersion;
				pkg.readmeUrl = update.readmeUrl;
				pkg.coreqPackageID = update.coreqPackageID;
				pkg.currentInstalledVersion = update.currentInstalledVersion;
				pkg.diskSpaceRequired = update.diskSpaceRequired;
				pkg.isInstalled = false;
				pkg.isSelected = true;
				pkg.installationStatus = UpdateActionResult.Unknown;
				packageToInstall.push(pkg);
			});
		}
		return packageToInstall;
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
