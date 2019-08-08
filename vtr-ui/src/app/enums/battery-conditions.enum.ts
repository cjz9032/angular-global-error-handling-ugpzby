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
	UnsupportedBattery,
	NonThinkPadBattery,
	NonLenovoUsbPowerAdapter,

	MissingDriver,

	NotSupportACAdapter,
	LimitedACAdapterSupport,
	StoreLimitation
}

export enum BatteryQuality {
	Good, Fair, Poor, AcError
}
