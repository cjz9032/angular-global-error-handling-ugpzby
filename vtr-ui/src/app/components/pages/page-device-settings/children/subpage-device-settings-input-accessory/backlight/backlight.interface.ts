import {
	CommonErrorCode,
	CommonResponse,
	NumberBoolean,
} from '../../../../../../data-models/common/common.interface';
import { BacklightLevelEnum, BacklightStatusEnum } from './backlight.enum';

export interface Backlight {
	getBacklight(): Promise<GetBacklightResponse>;

	setBacklight(status: SetBacklightStatus): Promise<CommonResponse<null>>;

	getBacklightOnSystemChange(
		settings: BacklightOnChangeSettings,
		callback: (response: { payload: GetBacklightResponse }) => void
	): Promise<GetBacklightResponse>;
}

export interface BacklightBase<T = string, K = string> {
	key: T;
	value: K;
	enabled?: NumberBoolean;
	errorCode?: CommonErrorCode;
}

export type BacklightLevel = BacklightBase<'KeyboardBacklightLevel', BacklightLevelEnum>;

export type BacklightStatus = BacklightBase<'KeyboardBacklightStatus', BacklightStatusEnum>;

export interface GetBacklightResponse {
	settingList: {
		setting: Array<BacklightStatus | BacklightLevel>;
	};
}

export interface SetBacklightStatus {
	settingList: [
		{
			setting: Array<BacklightStatus>;
		}
	];
}

export interface BacklightOnChangeSettings {
	settingList: [
		{
			// value: string like '00:01:00'
			setting: Array<BacklightBase<'IntermediateResponseDuration'>>;
		}
	];
}

export interface BacklightMode {
	checked: boolean;
	value: BacklightStatusEnum;
	title: string;
	disabled: boolean;
}
