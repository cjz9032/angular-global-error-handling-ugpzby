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

export interface SnapshotComponentsListByType {
	hardwareList?: SnapshotInfo | Array<string>;
	softwareList?: SnapshotInfo | Array<string>;
}

export interface SnapshotModuleComponentStatus {
	info: SnapshotModule;
	status: SnapshotComponentStatus;
}

export interface SnapshotModule {
	BaselineDate?: string;
	LastSnapshotDate?: string;
	Items?: Array<SnapshotDeviceInfo>;
	IsDifferent?: boolean;
}

export interface SnapshotDeviceInfo {
	DeviceId?: string;
	DeviceTypeName?: string;
	Properties?: Array<SnapshotPropertyInfo>;
	SubDevices?: Array<SnapshotDeviceInfo>;
	IsDifferent?: boolean;
}

export interface SnapshotPropertyInfo {
	PropertyName?: string;
	BaseValue?: string;
	CurrentValue?: string;
	IsDifferent?: boolean;
}

export interface ModalSnapshotComponentItem {
	name: string;
	selected: boolean;
	components?: Array<ModalSnapshotComponentItem>;
	collapsed?: boolean;
	indeterminate?: boolean;
}
