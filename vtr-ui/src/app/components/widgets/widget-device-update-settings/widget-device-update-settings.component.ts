import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-widget-device-update-settings',
	templateUrl: './widget-device-update-settings.component.html',
	styleUrls: ['./widget-device-update-settings.component.scss']
})
export class WidgetDeviceUpdateSettingsComponent implements OnInit {

	@Input() title: string;
	@Input() description: string;
	@Input() items: any[];

	@Output() toggleOnOff = new EventEmitter<any>();

	constructor() {
	}

	ngOnInit() {
	}

	public onToggleOnOff($event: any) {
		this.toggleOnOff.emit($event);
	}
}

