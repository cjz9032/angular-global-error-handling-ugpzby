import { CommonErrorCode, NumberBoolean, StringBoolean } from '../../../../../../data-models/common/common.interface';
import { BacklightEnum } from './backlight.enum';


export interface BacklightLevel {
	key: string;
	value: BacklightEnum;
	enabled?: NumberBoolean;
	errorCode?: CommonErrorCode;
}

export interface GetBacklightStatusResponse {
	settingList: {
		setting: BacklightLevel[];
	};
}
