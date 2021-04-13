import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';


@Injectable({
	providedIn: 'root',
})
export class SmartPrivacyMessengerService {
	private messages = fromEvent(window, 'message').pipe(
		filter((event: MessageEvent) => event.origin === location.origin )
	);

	getMessages() {
		return this.messages;
	}

	sendMessage(command: string, windowToSend: Window) {
		windowToSend.postMessage('to-smart-privacy:message', location.origin);
	}
}
