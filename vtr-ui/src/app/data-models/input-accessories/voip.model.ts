import { SupportedAppEnum, VoipErrorCodeEnum } from '../../enums/voip.enum';

export interface VoipApp {
	appName: SupportedAppEnum;
	isAppInstalled: boolean;
	isSelected?: boolean;
}

export interface VoipResponse {
	errorCode: VoipErrorCodeEnum;
	capability: boolean;
	keyboardVersion?: string;
	appList?: VoipApp[];
}
