import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, merge, Subscription } from 'rxjs';
import { catchError, switchMap, switchMapTo, tap } from 'rxjs/operators';
import { BreachedAccount } from '../common-ui/breached-account/breached-account.component';
import { CommunicationWithFigleafService } from '../communication-with-figleaf/communication-with-figleaf.service';
import { EmailScannerService } from './email-scanner.service';

interface GetBreachedAccountsResponse {
	type: string;
	status: number;
	payload: { breaches?: BreachedAccount[] };
}


@Injectable()
export class BreachedAccountsService {

	onGetBreachedAccounts$ = new BehaviorSubject<BreachedAccount[]>([]);

	constructor(
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private emailScannerService: EmailScannerService,
	) {
	}

	getBreachedAccounts(): Subscription {
		return merge(
			this.emailScannerService.validationStatusChanged$,
			this.communicationWithFigleafService.isFigleafReadyForCommunication$
		).pipe(
			switchMapTo(this.communicationWithFigleafService.isFigleafReadyForCommunication$),
			switchMap((isFigleafInstalled) => {
				if (isFigleafInstalled) {
					return this.communicationWithFigleafService.sendMessageToFigleaf({type: 'getFigleafBreachedAccounts'});
				} else {
					return this.emailScannerService.getBreachedAccountsByEmail().pipe(
						catchError((error) => {
							console.error('getBreachedAccountsByEmail error', error);
							return EMPTY;
						})
					);
				}
			})
		).subscribe((response: GetBreachedAccountsResponse) => {
			this.onGetBreachedAccounts$.next(response.payload.breaches);
			}, (error) => {
				console.error('error', error);
			});
	}
}
