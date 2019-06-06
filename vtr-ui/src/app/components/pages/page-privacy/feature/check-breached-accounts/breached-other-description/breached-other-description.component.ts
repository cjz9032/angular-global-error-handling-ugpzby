import { Component, Input } from '@angular/core';
import { BreachedAccount } from '../../../common/services/breached-accounts.service';

@Component({
	selector: 'vtr-breached-other-description',
	templateUrl: './breached-other-description.component.html',
	styleUrls: ['../breached-description/breached-description.component.scss']
})
export class BreachedOtherDescriptionComponent {
	@Input() set setBreachData(otherBreachedAccount: BreachedAccount[]) {
		this.otherBreachedAccount = otherBreachedAccount;
		this.breachedEmails = otherBreachedAccount.map((account) => account.email);
		this.breachedPasswords = otherBreachedAccount.map((account) => account.password);
	}

	otherBreachedAccount: BreachedAccount[];
	breachedEmails: string[];
	breachedPasswords: string[];
}
