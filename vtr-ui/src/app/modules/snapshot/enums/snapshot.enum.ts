export enum SnapshotStatus {
	NotStarted = 'titleNotStarted',
	SnapshotInProgress = 'titleSnapshotInProgress',
	SnapshotCompleted = 'titleSnapshotCompleted',
	BaselineInProgress = 'titleBaselineInProgress',
	BaselineCompleted = 'titleBaselineCompleted'
}
export enum SnapshotModules {
	CdRomDrives,
	DisplayDevices,
	HardDrives,
	Keyboards,
	Memory,
	Motherboard,
	MouseDevices,
	Network,
	OperatingSystems,
	Printers,
	Processors,
	Programs,
	SoundCards,
	StartupPrograms,
	VideoCards,
	WebBrowsers
}

export enum SnapshotEnvironment {
	Software,
	Hardware
}
