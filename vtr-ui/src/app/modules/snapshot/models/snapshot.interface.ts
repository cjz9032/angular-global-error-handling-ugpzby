import { SnapshotComponentStatus } from '../enums/snapshot.enum';

export interface SnapshotInfo {
	HardDrives?: SnapshotModuleComponentStatus;
	Memory?: SnapshotModuleComponentStatus;
	Motherboard?: SnapshotModuleComponentStatus;
	Processors?: SnapshotModuleComponentStatus;
	Network?: SnapshotModuleComponentStatus;
	Programs?: SnapshotModuleComponentStatus;
	VideoCards?: SnapshotModuleComponentStatus;
	StartupPrograms?: SnapshotModuleComponentStatus;
	SoundCards?: SnapshotModuleComponentStatus;
	DisplayDevices?: SnapshotModuleComponentStatus;
	Keyboards?: SnapshotModuleComponentStatus;
	Printers?: SnapshotModuleComponentStatus;
	MouseDevices?: SnapshotModuleComponentStatus;
	WebBrowsers?: SnapshotModuleComponentStatus;
	CdRomDrives?: SnapshotModuleComponentStatus;
	OperatingSystems?: SnapshotModuleComponentStatus;
	ReturnCode?: number;
}

export interface SnapshotInfoByType {
	hardwareComponents?: SnapshotInfo;
	softwareComponents?: SnapshotInfo;
}

export interface SnapshotModuleComponentStatus {
	info: SnapshotModule;
	status: SnapshotComponentStatus;
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
