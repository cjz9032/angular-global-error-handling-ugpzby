import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Permit, StepScanInputData } from '../services/one-click-scan-steps.service';

@Component({
	selector: 'vtr-enter-email',
	templateUrl: './enter-email.component.html',
	styleUrls: ['./enter-email.component.scss']
})
export class EnterEmailComponent implements Permit {
	@Input() data: StepScanInputData;
	@Output() allow = new EventEmitter<boolean>();

	constructor() {}

	allowEmitter() {
		this.allow.emit(true);
	}

	disallowEmitter() {
		this.allow.emit(false);
	}

}
