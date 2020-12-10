export interface SnapshotInfo {
	HardDrives?: SnapshotModule;
	Memory?: SnapshotModule;
	Motherboard?: SnapshotModule;
	Processors?: SnapshotModule;
	Network?: SnapshotModule;
	Programs?: SnapshotModule;
	VideoCards?: SnapshotModule;
	StartupPrograms?: SnapshotModule;
	SoundCards?: SnapshotModule;
	DisplayDevices?: SnapshotModule;
	Keyboards?: SnapshotModule;
	Printers?: SnapshotModule;
	MouseDevices?: SnapshotModule;
	WebBrowsers?: SnapshotModule;
	CdRomDrives?: SnapshotModule;
	OperatingSystems?: SnapshotModule;
	ReturnCode?: number;
}

export interface SnapshotModule {
	BaselineDate?: string;
	LastSnapshotDate?: string;
	Items?: Array<SnapshotDeviceInfo>;
	IsDifferent?: string | boolean;
}

export interface SnapshotDeviceInfo {
	DeviceId?: string;
	DeviceTypeName?: string;
	Properties?: Array<SnapshotPropertyInfo>;
	SubDevices?: Array<SnapshotDeviceInfo>;
	IsDifferent?: string | boolean;
}

export interface SnapshotPropertyInfo {
	PropertyName?: string;
	BaseValue?: string;
	CurrentValue?: string;
	IsDifferent?: string | boolean;
}
