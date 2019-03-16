import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DeviceService } from '../../../services/device/device.service';

// @ts-ignore
@Component({
	selector: 'vtr-widget-switch-icon',
	templateUrl: './widget-switch-icon.component.html',
	styleUrls: ['./widget-switch-icon.component.scss']
})
export class WidgetSwitchIconComponent implements OnInit {
	@Input() title: string;
	@Input() iconDefinition: string[];
	@Input() value = false;
	@Input() isBlocked = false;
	@Input() tooltipText = '';

	@Output() toggle = new EventEmitter<boolean>();

	constructor(public deviceService: DeviceService) { }

	ngOnInit() {
		console.log(this.title, this.iconDefinition);
	}

	onChange(event) {
		this.value = !this.value;
		console.log('WIDGET SWITCH ICON VALUE', this.value);
		this.toggle.emit(this.value);
	}
}
