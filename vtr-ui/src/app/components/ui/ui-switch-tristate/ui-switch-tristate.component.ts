import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-ui-switch-tristate',
	templateUrl: './ui-switch-tristate.component.html',
	styleUrls: ['./ui-switch-tristate.component.scss']
})
export class UiSwitchTristateComponent implements OnInit {
	@Output() changedValue: EventEmitter<string> = new EventEmitter();
	// @Input() value: string;
	onLabel = 'on';
	offLabel = 'off';
	autoLabel = "Auto";
	onValue = "1";
	offValue = "0";
	autoValue = "2";
	constructor() { }

	ngOnInit() {

	}
	onChange(value) {
		this.changedValue.emit(value);
	}
}
