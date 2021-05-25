import { Injectable } from '@angular/core';
import { ISubAppConfig } from 'src/sub-app-config/sub-app-config-base';
import { AppMessage } from './app-message';

@Injectable({
	providedIn: 'root',
})
export class ContainerAppSendService {
	constructor() {}

	public send(subAppConfig: ISubAppConfig, appMessage: AppMessage) {
		if (!subAppConfig || !subAppConfig.name || !appMessage) {
			return;
		}

		const iframe: any = document.querySelector('#iframe-' + subAppConfig.name);
		if (iframe?.contentWindow) {
			if (subAppConfig.isCrossOrigin) {
				iframe.contentWindow.postMessage(appMessage, subAppConfig.origin);
			} else if (iframe.contentWindow.window) {
				iframe.contentWindow.window.communicateWithSubApp(appMessage);
			}
		}
	}
}
