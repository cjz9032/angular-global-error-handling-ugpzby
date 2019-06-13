export enum BatteryConditionsEnum {
    Good,
    Exhaution,
    Bad,
    Illegal,
    NotDetected,
    Error,

    Normal,
    HighTemperature,
    TrickleCharge,
    OverheatedBattery,
    PermanentError,
    HardwareAuthenticationError,

    MissingDriver,
    NotSupportACAdapter,

    LimitedACAdapterSupport
}

export enum BatteryQuality {
    Good, Fair, Poor
}
