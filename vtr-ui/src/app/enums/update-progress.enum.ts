/**
 * this enum is for system updates keys. new keys can be added here. please give meaningful names to key.
 */
export enum UpdateProgress {
	UpdateCheckInProgress = '[SystemUpdate] UpdateCheckInProgress',
	UpdateCheckCompleted = '[SystemUpdate] UpdateCheckCompleted',
	UpdatesAvailable = '[SystemUpdate] UpdatesAvailable',
	UpdatesNotAvailable = '[SystemUpdate] UpdatesNotAvailable',
	InstallingUpdate = '[SystemUpdate] InstallingUpdate',
	InstallationComplete = '[SystemUpdate] InstallationComplete',
	InstallationStarted = '[SystemUpdate] InstallationStarted',
	AutoUpdateStatus = '[SystemUpdate] AutoUpdateStatus',
	FullHistory = '[SystemUpdate] FullHistory',
	ScheduleUpdateCheckComplete = '[SystemUpdate] ScheduleUpdateCheckComplete',
	ScheduleUpdateInstalling = '[SystemUpdate] ScheduleUpdateInstalling',
	ScheduleUpdateDownloading = '[SystemUpdate] ScheduleUpdateDownloading',
	ScheduleUpdateChecking = '[SystemUpdate] ScheduleUpdateChecking',
	ScheduleUpdateIdle = '[SystemUpdate] ScheduleUpdateIdle',
	WindowsRebootRequested = '[SystemUpdate] WindowsRebootRequested',
	WindowsRebooting = '[SystemUpdate] WindowsRebooting',
}
