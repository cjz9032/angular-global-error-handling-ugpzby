import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';

@Injectable({
	providedIn: 'root'
})
export class SystemUpdateService {

	private systemUpdate: any;
	public isShellAvailable = false;
	constructor(shellService: VantageShellService) {
		this.systemUpdate = shellService.getSystemUpdate();
		if (this.systemUpdate) {
			this.isShellAvailable = true;
		}
	}

	/**
	 * gets data about last scan, install & schedule scan date-time for Check for Update section
	 */
	public getMostRecentUpdateInfo() {
		if (this.systemUpdate) {
			return this.systemUpdate.getMostRecentUpdateInfo();
		}
		return undefined;
	}

	/**
	 * return data about Auto update settings section
	 */
	public getUpdateSchedule() {
		if (this.systemUpdate) {
			return this.systemUpdate.getUpdateSchedule();
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

	public checkForUpdates(percentCallback: Function) {
		// checkForUpdates requires callback
		if (this.systemUpdate) {
			return this.systemUpdate.checkForUpdates(percentCallback);
			// try {
			// 	this.systemUpdate.checkForUpdates((progressPercent: any) => {
			// 		console.log('checkForUpdates callback', progressPercent);
			// 		Promise.resolve(progressPercent);
			// 	}).then((response) => {
			// 		console.log('checkForUpdates response', response);
			// 	});
			// } catch (error) {
			// 	console.log('checkForUpdates error', error);
			// 	return Promise.reject(error);
			// }
		}
		return undefined;
	}

	public getStatus() {

		// 1. reportProgress //true or false

		// 2. function callback
	}

	public installUpdates() {

		// [{

		// packageID: "criticalpackage1",
		// action: "DownloadAndInstall",

		// //"DownloadOnly|InstallOnly|

		// //DownloadAndInstall"

		// "severity": "Recommended"

		// //"Critical|Recommended|Optional",

		// }, ...] // to-install updates array

		// 2. function callback
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
