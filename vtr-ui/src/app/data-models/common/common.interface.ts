export type StringTruthy = 'True';
export type StringFalsy = 'False';
export type StringBoolean = StringTruthy | StringFalsy;
export type NumberBoolean = 0 | 1;


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
