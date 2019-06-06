import { Injectable } from '@angular/core';
import { BreachedAccount } from '../../../common/services/breached-accounts.service';

@Injectable()
export class BreachedAccountService {
	createBreachedAccountsForShow(breachedAccounts: BreachedAccount[]) {
		const breachedAccountsForShow = breachedAccounts.filter(x => x.domain !== 'n/a');
		const otherBreaches = breachedAccounts.filter(x => x.domain === 'n/a');

		breachedAccountsForShow.push({
			...otherBreaches[0],
			hasPassword: otherBreaches.findIndex((breachedAccount) => breachedAccount.hasPassword) > -1,
			hasEmail: otherBreaches.findIndex((breachedAccount) => breachedAccount.hasEmail) > -1,
		});

		return {breachedAccountsForShow, otherBreaches};
	}
}
