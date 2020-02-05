import { CommonErrorCode, CommonResponse, NumberBoolean } from '../../../../../../data-models/common/common.interface';
import { BacklightLevelEnum, BacklightStatusEnum } from './backlight.enum';

export interface Backlight {

	getBacklight(): Promise<GetBacklightResponse>;

	setBacklight(status: SetBacklightStatus): Promise<CommonResponse<null>>;

	GetBacklightOnSystemChange(settings: BacklightOnChangeSettings): Promise<GetBacklightResponse>;
}

export interface BacklightBase<T = string, K = string> {
	key: T;
	value: K;
	enabled?: NumberBoolean;
	errorCode?: CommonErrorCode;
}

export interface BacklightLevel extends BacklightBase<'KeyboardBacklightLevel', BacklightLevelEnum> {}

export interface BacklightStatus extends BacklightBase<'KeyboardBacklightStatus', BacklightStatusEnum> {}

export interface GetBacklightResponse {
	settingList: {
		setting: Array<BacklightStatus | BacklightLevel>;
	};
}

export interface SetBacklightStatus {
	settingList: [{
		setting: Array<BacklightStatus>;
	}];
}

export interface BacklightOnChangeSettings {
	settingList: {
		// value: string like '00:01:00'
		setting: Array<BacklightBase<'IntermediateResponseDuration'>>;
	};
}

export interface BacklightMode {
	checked: boolean;
	value: BacklightStatusEnum;
	title: string;
}
