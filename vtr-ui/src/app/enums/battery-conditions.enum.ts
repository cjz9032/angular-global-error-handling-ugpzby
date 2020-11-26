export enum BatteryConditionsEnum {
	Good,
	Exhaustion,
	Bad,
	Illegal,
	NotDetected,
	Error,

	StoreLimitation,

	HighTemperature,
	TrickleCharge,
	OverheatedBattery,
	PermanentError,
	UnsupportedBattery,

	MissingDriver,

	FullACAdapterSupport,
	LimitedACAdapterSupport,
	NotSupportACAdapter,

	PrimaryNotDetected,
}

export enum BatteryStatus {
	Good,
	Fair,
	Poor,
	AcAdapterStatus,
}
