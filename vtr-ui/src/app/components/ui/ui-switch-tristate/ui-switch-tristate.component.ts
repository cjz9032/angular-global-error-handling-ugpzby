import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-ui-switch-tristate',
	templateUrl: './ui-switch-tristate.component.html',
	styleUrls: ['./ui-switch-tristate.component.scss']
})
export class UiSwitchTristateComponent implements OnInit {

	@Input() onLabel = 'On';
	@Input() offLabel = 'Off';
	@Input() autoLabel = "Auto";

	@Input() onValue = "on";
	@Input() offValue = "off";
	@Input() autoValue = "auto";

	@Output() change: EventEmitter<string> = new EventEmitter();

	value;

	constructor() { }

	ngOnInit() {
		this.value = this.offValue;
	}

	onChange(event) {
        this.value = event.target.value;
        this.change.emit(this.value);
    }
}
