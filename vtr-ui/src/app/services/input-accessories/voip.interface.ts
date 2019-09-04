import { SupportedAppEnum, VoipErrorCodeEnum } from './voip.enum';

export interface VoipAppListInterface {
	appName: SupportedAppEnum;
	isAppInstalled: boolean;
	isSelected?: boolean;
}

export interface VoipResponseInterface {
	errorCode: VoipErrorCodeEnum;
	capability: boolean;
	keyboardVersion?: string;
	appList?: VoipAppListInterface[];
}
