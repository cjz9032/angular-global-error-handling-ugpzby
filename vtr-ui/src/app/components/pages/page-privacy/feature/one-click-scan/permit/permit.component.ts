import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OneClickScan, StepScanInputData } from '../services/one-click-scan-steps.service';

@Component({
	selector: 'vtr-permit',
	templateUrl: './permit.component.html',
	styleUrls: ['./permit.component.scss']
})
export class PermitComponent implements OneClickScan {
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
