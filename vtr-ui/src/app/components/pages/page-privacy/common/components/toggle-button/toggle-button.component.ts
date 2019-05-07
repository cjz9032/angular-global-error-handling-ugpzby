import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'vtr-toggle-button',
	templateUrl: './toggle-button.component.html',
	styleUrls: ['./toggle-button.component.scss']
})
export class ToggleButtonComponent implements OnInit {
	@Input() controlName: FormControl;

	constructor() {
	}

	ngOnInit() {
	}

}
