import { Injectable } from '@angular/core';
import {
	NOTIFICATION_MESSAGES,
	REQUEST_MESSAGES,
	SmartPrivacyMessengerService
} from './smart-privacy-messenger.service';
import { debounceTime, filter, map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Params } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SmartPrivacyListenService {

  constructor(private smartPrivacyMessengerService: SmartPrivacyMessengerService) { }

	listenOpenPage(queryParamsFromRoute: Observable<Params>) {
		const messages: {[key: string]: keyof typeof REQUEST_MESSAGES} = {
			settings: 'openPageSettings',
			home: 'openPageHome',
			resetPassword: 'openPageResetPassword',
		}

		return this.smartPrivacyMessengerService.getMessages().pipe(
			filter((message) => message.data === NOTIFICATION_MESSAGES.loaded),
			switchMap(() => queryParamsFromRoute),
			filter((queryParams) => queryParams['page'] || !messages[queryParams['page']]),
			map((queryParams) => messages[queryParams['page']])
		)
	}
}
