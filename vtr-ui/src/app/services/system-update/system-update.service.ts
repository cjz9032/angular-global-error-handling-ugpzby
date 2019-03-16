import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { CommonService } from '../common/common.service';
import { UpdateProgress } from 'src/app/enums/update-progress.enum';
import { InstallUpdate } from 'src/app/data-models/system-update/install-update.model';
import { UpdateInstallationResult } from 'src/app/data-models/system-update/update-installation-result.model';
import { AvailableUpdate } from 'src/app/data-models/system-update/available-update.model';
import { AvailableUpdateDetail } from 'src/app/data-models/system-update/available-update-detail.model';
import { UpdateActionResult } from 'src/app/enums/update-action-result.enum';

@Injectable({
	providedIn: 'root'
})
export class SystemUpdateService {

	private systemUpdateBridge: any;
	public isShellAvailable = false;
	public isCheckForUpdateComplete = true;
	public isUpdatesAvailable = false;
	public updateInfo: AvailableUpdate;

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
			return this.systemUpdateBridge.getUpdateSchedule();
		}
		return undefined;
	}

	/**
	 * set option for Auto update settings section
	 * @param criticalUpdate boolean value, true = on, false = off
	 * @param recommendedUpdate  boolean value, true = on, false = off
	 */
	public setUpdateSchedule(criticalUpdate: boolean, recommendedUpdate: boolean) {
		// {
		// criticalAutoUpdates: "ON", // "ON"|"OFF"
		// recommendedAutoUpdates: "ON" // "ON"|"OFF"
		// }
	}

	public getUpdateHistory() {

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
			});
		}
		return undefined;
	}

	public cancelUpdateCheck() {
		if (this.systemUpdateBridge) {
			this.systemUpdateBridge.cancelSearch().then((status: boolean) => {
				// todo: ui changes to show on update cancel
			}).catch((error) => {
				console.log('cancelUpdateCheck', error);
			});
		}
	}

	public getStatus() {

		// 1. reportProgress //true or false

		// 2. function callback
	}

	public installUpdates() {
		if (this.systemUpdateBridge && this.isUpdatesAvailable) {
			const packages = this.mapToInstallRequest(this.updateInfo.updateList);
			this.systemUpdateBridge.installUpdates(packages, (progress: number) => {
				console.log('installUpdates callback', progress);
				this.commonService.sendNotification(UpdateProgress.InstallingUpdate, progress);
			}).then((response: UpdateInstallationResult) => {
				console.log('installUpdates response', response);
				this.commonService.sendNotification(UpdateProgress.InstallationComplete, response);
			});
		}
	}

	public installSelectedUpdates() {
		if (this.systemUpdateBridge && this.isUpdatesAvailable) {
			const updatesToInstall = this.getSelectedUpdates(this.updateInfo.updateList);
			const packages = this.mapToInstallRequest(updatesToInstall);
			console.log('installSelectedUpdates', updatesToInstall, packages);

			this.systemUpdateBridge.installUpdates(packages, (progress: number) => {
				console.log('installSelectedUpdates callback', progress);
				this.commonService.sendNotification(UpdateProgress.InstallingUpdate, progress);
			}).then((response: UpdateInstallationResult) => {
				console.log('installSelectedUpdates response', response);
				this.commonService.sendNotification(UpdateProgress.InstallationComplete, response);
			});
		}
	}

	public restartWindows() {

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
