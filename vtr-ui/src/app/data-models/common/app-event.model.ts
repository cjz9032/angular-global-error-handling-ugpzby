export class AppEvent {
	chsEvent: (value: any, type?: any) => void;
	wsStateEvent: (value: any, type?: any) => void;
	wsPluginMissingEvent: (value: any, type?: any) => void;
	devicePostureEvent: (value: any, type?: any) => void;
	wsIsLocationServiceOnEvent: (value: any, type?: any) => void;
	wsIsAllAppsPermissionOnEvent: (value: any, type?: any) => void;
	wsIsDevicePermissionOnEvent: (value: any, type?: any) => void;
	wsHasSystemPermissionShowedEvent: (value: any, type?: any) => void;
	wsIsSupportWifiEvent: (value: any, type?: any) => void;
	wsCancelClickEvent: (value: any, type?: any) => void;
	wsCancelClickFinishEvent: (value: any, type?: any) => void;
}
