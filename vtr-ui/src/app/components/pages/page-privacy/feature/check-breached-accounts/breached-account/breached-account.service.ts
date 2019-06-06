import { Injectable } from '@angular/core';
import { BreachedAccount, KeyForShow, KeyOfBreachedAccounts } from '../../../common/services/breached-accounts.service';
import { returnUniqueElementsInArrayOfObject } from '../../../utils/helpers';

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

		const keyOfBreachedAccounts = this.getKeyOfBreachedAccounts(otherBreaches);
		const countOfBreachInfo = this.getCountOfBreachInfo(otherBreaches);

		return {breachedAccountsForShow, keyOfBreachedAccounts, countOfBreachInfo};
	}


	private getKeyOfBreachedAccounts(otherBreaches: BreachedAccount[]): KeyOfBreachedAccounts[] {
		return returnUniqueElementsInArrayOfObject(otherBreaches.map((breachAccount) => ({
				[KeyForShow.email]: breachAccount[KeyForShow.email],
				[KeyForShow.password]: breachAccount[KeyForShow.password]
		})), [...Object.keys(KeyForShow)]);
	}

	private getCountOfBreachInfo(otherBreaches: BreachedAccount[]) {
		return otherBreaches.filter((breachAccount) =>
			breachAccount.hasPassword || breachAccount.hasEmail
		).length;
	}
}
