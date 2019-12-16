import { Component, Input } from '@angular/core';
import { BreachedAccount } from '../services/breached-accounts.service';

@Component({
	selector: 'vtr-breached-other-description',
	templateUrl: './breached-other-description.component.html',
	styleUrls: ['../breached-description/breached-description.component.scss']
})
export class BreachedOtherDescriptionComponent {
	@Input() set setBreachData(otherBreachedAccount: BreachedAccount[]) {
		this.otherBreachedAccount = otherBreachedAccount;
		this.breachedEmails = this.getValueFromArray(otherBreachedAccount, 'email');
		this.breachedPasswords = this.getValueFromArray(otherBreachedAccount, 'password');
	}

	otherBreachedAccount: BreachedAccount[];
	breachedEmails: string[];
	breachedPasswords: string[];

	getValueFromArray(breachedAccounts: BreachedAccount[], key: string) {
		return breachedAccounts
			.map((breachedAccount) => breachedAccount[key])
			.filter((value) => !!value);
	}
}
