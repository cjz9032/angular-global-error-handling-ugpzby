export enum SystemState {
	Loading = 0,
	GoodCondition = 1,
	NeedMaintenance = 2,
}

export enum SystemHealthDates {
	KeepShow = 3,
	SystemUpdate = 30,
	OOBE = 31,
	HardwareScan = 180,
}

export enum DeviceStatusCardType {
	su = 'systemUpdate',
	hw = 'hardwareScan',
}

export enum DeviceCondition {
	Loading = 0,
	Good = 1,
	NeedRunSU = 2,
	NeedRunSPScan = 3,
	NeedRunHWScan = 4,
}
