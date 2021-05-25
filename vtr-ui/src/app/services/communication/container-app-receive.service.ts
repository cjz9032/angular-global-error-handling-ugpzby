import { Injectable } from '@angular/core';
import { AppMessage } from './app-message';
import { ContainerAppReceiveHandler } from './container-app-receive.handler';

declare let window;
declare const defaultMenuIndex = '999';

@Injectable({
	providedIn: 'root',
})
export class ContainerAppReceiveService {
	constructor(private messageHandler: ContainerAppReceiveHandler) {
		window.communicateWithContainerApp = this.receiveFromSameOrigin.bind(this);
		window.addEventListener('message', this.receiveFromCrossOrigin.bind(this), false);
	}

	private receiveFromSameOrigin(appMessage: AppMessage) {
		this.messageHandler.handle(appMessage);
	}

	private receiveFromCrossOrigin(postMessageEvent: any) {
		this.messageHandler.handle(postMessageEvent?.data, postMessageEvent?.origin);
	}
}
