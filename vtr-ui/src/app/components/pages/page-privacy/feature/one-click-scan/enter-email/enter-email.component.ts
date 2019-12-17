import { Component, EventEmitter, Output } from '@angular/core';
import { Permit } from '../services/one-click-scan-steps.service';
import { BreachedAccountsFacadeService } from '../../../pages/breached-accounts/breached-accounts-facade.service';

@Component({
	selector: 'vtr-enter-email',
	templateUrl: './enter-email.component.html',
	styleUrls: ['./enter-email.component.scss']
})
export class EnterEmailComponent implements Permit {
	@Output() allow = new EventEmitter<boolean>();
	scanCounter$ = this.breachedAccountsFacadeService.scanCounter$;
	scanCounterLimit = this.breachedAccountsFacadeService.scanCounterLimit;

	constructor(private breachedAccountsFacadeService: BreachedAccountsFacadeService) {
	}

	allowEmitter() {
		this.allow.emit(true);
	}

	disallowEmitter() {
		this.allow.emit(false);
	}
}
