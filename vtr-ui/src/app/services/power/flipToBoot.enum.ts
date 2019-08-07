export enum FlipToBootErrorCodeEnum {
	Succeed = 0,
	Fail1 = -1,
	Fail2 = -2,
	PermissionError = -255
}

export enum FlipToBootSupportedEnum {
	Succeed = 0,
	Fail = -1
}

export enum FlipToBootCurrentModeEnum {
	SucceedEnable = 1,
	SucceedDisable = 0,
	FailError = -1,
	FailPermissionError = -255,
	FailSystemError = '-#'
}

export enum FlipToBootSetStatusEnum {
	Off = '0',
	On = '1'
}
