import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../../services/device/device.service';

@Component({
	selector: 'vtr-widget-settings',
	templateUrl: './widget-settings.component.html',
	styleUrls: ['./widget-settings.component.scss']
})
export class WidgetSettingsComponent implements OnInit {

	constructor(
		public deviceService: DeviceService
	) { }

	ngOnInit() {
	}

}
