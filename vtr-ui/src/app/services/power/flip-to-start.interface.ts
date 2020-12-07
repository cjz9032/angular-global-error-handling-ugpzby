import {
	FlipToStartCurrentModeEnum,
	FlipToStartErrorCodeEnum,
	FlipToStartSetStatusEnum,
	FlipToStartSupportedEnum,
} from './flip-to-start.enum';

type ErrorCodeSucceedCode = 0;
type ErrorCodeFailCode1 = -1;
type ErrorCodeFailCode2 = -2;
type ErrorCodePermissionErrorCode = -255;
type ErrorStatusCode =
	| ErrorCodeSucceedCode
	| ErrorCodeFailCode1
	| ErrorCodeFailCode2
	| ErrorCodePermissionErrorCode;

type SupportSucceedCode = 0;
type SupportFailCode = 1;
type SupportedStatusCode = SupportSucceedCode | SupportFailCode;

type CurrentModeSucceedEnableCode = 1;
type CurrentModeSucceedDisableCode = 0;
type CurrentModeFailErrorCode = -1;
type CurrentModeFailPermissionErrorCode = -255;
type CurrentModeFailSystemErrorCode = '-#';
type CurrentModeStatusCode =
	| CurrentModeSucceedDisableCode
	| CurrentModeSucceedEnableCode
	| CurrentModeFailErrorCode
	| CurrentModeFailPermissionErrorCode
	| CurrentModeFailSystemErrorCode;

export interface FlipToStartErrorStatusInterface {
	ErrorCode: FlipToStartErrorCodeEnum;
}

export interface FlipToStartInterface extends FlipToStartErrorStatusInterface {
	Supported: FlipToStartSupportedEnum;
	CurrentMode: FlipToStartCurrentModeEnum;
}

export type FlipToStartSetStatus = FlipToStartSetStatusEnum;
