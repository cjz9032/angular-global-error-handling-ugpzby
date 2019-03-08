import { Component, Input } from '@angular/core';
import { BreachedAccount } from '../breached-account/breached-account.component';

@Component({
	selector: 'vtr-breached-description',
	templateUrl: './breached-description.component.html',
	styleUrls: ['./breached-description.component.scss']
})
export class BreachedDescriptionComponent {
	@Input() breachedAccount: BreachedAccount;
}
