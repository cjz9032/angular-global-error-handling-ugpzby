export enum SnapshotStatus {
	firstLoad = 'titleNotStarted',
	notStarted = 'titleNotStarted',
	snapshotInProgress = 'titleSnapshotInProgress',
	snapshotCompleted = 'titleSnapshotCompleted',
	baselineInProgress = 'titleBaselineInProgress',
	baselineCompleted = 'titleBaselineCompleted',
}

export enum SnapshotComponentStatus {
	hasData,
	inProgress,
	error,
}

// First letter in capital to match the responses from SnapshotAddin
export enum SnapshotHardwareComponents {
	CdRomDrives,
	DisplayDevices,
	HardDrives,
	Keyboards,
	Memory,
	Motherboard,
	MouseDevices,
	Network,
	Printers,
	Processors,
	SoundCards,
	VideoCards,
}

export enum SnapshotSoftwareComponents {
	OperatingSystems,
	Programs,
	StartupPrograms,
	WebBrowsers,
}

export enum SnapshotComponentTypes {
	software,
	hardware,
}

export namespace SnapshotSoftwareComponents {
	export function values() {
		return Object.keys(SnapshotSoftwareComponents).filter(
			(type) => isNaN(<any>type) && type !== 'values'
		);
	}
}

export namespace SnapshotHardwareComponents {
	export function values() {
		return Object.keys(SnapshotHardwareComponents).filter(
			(type) => isNaN(<any>type) && type !== 'values'
		);
	}
}
