export enum ModernPreloadEnum {
	GetEntitledAppListRespond = '[ModernPreload] GetEntitledAppListRespond',
	GetIsEntitledRespond = '[ModernPreload] GetIsEntitledRespond',
	InstallEntitledAppProgress = '[ModernPreload] InstallEntitledAppProgress',
	InstallEntitledAppResult = '[ModernPreload] InstallEntitledAppResult',
	CommonException = '[ModernPreload] CommonException',
	InstallationCancelled = '[ModernPreload] InstallationCancelled',
	StatusInstalled = 'installed',
	StatusNotInstalled = 'not installed',
	StatusDownloaded = 'downloaded',
	StatusDownloading = 'downloading',
	StatusInstalling = 'installing',
}

export enum ModernPreloadStatusEnum {
	NOT_INSTALL = 1,
	INSTALLED = 2,
	DOWNLOADING = 3,
	DOWNLOAD_COMPLETE = 4,
	INSTALLING = 5,
	FAILED_INSTALL = -1,
}

export enum ModernPreloadAppCategoryEnum {
	OFFERED = 'Offered',
	ENTITLED = 'Entitled',
}
