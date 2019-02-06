import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-ui-switch-tristate',
	templateUrl: './ui-switch-tristate.component.html',
	styleUrls: ['./ui-switch-tristate.component.scss']
})
export class UiSwitchTristateComponent implements OnInit {
	@Output() changedValue: EventEmitter<any> = new EventEmitter();
	@Input() value: boolean;
	onLabel = 'on';
	offLabel = 'off';
	autoLabel = "Auto";
	onValue = "1";
	offValue = "0";
	autoValue = "-1";
	constructor() { }

	ngOnInit() {

	}
	onChange(event) {
		this.value = !this.value;
		event.switchValue = this.value;
		this.changedValue.emit(event);
	}
}
