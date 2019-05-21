import { Component, EventEmitter, Output } from '@angular/core';
import { Permit } from '../services/one-click-scan-steps.service';

@Component({
	selector: 'vtr-permit-trackers-and-passwords',
	templateUrl: './permit-trackers-and-passwords.component.html',
	styleUrls: ['./permit-trackers-and-passwords.component.scss']
})
export class PermitTrackersAndPasswordsComponent implements Permit {
	@Output() allow = new EventEmitter<boolean>();

	constructor() {}

	allowEmitter() {
		this.allow.emit(true);
	}

	disallowEmitter() {
		this.allow.emit(false);
	}

}
