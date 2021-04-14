import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

export const MESSAGES = {
	openBuyNow: 'smart-privacy:open-buy-now',
	openBuyNowClosed: 'smart-privacy:open-buy-now-closed',
} as const;

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

	sendMessage(message: keyof typeof MESSAGES, windowToSend: Window) {
		windowToSend.postMessage(MESSAGES[message], location.origin);
	}
}
