export enum BatteryConditionsEnum {
	Good,
	Exhaustion,
	Bad,
	Illegal,
	NotDetected,
	Error,

	HighTemperature,
	TrickleCharge,
	OverheatedBattery,
	PermanentError,
	HardwareAuthenticationError,

	MissingDriver,
	NotSupportACAdapter,

	LimitedACAdapterSupport,
	StoreLimitation
}

export enum BatteryQuality {
	Good, Fair, Poor
}
