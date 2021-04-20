export enum ColorCalibrationEnum {
	ActionInstallAppProgress = '[ColorCalibration] InstallAppProgress',
	ActionInstallAppResult = '[ColorCalibration] InstallAppResult',
	ActionGetAppStatusResult = '[ColorCalibration] GetAppStatusResult',
	ActionGetAppDetailsRespond = '[ColorCalibration] GetAppDetailsRespond',
	ActionInstallationCancelled = '[ColorCalibration] InstallationCancelled',
	AppGUID = '40D4BC31-114E-379C-6EDB-18C3901B9BE6',
}

export enum ColorCalibrationInstallState {
	InstallDone = 'InstallDone',
	InstallBefore = 'InstalledBefore',
	Downloading = 'Downloading',
	InstallerRunning = 'InstallerRunning',
	NotFinished = 'NotFinished',
	Unknown = 'Unknown'
};


