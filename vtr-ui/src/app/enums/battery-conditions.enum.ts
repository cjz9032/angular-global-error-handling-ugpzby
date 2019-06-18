export enum BatteryConditionsEnum {
	Good,
	Exhaution,
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
