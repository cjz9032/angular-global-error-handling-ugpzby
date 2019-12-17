import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'vtr-accounts-stored',
	templateUrl: './accounts-stored.component.html',
	styleUrls: ['./accounts-stored.component.scss']
})
export class AccountsStoredComponent {
	@Input() dashboardData;
	@Output() buttonClick$ = new EventEmitter();

	buttonClick() {
		this.buttonClick$.emit(true);
	}
}
