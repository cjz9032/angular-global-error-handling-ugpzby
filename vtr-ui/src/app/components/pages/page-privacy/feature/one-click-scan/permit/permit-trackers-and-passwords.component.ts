import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Permit, StepScanInputData } from '../services/one-click-scan-steps.service';

@Component({
	selector: 'vtr-permit',
	templateUrl: './permit-trackers-and-passwords.component.html',
	styleUrls: ['./permit-trackers-and-passwords.component.scss']
})
export class PermitTrackersAndPasswordsComponent implements Permit {
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
