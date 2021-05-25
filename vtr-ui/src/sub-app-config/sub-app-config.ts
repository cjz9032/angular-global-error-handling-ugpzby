import { ISubAppConfig } from './sub-app-config-base';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

export const settingsAppConfig: ISubAppConfig = {
	name: 'settings',
	url: 'https://vantage.csw.lenovo.com/v1/web/settings/default',
	origin: 'https://vantage.csw.lenovo.com',
	isPreloadEnabled: true,
	isAutoDestroyEnabled: false,
	entryUrls: ['/device/device-settings'],
	isCrossOrigin: true,
	webVersion: '',
	jsBridgeVersion: '',
	isIframeLoaded: false,
	isIframeLoadedSubject: new BehaviorSubject<boolean>(false),
	isFirstLoad: true,
};

export const subAppConfigList: Array<ISubAppConfig> = [settingsAppConfig];
