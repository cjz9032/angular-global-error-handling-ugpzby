import { Component, EventEmitter, Output } from '@angular/core';
import { Permit } from '../services/one-click-scan-steps.service';

@Component({
	selector: 'vtr-enter-email',
	templateUrl: './enter-email.component.html',
	styleUrls: ['./enter-email.component.scss']
})
export class EnterEmailComponent implements Permit {
	@Output() allow = new EventEmitter<boolean>();

	allowEmitter() {
		this.allow.emit(true);
	}

	disallowEmitter() {
		this.allow.emit(false);
	}
}
