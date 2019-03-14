import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { CommonService } from '../common/common.service';
import { UpdateProgress } from 'src/app/enums/update-progress.enum';
import { InstallUpdate } from 'src/app/data-models/system-update/install-update.model';

@Injectable({
	providedIn: 'root'
})
export class SystemUpdateService {

	private systemUpdateBridge: any;
	public isShellAvailable = false;
	public isCheckForUpdateComplete = true;
	public isUpdatesAvailable = false;
	public updateInfo: any;

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
				this.updateInfo = response;
				this.isCheckForUpdateComplete = true;
				this.isUpdatesAvailable = (response && response.updateList.length > 0);
				this.commonService.sendNotification(UpdateProgress.UpdateCheckCompleted, response);
				if (this.isUpdatesAvailable) {
					this.commonService.sendNotification(UpdateProgress.UpdatesAvailable, response);
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
			const packages = this.mapUpdateListToInstallList(this.updateInfo.updateList);
			this.systemUpdateBridge.installUpdates(packages, (progress: number) => {
				console.log('installUpdates callback', progress);
				this.commonService.sendNotification(UpdateProgress.InstallingUpdate, progress);
			}).then((response) => {
				console.log('installUpdates response', response);
				this.commonService.sendNotification(UpdateProgress.InstallationComplete, response);
			});
		}
	}

	private mapUpdateListToInstallList(updateList: Array<any>): InstallUpdate[] {
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

}
