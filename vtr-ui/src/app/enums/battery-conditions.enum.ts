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
	EMDriverMissing,

	NotSupportACAdapter,
	LimitedACAdapterSupport,
	FullACAdapterSupport,
	StoreLimitation
}

export enum BatteryStatus {
	Good, Fair, Poor, AcAdapterStatus
}
