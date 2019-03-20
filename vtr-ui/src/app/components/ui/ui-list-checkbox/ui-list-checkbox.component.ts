import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AvailableUpdateDetail } from 'src/app/data-models/system-update/available-update-detail.model';

@Component({
	selector: 'vtr-ui-list-checkbox',
	templateUrl: './ui-list-checkbox.component.html',
	styleUrls: ['./ui-list-checkbox.component.scss']
})

export class UiListCheckboxComponent implements OnInit {

	@Input() items: Array<AvailableUpdateDetail>;
	@Input() isInstallationSuccess = false;
	@Input() isInstallationCompleted = false;
	@Output() checkChange = new EventEmitter<any>();
	// Random number is used to have unique id of each input field
	randomNumber: number = Math.floor(new Date().valueOf() * Math.random());

	constructor() { }

	ngOnInit() {
	}

	onCheckChange($event: any) {
		this.checkChange.emit($event);
	}
}
