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

	MissingDriver,

	NonLenovoUsbPowerAdapter,
	NotSupportACAdapter,
	LimitedACAdapterSupport,
	FullACAdapterSupport,
	StoreLimitation,

	PrimaryNotDetected
}

export enum BatteryStatus {
	Good, Fair, Poor, AcAdapterStatus
}
