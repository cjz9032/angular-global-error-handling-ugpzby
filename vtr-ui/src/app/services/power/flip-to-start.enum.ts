export enum FlipToStartErrorCodeEnum {
	Succeed = 0,
	Fail1 = -1,
	Fail2 = -2,
	PermissionError = -255,
}

export enum FlipToStartSupportedEnum {
	Succeed = 1,
	Fail = 0,
}

export enum FlipToStartCurrentModeEnum {
	SucceedEnable = 1,
	SucceedDisable = 0,
	FailError = -1,
	FailPermissionError = -255,
	FailSystemError = '-#',
}

export enum FlipToStartSetStatusEnum {
	Off = '0',
	On = '1',
}
