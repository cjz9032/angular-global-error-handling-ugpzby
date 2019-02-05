import { Component, OnInit, Input } from '@angular/core';
import { DeviceService } from '../../../services/device/device.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

// @ts-ignore
@Component({
	selector: 'vtr-widget-switch-icon',
	templateUrl: './widget-switch-icon.component.html',
	styleUrls: ['./widget-switch-icon.component.scss']
})
export class WidgetSwitchIconComponent implements OnInit {

	@Input() title: string;
	@Input() iconDefinition: string[];
	@Input() value: boolean = false;

	constructor(
		public deviceService: DeviceService
	) {
	}

	ngOnInit() {
		console.log(this.title, this.iconDefinition);
	}

	onChange(event) {
		this.value = event.switchValue;
		console.log('WIDGET SWITCH ICON VALUE', this.value);
	}

}
