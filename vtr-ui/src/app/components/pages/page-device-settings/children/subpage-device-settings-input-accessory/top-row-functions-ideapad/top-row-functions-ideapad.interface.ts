export type StringTruthy = 'True';
export type StringFalsy = 'False';
export type StringBoolean = StringTruthy | StringFalsy;
export type NumberBoolean = 0 | 1;

// export interface TopRowFunctionsIdeapad {
//
// 	getCapability(): Promise<CommonResponse<GetCapabilityResponse>>;
//
// 	getPrimaryKey(): Promise<CommonResponse<GetPrimaryKeyResponse>>;
//
// 	getFnLockStatus(): Promise<CommonResponse<GetFnLockStatusResponse>>;
//
// 	/**
// 	 * @param fnLock "True|False" ATTENTION!!!!!  String type truthy or falsy.
// 	 */
// 	setFnLockStatus(fnLock: StringBoolean): Promise<CommonResponse<null>>;
//
// }

export interface TopRowFunctionsIdeapad {

	getCapability(): Promise<GetCapabilityResponse>;

	getPrimaryKey(): Promise<GetPrimaryKeyResponse>;

	getFnLockStatus(): Promise<GetFnLockStatusResponse>;

	/**
	 * @param fnLock "True|False" ATTENTION!!!!!  String type truthy or falsy.
	 */
	setFnLockStatus(fnLock: StringBoolean): Promise<CommonResponse<null>>;

}

export type Capabilities = 'keyboardBacklightControl' | 'fnLock';
export type Capability = {
	[K in Capabilities]: boolean;
};

// export interface GetCapabilityResponse {
// 	errorCode: CommonErrorCode;
// 	capabilityList: Capability[];
// }
export interface CapabilityTemp {
	key: string;
	value: StringBoolean;
}

export interface GetCapabilityResponse {
	errorCode?: CommonErrorCode;
	capabilityList: {
		Items: CapabilityTemp[]
	};
	reservedInformation?: any;
}

export enum KeyType {
	HOTKEY = 'Hotkey',
	FNKEY = 'Fnkey'
}

// export interface GetPrimaryKeyResponse {
// 	errorCode: CommonErrorCode;
// 	primeKey: KeyType;
// 	enabled: NumberBoolean;
// }

export interface PrimaryKeySetting {
	key: string;
	value: KeyType;
	enabled: NumberBoolean;
	errorCode?: CommonErrorCode;
}

export interface GetPrimaryKeyResponse {
	settingList: {
		setting: PrimaryKeySetting[];
	};
}

// export interface GetFnLockStatusResponse {
// 	errorCode: CommonErrorCode;
// 	fnLock: boolean;
// 	enabled: NumberBoolean;
// }
export interface FnLockStatus {
	key: string;
	value: StringBoolean;
	enabled?: NumberBoolean;
	errorCode?: CommonErrorCode;
}

export interface GetFnLockStatusResponse {
	settingList: {
		setting: FnLockStatus[];
	};
}

// export interface CommonResponse<K> extends CommonResponseBase<null, K> {}

export interface CommonResponse<T, K = null> {
	errorcode: K | CommonErrorCode;
	payload?: T;
}

export enum CommonErrorCode {
	FAILED = -1,
	SUCCEED = 0
}

export enum StringBooleanEnum {
	TRUTHY = 'True',
	FALSY = 'False'
}
