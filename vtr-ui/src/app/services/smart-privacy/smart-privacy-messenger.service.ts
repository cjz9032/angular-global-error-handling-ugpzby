import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

export const NOTIFICATION_MESSAGES = {
	openBuyNow: 'smart-privacy:open-buy-now',
	loaded: 'smart-privacy:loaded',
} as const;

export const REQUEST_MESSAGES = {
	openBuyNowClosed: 'smart-privacy:open-buy-now-closed',
	openPageSettings: 'smart-privacy:open-page-settings',
	openPageHome: 'smart-privacy:open-page-home',
	openPageResetPassword: 'smart-privacy:open-page-reset-password'
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

	sendMessage(message: keyof typeof REQUEST_MESSAGES, windowToSend: Window) {
		windowToSend.postMessage(REQUEST_MESSAGES[message], location.origin);
	}
}
