import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Permit } from '../services/one-click-scan-steps.service';

@Component({
	selector: 'vtr-scanning',
	templateUrl: './scanning.component.html',
	styleUrls: ['./scanning.component.scss']
})
export class ScanningComponent implements Permit {
	@Output() allow = new EventEmitter<boolean>();

	allowEmitter() {
		this.allow.emit(true);
	}

	disallowEmitter() {
		this.allow.emit(false);
	}
}
