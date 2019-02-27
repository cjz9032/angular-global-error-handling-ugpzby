import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-ui-switch-onoff',
	templateUrl: './ui-switch-onoff.component.html',
	styleUrls: ['./ui-switch-onoff.component.scss']
})
export class UiSwitchOnoffComponent implements OnInit {
	@Output() toggle: EventEmitter<any> = new EventEmitter();

	@Input() value: boolean;

	onLabel = 'on';
	offLabel = 'off';
	size = 'switch-xs';

	constructor() {}

	ngOnInit() {}

	onChange(event) {
		this.value = !this.value;
		event.switchValue = this.value;
		this.toggle.emit(event);
	}
}
