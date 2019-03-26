import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {BaseComponent} from "../../base/base.component";

@Component({
	selector: 'vtr-widget-device-update-settings',
	templateUrl: './widget-device-update-settings.component.html',
	styleUrls: ['./widget-device-update-settings.component.scss']
})
export class WidgetDeviceUpdateSettingsComponent  extends BaseComponent implements OnInit {

	@Input() title: string;
	@Input() description: string;
	@Input() items: any[];

	@Output() toggleOnOff = new EventEmitter<any>();

	constructor() {
		super();
	}

	ngOnInit() {
	}

	public onToggleOnOff($event: any) {
		this.toggleOnOff.emit($event);
	}
}

