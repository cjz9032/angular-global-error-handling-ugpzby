import { Injectable } from '@angular/core';
import { CommonService } from '../common/common.service';
import { UpdateProgress } from 'src/app/enums/update-progress.enum';
import { InstallUpdate } from 'src/app/data-models/system-update/install-update.model';
import { AvailableUpdate } from 'src/app/data-models/system-update/available-update.model';
import { AvailableUpdateDetail } from 'src/app/data-models/system-update/available-update-detail.model';
import { UpdateActionResult } from 'src/app/enums/update-action-result.enum';
import { UpdateHistory } from 'src/app/data-models/system-update/update-history.model';
import { ScheduleUpdateStatus } from 'src/app/data-models/system-update/schedule-update-status.model';
import { UpdateRebootType } from 'src/app/enums/update-reboot-type.enum';
import { SystemUpdateStatus } from 'src/app/data-models/system-update/system-update-status-message.model';
import { UpdateInstallSeverity } from 'src/app/enums/update-install-severity.enum';
import { WinRT } from '@lenovo/tan-client-bridge';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { MetricService } from '../metric/metrics.service';
import { LoggerService } from '../logger/logger.service';
import { UpdateInstallTitleId } from 'src/app/enums/update-install-id.enum';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LocalCacheService } from '../local-cache/local-cache.service';

@Injectable({
	providedIn: 'root',
})
// As LenovoSystemUpdatePlugin not support S-Mode, all System Update feature are not supported in S-Mode.
export class SystemUpdateService {
	constructor(
		shellService: VantageShellService,
		private commonService: CommonService,
		private loggerService: LoggerService,
		private metricService: MetricService,
		private localCacheService: LocalCacheService
	) {
		this.systemUpdateBridge = shellService.getSystemUpdate();
		if (this.systemUpdateBridge) {
			this.isShellAvailable = true;
		}
	}
	private systemUpdateBridge: any;
	public autoUpdateStatus: any;
	public isShellAvailable = false;
	public isCheckForUpdateComplete = true;
	public checkedOnce = false;
	public updateInfo: AvailableUpdate;
	public installationHistory: Array<UpdateHistory>;
	public ignoredRebootDelayUpdates: AvailableUpdateDetail[] = [];
	public installedUpdates: AvailableUpdateDetail[] = [];
	public ignoreFocusIds: UpdateInstallTitleId[] = [];

	public isUpdatesAvailable = false;
	public isUpdateDownloading = false;
	public isInstallingAllUpdates = true;
	public percentCompleted = 0;
	public installationPercent = 0;
	public downloadingPercent = 0;
	public isInstallationCompleted = false;
	public isInstallationSuccess = false;
	public isDownloadingCancel = false;
	public isImcErrorOrEmptyResponse = false;
	public isRebootRequiredDialogNeeded = false;
	public isCheckingCancel = false;
	public isToastMessageNeeded = false;
	public timeStartSearch;
	public retryTimes = 0;
	private capabilityList = [];
	private timeStartGetStatus: Date;
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
			return this.systemUpdateBridge.getUpdateSchedule().then((response) => {
				this.autoUpdateStatus = {
					criticalAutoUpdates: response.criticalAutoUpdates === 'ON' ? true : false,
					recommendedAutoUpdates: response.recommendedAutoUpdates === 'ON' ? true : false,
				};
				if (
					!this.autoUpdateStatus.criticalAutoUpdates &&
					this.autoUpdateStatus.recommendedAutoUpdates
				) {
					this.autoUpdateStatus.recommendedAutoUpdates = false;
					this.setUpdateSchedule(false, false);
				}
				this.commonService.sendNotification(
					UpdateProgress.AutoUpdateStatus,
					this.autoUpdateStatus
				);
			});
		}
		return undefined;
	}

	public getACAttachedStatus(): boolean {
		if (WinRT.getAcAttachedStatus) {
			return WinRT.getAcAttachedStatus();
		}
	}

	/**
	 * set option for Auto update settings section
	 * @param criticalUpdate boolean value, true = on, false = off
	 * @param recommendedUpdate  boolean value, true = on, false = off
	 */
	public setUpdateSchedule(criticalUpdate: boolean, recommendedUpdate: boolean) {
		if (this.systemUpdateBridge) {
			const request = {
				criticalAutoUpdates: criticalUpdate ? 'ON' : 'OFF',
				recommendedAutoUpdates: recommendedUpdate ? 'ON' : 'OFF',
			};
			this.systemUpdateBridge
				.setUpdateSchedule(request)
				.then((response) => {
					const taskParam =
						'critical-update:' +
						request.criticalAutoUpdates +
						',recommended-update:' +
						request.recommendedAutoUpdates;
					this.metricService.sendSetUpdateSchedule(taskParam, response);
					this.autoUpdateStatus = {
						criticalAutoUpdates: response.criticalAutoUpdates === 'ON' ? true : false,
						recommendedAutoUpdates:
							response.recommendedAutoUpdates === 'ON' ? true : false,
					};
					this.commonService.sendNotification(
						UpdateProgress.AutoUpdateStatus,
						this.autoUpdateStatus
					);
				})
				.catch((error) => {
					// get current status
					this.loggerService.error(
						'SystemUpdateService.setUpdateSchedule failed for ',
						error.message
					);
					this.getUpdateSchedule();
				});
		}
	}

	public getCapability(): Promise<any[]> {
		if (this.capabilityList.length > 0) {
			return Promise.resolve(this.capabilityList);
		}
		if (this.systemUpdateBridge) {
			return new Promise((resolve) => {
				this.systemUpdateBridge.getCapability().then((response: Array<UpdateHistory>) => {
					if (response && response.length > 0) {
						this.capabilityList = response;
					} else {
						this.loggerService.error(`SystemUpdateService.getCapability invalid response: ${response}.`);
					}
					resolve(this.capabilityList);
				}, (error) => {
					this.loggerService.error(`SystemUpdateService.getCapability error: ${error}.`);
					resolve(this.capabilityList);
				});
			});
		} else {
			this.loggerService.info(`SystemUpdateService.getCapability systemUpdateBridge not exist.`);
			return Promise.resolve(this.capabilityList);
		}
	}

	public getUpdateHistory() {
		if (this.systemUpdateBridge) {
			this.systemUpdateBridge.getUpdateHistory().then((response: Array<UpdateHistory>) => {
				this.installationHistory = response;
				this.commonService.sendNotification(
					UpdateProgress.FullHistory,
					this.installationHistory
				);
			});
		}
	}

	public deleteHistoryItems(packageIds) {
		if (this.systemUpdateBridge) {
			this.systemUpdateBridge.deleteUpdateHistoryItems(packageIds).then((response: Array<UpdateHistory>) => {
				this.installationHistory = response;
				this.commonService.sendNotification(
					UpdateProgress.FullHistory,
					this.installationHistory
				);
			});
		}
	}

	public checkForUpdates() {
		// checkForUpdates requires callback
		this.timeStartSearch = new Date();
		this.checkedOnce = true;
		if (this.systemUpdateBridge) {
			this.isCheckForUpdateComplete = false;
			this.isInstallationCompleted = false;
			this.systemUpdateBridge
				.checkForUpdates((progressPercentage: number) => {
					this.percentCompleted = progressPercentage;
					this.commonService.sendNotification(
						UpdateProgress.UpdateCheckInProgress,
						progressPercentage
					);
				})
				.then(async (response) => {
					this.isCheckForUpdateComplete = true;
					const status = parseInt(response.status, 10);
					this.isUpdatesAvailable = response.updateList && response.updateList.length > 0;

					if (status === SystemUpdateStatus.SUCCESS) {
						// success
						this.percentCompleted = 0;
						this.isUpdatesAvailable = true;
						this.updateInfo = {
							status,
							updateList: this.mapAvailableUpdateResponse(response.updateList),
						};
						this.commonService.sendNotification(
							UpdateProgress.UpdatesAvailable,
							this.updateInfo
						);
					} else {
						const interval = setInterval(() => {
							if (this.percentCompleted < 100 && !this.isCheckingCancel) {
								this.percentCompleted += 10;
								if (this.percentCompleted > 100) {
									this.percentCompleted = 100;
								}
								this.commonService.sendNotification(
									UpdateProgress.UpdateCheckInProgress,
									this.percentCompleted
								);
							} else {
								this.percentCompleted = 0;
								const payload = { ...response, status };
								this.isInstallationSuccess = this.getInstallationSuccess(payload);
								this.commonService.sendNotification(
									UpdateProgress.UpdateCheckCompleted,
									payload
								);
								this.retryTimes = 0;
								this.getScheduleUpdateStatus(false);
								clearInterval(interval);
							}
						}, 80);
					}
				})
				.catch((error) => {
					this.percentCompleted = 0;
					this.metricService.sendSystemUpdateMetric(
						0,
						'',
						error.message,
						this.timeStartSearch
					);
					if (
						error &&
						((error.description && error.description.includes('errorcode: 606')) ||
							(error.errorcode && error.errorcode === 606))
					) {
						this.retryTimes = 0;
						this.getScheduleUpdateStatus(true);
						this.isImcErrorOrEmptyResponse = true;
					} else {
						const payload = { status: 1 };
						this.commonService.sendNotification(
							UpdateProgress.UpdateCheckCompleted,
							payload
						);
					}
				});
		}
		return undefined;
	}

	public cancelUpdateCheck() {
		if (this.systemUpdateBridge) {
			this.systemUpdateBridge.cancelSearch().then((status: boolean) => {
				// todo: ui changes to show on update cancel
				this.isCheckingCancel = true;
				this.commonService.sendNotification(UpdateProgress.UpdateCheckCancelled, status);
			});
		}
	}

	public getScheduleUpdateStatus(canReportProgress: boolean) {
		if (this.systemUpdateBridge) {
			this.timeStartGetStatus = new Date();
			const timeOut = setTimeout(() => {
				this.loggerService.info('get su plugin status time out with in 10 seconds');
				this.metricService.sendSystemUpdateStatusMetric(
					'Time out',
					'FeatureStatus - Not enabled within 10 seconds'
				);
			}, 10000);
			this.systemUpdateBridge
				.getStatus(canReportProgress, (response: any) => {
					clearTimeout(timeOut);
					this.processScheduleUpdate(response.payload, true, canReportProgress);
				})
				.then((response: ScheduleUpdateStatus) => {
					this.isImcErrorOrEmptyResponse = false;
					clearTimeout(timeOut);
					this.processScheduleUpdate(response, false, canReportProgress);
				})
				.catch((error) => {
					clearTimeout(timeOut);
					if (error && error.errorcode === 606) {
						if (this.retryTimes < 3) {
							setTimeout(() => {
								this.getScheduleUpdateStatus(canReportProgress);
							}, 200);
							this.retryTimes++;
						} else {
							this.loggerService.info(
								'Get su plugin status exception with errorcode 606'
							);
							this.metricService.sendSystemUpdateStatusMetric(
								'Get system update plugin status exception with 606',
								'FeatureStatus - Not enabled within 10 seconds'
							);
						}
					} else {
						this.loggerService.info('get su plugin status exception.', error);
						this.metricService.sendSystemUpdateStatusMetric(
							'Get system update plugin status exception',
							'FeatureStatus - Not enabled within 10 seconds'
						);
					}
				});
		}
	}

	private processScheduleUpdate(
		response: any,
		isInProgress: boolean,
		canReportProgress: boolean
	) {
		const status = response.status.toLowerCase();
		if (status === 'installing' || status === 'checking' || status === 'downloading') {
			if (status === 'installing') {
				this.isUpdateDownloading = true;
				this.downloadingPercent = 100;
				if (response && response.installProgress) {
					this.installationPercent = response.installProgress.progressinPercentage;
				}
				if (response.updateTaskList === null) {
					this.commonService.sendNotification(UpdateProgress.ScheduleUpdateInstalling);
				} else {
					this.commonService.sendNotification(
						UpdateProgress.ScheduleUpdateInstalling,
						response
					);
				}
			} else if (status === 'checking') {
				if (response && response.searchProgress) {
					this.percentCompleted = response.searchProgress.progressinPercentage;
				}
				if (response.updateTaskList === null) {
					this.commonService.sendNotification(UpdateProgress.ScheduleUpdateChecking);
				} else {
					this.commonService.sendNotification(
						UpdateProgress.ScheduleUpdateChecking,
						response
					);
				}
			} else if (status === 'downloading') {
				this.isUpdateDownloading = true;
				this.installationPercent = 0;
				if (response && response.downloadProgress) {
					if (this.downloadingPercent <= 100) {
						this.downloadingPercent = response.downloadProgress.progressinPercentage;
					}
				}
				if (response.updateTaskList === null) {
					this.commonService.sendNotification(UpdateProgress.ScheduleUpdateDownloading);
				} else {
					this.commonService.sendNotification(
						UpdateProgress.ScheduleUpdateDownloading,
						response
					);
				}
			}
			if (!isInProgress) {
				this.retryTimes = 0;
				this.getScheduleUpdateStatus(true);
			}
		} else if (status === 'idle' && isInProgress) {
			if (response && response.installProgress) {
				this.isUpdateDownloading = true;
				this.downloadingPercent = 100;
				this.installationPercent = response.installProgress.progressinPercentage;

				if (response.updateTaskList === null) {
					this.commonService.sendNotification(UpdateProgress.ScheduleUpdateInstalling);
				} else {
					this.commonService.sendNotification(
						UpdateProgress.ScheduleUpdateInstalling,
						response
					);
				}
			} else if (response && response.checkForUpdatesResult) {
				this.percentCompleted = 100;
				if (response.updateTaskList === null) {
					this.commonService.sendNotification(UpdateProgress.ScheduleUpdateChecking);
				} else {
					this.commonService.sendNotification(
						UpdateProgress.ScheduleUpdateChecking,
						response
					);
				}
			}
		} else if (status === 'idle' && !isInProgress) {
			this.isUpdateDownloading = false;
			if (response.updateTaskList && response.updateTaskList.length > 0) {
				if (!this.isDownloadingCancel) {
					this.isInstallationCompleted = true;
					this.updateInfo = this.mapScheduleInstallResponse(response.updateTaskList);
					this.isInstallationSuccess =
						this.updateInfo.status === SystemUpdateStatus.SUCCESS;
					this.isRebootRequiredDialogNeeded = this.isRebootRequested();
					this.isToastMessageNeeded = true;
					this.commonService.sendNotification(
						UpdateProgress.ScheduleUpdateInstallationComplete,
						this.updateInfo
					);
				}
			} else if (response.checkForUpdatesResult) {
				this.isCheckForUpdateComplete = true;
				const checkStatus = parseInt(response.checkForUpdatesResult.status, 10);
				this.isUpdatesAvailable =
					response.checkForUpdatesResult.updateList &&
					response.checkForUpdatesResult.updateList.length > 0;

				if (checkStatus === SystemUpdateStatus.SUCCESS) {
					this.percentCompleted = 0;
					this.isUpdatesAvailable = true;
					this.updateInfo = {
						status: checkStatus,
						updateList: this.mapAvailableUpdateResponse(
							response.checkForUpdatesResult.updateList
						),
					};
					this.commonService.sendNotification(
						UpdateProgress.ScheduleUpdatesAvailable,
						this.updateInfo
					);
				} else {
					this.percentCompleted = 0;
					this.commonService.sendNotification(
						UpdateProgress.ScheduleUpdateCheckComplete,
						checkStatus
					);
				}
			} else {
				this.commonService.sendNotification(UpdateProgress.ScheduleUpdateIdle, response);
			}
			const costSeconds = (
				(new Date().getTime() - this.timeStartGetStatus.getTime()) /
				1000
			).toFixed(2);
			const metricStatus = 'FeatureStatus - Enabled with ' + costSeconds + ' seconds';
			this.metricService.sendSystemUpdateStatusMetric(
				'Enable check for update ',
				metricStatus
			);
		} else if (
			!status &&
			Number(response.statusCode) === SystemUpdateStatus.CONNECT_EXCEPTION &&
			this.commonService.isOnline
		) {
			this.loggerService.info('Get su plugin status response connect exception, try again.');
			if (this.retryTimes < 3) {
				setTimeout(() => {
					this.getScheduleUpdateStatus(canReportProgress);
				}, 200);
			} else {
				this.metricService.sendSystemUpdateStatusMetric(
					'System update plugin connect exception ',
					'FeatureStatus - Not enabled within 10 seconds'
				);
			}
		} else {
			this.loggerService.info(
				'get su plugin status return unexpected response, status is null.',
				response
			);
			this.metricService.sendSystemUpdateStatusMetric(
				'System update plugin get unexpected response',
				'FeatureStatus - Not enabled within 10 seconds'
			);
		}
	}

	public installUpdatesList(
		removeDelayedUpdates: boolean,
		updateList: Array<AvailableUpdateDetail>,
		isInstallAll: boolean
	) {
		if (this.systemUpdateBridge && this.isUpdatesAvailable) {
			const updates = this.mapToInstallRequest(updateList, removeDelayedUpdates);
			this.installUpdates(updates, isInstallAll);
		}
	}

	public installFailedUpdate(update: InstallUpdate) {
		if (this.systemUpdateBridge) {
			const updates = new Array<InstallUpdate>();
			updates.push(update);
			this.installUpdates(updates, false);
		}
	}

	// Please Notice that this function doesn't support S-Mode
	public restartWindows() {
		if (this.systemUpdateBridge) {
			this.commonService.sendNotification(UpdateProgress.WindowsRebootRequested);
			this.systemUpdateBridge.restartWindows().then((status: boolean) => {
				if (status) {
					this.commonService.sendNotification(UpdateProgress.WindowsRebooting);
				}
			});
		}
	}

	public getIgnoredUpdates() {
		if (this.systemUpdateBridge) {
			this.systemUpdateBridge.getIgnoredUpdates().then((ignoredUpdates) => {
				this.updateIgnoredStatus(ignoredUpdates);
			});
		}
	}

	public ignoreUpdate(packageName: string) {
		if (this.systemUpdateBridge) {
			this.systemUpdateBridge.ignoreUpdate(packageName).then((ignoredUpdates) => {
				this.updateIgnoredStatus(ignoredUpdates);
			});
		}
	}

	public unIgnoreUpdate(packageName: string) {
		if (this.systemUpdateBridge) {
			this.systemUpdateBridge.unignoreUpdate(packageName).then((ignoredUpdates) => {
				this.updateIgnoredStatus(ignoredUpdates);
			});
		}
	}

	private updateIgnoredStatus(ignoredUpdates: any) {
		this.updateInfo.updateList.forEach((update) => {
			const result = ignoredUpdates.find((x) => x.packageName === update.packageName);
			if (result && update.packageSeverity !== UpdateInstallSeverity.Critical) {
				update.isIgnored = true;
			} else {
				update.isIgnored = false;
			}
		});
		this.commonService.sendNotification(
			UpdateProgress.IgnoredUpdates,
			this.updateInfo.updateList
		);
	}

	public toggleUpdateSelection(packageName: string, isSelected: boolean) {
		if (this.updateInfo.updateList && this.updateInfo.updateList.length > 0) {
			const update = this.updateInfo.updateList.find((value) => {
				return value.packageName === packageName;
			});
			if (update.packageName === packageName) {
				update.isSelected = isSelected;
			}
			if (update.dependedPackageID) {
				const dependedPackages = update.dependedPackageID.split(',');
				this.selectDependedUpdate(
					this.updateInfo.updateList,
					dependedPackages,
					isSelected,
					update.packageID
				);
			}
		}
	}

	public selectDependedUpdateForInstallAll(updateList: any) {
		if (updateList && updateList.length > 0) {
			updateList.forEach((update) => {
				if (update.coreqPackageID && !update.isIgnored) {
					const coreqPackages = update.coreqPackageID.split(',');
					this.selectDependedUpdate(updateList, coreqPackages, true, update.packageID);
				}
			});
		}
	}

	private selectDependedUpdate(
		updateList: AvailableUpdateDetail[],
		coreqPackages: string[],
		isSelected: boolean,
		dependedByPackage: string
	) {
		coreqPackages.forEach((coreqPackage) => {
			const coreqUpdate = updateList.find((value) => {
				return value.packageID === coreqPackage;
			});
			if (coreqUpdate) {
				if (!coreqUpdate.dependedByPackages.includes(dependedByPackage)) {
					coreqUpdate.dependedByPackages =
						coreqUpdate.dependedByPackages + ',' + dependedByPackage;
				}
				coreqUpdate.isSelected = isSelected;
				if (isSelected) {
					coreqUpdate.isDependency = true;
				} else {
					const dependedPacks = coreqUpdate.dependedByPackages.split(',');
					coreqUpdate.isDependency = false;
					dependedPacks.forEach((packID) => {
						const dependPack = updateList.find((value) => {
							return value.packageID === packID;
						});
						if (dependPack && dependPack.isSelected) {
							coreqUpdate.isSelected = true;
							coreqUpdate.isDependency = true;
						}
					});
				}
				if (coreqUpdate.dependedPackageID) {
					const packages = coreqUpdate.dependedPackageID.split(',');
					this.selectDependedUpdate(
						updateList,
						packages,
						isSelected,
						coreqUpdate.packageID
					);
				}
			}
		});
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

	public isRebootRequested(): boolean {
		if (this.installedUpdates) {
			const forcedRebootPackages = this.installedUpdates.filter((pkg) => {
				return pkg.packageRebootType.toLowerCase() === 'rebootforced' && pkg.isInstalled;
			});
			// if forced reboot packages are there then don't show reboot requested dialog/modal
			if (forcedRebootPackages.length > 0) {
				return false;
			}

			const forcedPowerOffPackages = this.installedUpdates.filter((pkg) => {
				return pkg.packageRebootType.toLowerCase() === 'poweroffforced' && pkg.isInstalled;
			});
			// if forced power off packages are there then don't show reboot requested dialog/modal
			if (forcedPowerOffPackages.length > 0) {
				return false;
			}

			const delayedPackages = this.installedUpdates.filter((pkg) => {
				return pkg.packageRebootType.toLowerCase() === 'rebootdelayed' && pkg.isInstalled;
			});
			// if reboot delayed packages are there then don't show reboot requested dialog/modal
			if (delayedPackages.length > 0) {
				return false;
			}

			for (const update of this.installedUpdates) {
				if (
					update.packageRebootType.toLowerCase() === 'rebootrequested' &&
					update.isInstalled
				) {
					return true;
				}
			}
		}
		return false;
	}

	// returns reboot type and array of update name which requires pop up to show before installation
	public getRebootType(
		updateList: Array<AvailableUpdateDetail>
	): { rebootType: UpdateRebootType; packages: Array<string> } {
		let rebootType = UpdateRebootType.Unknown;
		const packages = new Array<string>();

		const rebootDelayedUpdates = this.getUpdateByRebootType(
			updateList,
			UpdateRebootType.RebootDelayed
		);
		const rebootForcedUpdates = this.getUpdateByRebootType(
			updateList,
			UpdateRebootType.RebootForced
		);
		const powerOffForcedUpdates = this.getUpdateByRebootType(
			updateList,
			UpdateRebootType.PowerOffForced
		);

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

	private getUpdateByRebootType(
		updateList: Array<AvailableUpdateDetail>,
		rebootType: UpdateRebootType
	): Array<AvailableUpdateDetail> {
		const updates = updateList.filter((value: AvailableUpdateDetail) => {
			return value.packageRebootType.toLowerCase() === rebootType.toLocaleLowerCase();
		});
		return updates;
	}

	private installUpdates(updates: Array<InstallUpdate>, isInstallingAllUpdates: boolean) {
		this.isImcErrorOrEmptyResponse = false;
		if (updates.length === 0) {
			this.installedUpdates = [];
			const payload = new AvailableUpdate();
			payload.status = 20;
			payload.updateList = this.ignoredRebootDelayUpdates;
			if (!this.isDownloadingCancel) {
				this.isInstallationCompleted = true;
				this.commonService.sendNotification(UpdateProgress.InstallationComplete, payload);
			} else {
				this.isInstallationCompleted = false;
			}
			return;
		}
		// VAN-2798 immediately show progress bar
		if (!this.isDownloadingCancel) {
			this.isUpdateDownloading = true;
			this.installationPercent = 0;
			this.downloadingPercent = 0;
		}
		this.commonService.sendNotification(UpdateProgress.InstallingUpdate, {
			downloadPercentage: 0,
			installPercentage: 0,
		});

		this.systemUpdateBridge
			.installUpdates(updates, (progress: any) => {
				this.isUpdateDownloading = true;
				this.installationPercent = progress.installPercentage;
				if (this.downloadingPercent < 100) {
					this.downloadingPercent = progress.downloadPercentage;
				}
				this.commonService.sendNotification(UpdateProgress.InstallingUpdate, progress);
			})
			.then((response: any) => {
				if (response && response.updateResultList && response.updateResultList.length > 0) {
					this.isUpdateDownloading = false;
					if (!this.isDownloadingCancel) {
						this.isInstallationCompleted = true;
						this.downloadingPercent = 100;
						this.installationPercent = 100;
						this.mapInstallationStatus(
							this.updateInfo.updateList,
							response.updateResultList,
							isInstallingAllUpdates
						);
						const payload = new AvailableUpdate();
						payload.status = parseInt(response.status, 10);
						payload.updateList = this.installedUpdates;
						if (this.ignoredRebootDelayUpdates) {
							this.ignoredRebootDelayUpdates.forEach((rebootDelayUpdate) =>
								payload.updateList.push(rebootDelayUpdate)
							);
						}
						this.isInstallationSuccess = this.getInstallationSuccess(payload);
						this.isRebootRequiredDialogNeeded = this.isRebootRequested();
						this.isToastMessageNeeded = true;
						this.commonService.sendNotification(
							UpdateProgress.InstallationComplete,
							payload
						);
					} else {
						this.isInstallationCompleted = false;
						return;
					}
				} else if (!this.isDownloadingCancel) {
					// cancel download will also cause empty UpdateTaskList, no need to get status
					// VAN-3314, sometimes, the install complete response will contains empty UpdateTaskList
					this.retryTimes = 0;
					setTimeout(() => {
						this.getScheduleUpdateStatus(true);
					}, 2500);
					this.isImcErrorOrEmptyResponse = true;
				}
			})
			.catch((error) => {
				if (
					error &&
					((error.description && error.description.includes('errorcode: 606')) ||
						(error.errorcode && error.errorcode === 606))
				) {
					this.retryTimes = 0;
					setTimeout(() => {
						this.getScheduleUpdateStatus(true);
					}, 200);
					this.isImcErrorOrEmptyResponse = true;
				}
			});
	}

	private mapToInstallRequest(
		updateList: Array<AvailableUpdateDetail>,
		removeDelayedUpdates: boolean
	): InstallUpdate[] {
		const packageToInstall: InstallUpdate[] = [];
		this.ignoredRebootDelayUpdates = [];
		if (updateList && updateList.length > 0) {
			updateList.forEach((update) => {
				let isPackageToInstall = true;
				const pkg = new InstallUpdate();
				pkg.packageID = update.packageID;
				pkg.severity = update.packageSeverity;
				if (removeDelayedUpdates && update.packageRebootType === 'RebootDelayed') {
					update.isACAttached = false;
					update.installationStatus = UpdateActionResult.InstallFailed;
					isPackageToInstall = false;
				} else if (
					removeDelayedUpdates &&
					update.dependedPackageID !== '' &&
					this.isUpdateDependingOnRebootDelayedPackage(
						updateList,
						update.dependedPackageID
					)
				) {
					update.installationStatus = UpdateActionResult.InstallFailed;
					isPackageToInstall = false;
				}
				if (isPackageToInstall) {
					packageToInstall.push(pkg);
				} else {
					this.ignoredRebootDelayUpdates.push(update);
				}
			});
		}
		return packageToInstall;
	}

	private isUpdateDependingOnRebootDelayedPackage(
		updateList: Array<AvailableUpdateDetail>,
		coreqPackage: string
	) {
		let result = false;
		for (const update of updateList) {
			if (update.packageRebootType === 'RebootDelayed' && update.packageID === coreqPackage) {
				result = true;
			} else if (
				update.packageRebootType !== 'RebootDelayed' &&
				update.packageID === coreqPackage &&
				update.dependedPackageID !== ''
			) {
				result = this.isUpdateDependingOnRebootDelayedPackage(
					updateList,
					update.dependedPackageID
				);
			}
			if (result) {
				break;
			}
		}
		return result;
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
				updateDetail.downloadSize = this.commonService.formatBytes(
					parseInt(update.packageSize, 10)
				);
				updateDetail.packageTips = update.packageTips;
				updateDetail.packageType = update.packageType;
				updateDetail.packageVendor = update.packageVendor;
				updateDetail.packageVersion = update.packageVersion;
				updateDetail.readmeUrl = update.readmeUrl;
				updateDetail.dependedPackageID = update.coreqPackageID;
				updateDetail.currentInstalledVersion = update.currentInstalledVersion;
				updateDetail.diskSpaceRequired = update.diskSpaceRequired;
				updateDetail.isInstalled = false;
				updateDetail.isDependency = false;
				updateDetail.isSelected =
					updateDetail.packageSeverity === UpdateInstallSeverity.Critical;
				updateDetail.installationStatus = UpdateActionResult.Unknown;
				updates.push(updateDetail);
			});
		}

		if (updates && updates.length > 0) {
			updates.forEach((update) => {
				if (update.isSelected && update.dependedPackageID !== '') {
					const coreqPackages = update.dependedPackageID.split(',');
					this.selectDependedUpdate(updates, coreqPackages, true, update.packageID);
				}
			});
		}
		return updates;
	}

	private mapInstallationStatus(
		updates: AvailableUpdateDetail[],
		updateInstallationList: Array<any>,
		isInstallingAllUpdates: boolean
	) {
		this.installedUpdates = [];
		updates.forEach((update: AvailableUpdateDetail) => {
			if (isInstallingAllUpdates || update.isSelected) {
				const pkg = updateInstallationList.find((uil) => {
					return update.packageID === uil.packageID;
				});
				if (pkg) {
					update.installationStatus = pkg.actionResult;
					update.isInstalled = update.installationStatus === UpdateActionResult.Success;
					this.installedUpdates.push(update);
				}
			}
		});
	}

	private mapScheduleInstallResponse(updateTaskList: Array<any>): AvailableUpdate {
		this.installedUpdates = [];
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
			update.packageVendor = updateTask.packageVendor;
			update.diskSpaceRequired = updateTask.diskSpaceRequired;

			if (updateTask.packageState === 'install-failed') {
				update.installationStatus = UpdateActionResult.InstallFailed;
			} else if (updateTask.packageState === 'download-failed') {
				update.installationStatus = UpdateActionResult.DownloadFailed;
			} else if (updateTask.packageState === 'installed') {
				update.installationStatus = UpdateActionResult.Success;
				installedCount++;
			}
			update.isInstalled = update.installationStatus === UpdateActionResult.Success;
			updates.push(update);
			this.installedUpdates.push(update);
		});
		availableUpdate.status =
			updateTaskList.length === installedCount
				? SystemUpdateStatus.SUCCESS
				: SystemUpdateStatus.FAILURE;
		availableUpdate.updateList = updates;
		return availableUpdate;
	}

	public getSelectedUpdates(
		updateList: Array<AvailableUpdateDetail>
	): Array<AvailableUpdateDetail> {
		if (updateList && updateList.length > 0) {
			const updates = updateList.filter((value) => {
				return value.isSelected;
			});
			return updates;
		}
		return undefined;
	}

	public getUnIgnoredUpdatesForInstallAll(
		updateList: Array<AvailableUpdateDetail>
	): Array<AvailableUpdateDetail> {
		if (updateList && updateList.length > 0) {
			const updates = updateList.filter((value) => {
				if (!value.isIgnored) {
					return true;
				} else if (value.isDependency) {
					return this.isUpdateDependedByUnIgnoredPackage(
						updateList,
						value.dependedByPackages
					);
				}
			});
			return updates;
		}
		return undefined;
	}

	private isUpdateDependedByUnIgnoredPackage(
		updateList: Array<AvailableUpdateDetail>,
		dependedByPackages: string
	) {
		let result = false;
		const dependedPacks = dependedByPackages.split(',');
		for (const pack of dependedPacks) {
			if (pack !== '') {
				for (const update of updateList) {
					if (!update.isIgnored && update.packageID === pack) {
						result = true;
					} else if (
						update.isIgnored &&
						update.packageID === pack &&
						update.dependedByPackages !== ''
					) {
						result = this.isUpdateDependedByUnIgnoredPackage(
							updateList,
							update.dependedByPackages
						);
					}
					if (result) {
						break;
					}
				}
			}
			if (result) {
				break;
			}
		}
		return result;
	}

	public dateDiffInDays(date: string) {
		const lastUpdateDate = new Date(date);
		const today = new Date();
		const diffTime = Math.abs(today.getTime() - lastUpdateDate.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	}

	public cancelUpdateDownload() {
		if (this.systemUpdateBridge) {
			this.systemUpdateBridge.cancelDownload().then((status: boolean) => {
				if (status === true) {
					this.isUpdateDownloading = false;
					this.percentCompleted = 0;
					this.isUpdatesAvailable = true;
					this.installationPercent = 0;
					this.downloadingPercent = 0;
					this.isInstallationCompleted = false;
					this.isDownloadingCancel = true;
					this.isInstallingAllUpdates = true;
					this.commonService.sendNotification(
						UpdateProgress.UpdateDownloadCancelled,
						status
					);
				}
			});
		}
	}

	// check for installed updates, if all installed correctly return true else return false
	private getInstallationSuccess(payload: any): boolean {
		let isSuccess = false;
		if (payload.status !== SystemUpdateStatus.SUCCESS) {
			isSuccess = false;
		} else {
			for (const update of payload.updateList) {
				if (
					update.installationStatus === UpdateActionResult.Success ||
					update.installationStatus === UpdateActionResult.Unknown
				) {
					isSuccess = true;
				} else {
					isSuccess = false;
					break;
				}
			}
		}
		return isSuccess;
	}

	public queueToastMessage(messageID: string, fileLocation: string, resources: string): boolean {
		if (this.systemUpdateBridge) {
			return this.systemUpdateBridge.queueToastMessage(messageID, fileLocation, resources);
		}
		return false;
	}

	public async getLastScanDate(): Promise<any> {
		let lastScanTime;
		if (this.isShellAvailable) {
			const updateInfo: any = await this.getMostRecentUpdateInfo();
			if (updateInfo && updateInfo.lastScanTime && updateInfo.lastScanTime.length > 0) {
				this.localCacheService.setLocalCacheValue(
					LocalStorageKey.SystemUpdateLastScanTime,
					updateInfo.lastScanTime
				);
				lastScanTime = updateInfo.lastScanTime;
			} else {
				lastScanTime = this.localCacheService.getLocalCacheValue(
					LocalStorageKey.SystemUpdateLastScanTime
				);
			}
		}
		return lastScanTime;
	}
}
