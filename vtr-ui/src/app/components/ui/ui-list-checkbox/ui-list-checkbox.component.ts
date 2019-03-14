import { Component, OnInit, Input } from '@angular/core';
import { UpdateInfo } from 'src/app/data-models/system-update/update-info.model';

@Component({
	selector: 'vtr-ui-list-checkbox',
	templateUrl: './ui-list-checkbox.component.html',
	styleUrls: ['./ui-list-checkbox.component.scss']
})

export class UiListCheckboxComponent implements OnInit {

	@Input() items: any;

	// Random number is used to have unique id of each input field
	randomNumber: number = Math.floor(new Date().valueOf() * Math.random());

	constructor() { }

	ngOnInit() {
	}

}
