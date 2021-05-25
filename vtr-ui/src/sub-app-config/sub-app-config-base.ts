import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

export interface ISubAppConfig {
	name: string;
	url: string;
	origin: string;
	isPreloadEnabled: boolean;
	isAutoDestroyEnabled: boolean;
	entryUrls: string[];
	isCrossOrigin: boolean;
	webVersion: string;
	jsBridgeVersion: string;
	isIframeLoaded: boolean;
	isIframeLoadedSubject: BehaviorSubject<boolean>;
	isFirstLoad: boolean;
}
