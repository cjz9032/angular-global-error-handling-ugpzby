export enum SnapshotStatus {
	firstLoad,
	notStarted,
	individualSnapshotInProgress,
	fullSnapshotInProgress,
	snapshotCompleted,
	baselineInProgress,
	baselineCompleted,
}

export enum SnapshotComponentStatus {
	hasData,
	noData,
	inProgress,
	error,
}

// First letter in capital to match the responses from SnapshotAddin
export enum SnapshotHardwareComponents {
	DisplayDevices,
	HardDrives,
	Keyboards,
	Memory,
	Motherboard,
	MouseDevices,
	Network,
	CdRomDrives,
	Printers,
	Processors,
	SoundCards,
	VideoCards,
}

export enum SnapshotSoftwareComponents {
	Programs,
	OperatingSystems,
	StartupPrograms,
	WebBrowsers,
}
