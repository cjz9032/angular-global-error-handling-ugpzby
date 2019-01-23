import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../../../services/device/device.service';

@Component({
	selector: 'vtr-widget-device',
	templateUrl: './widget-device.component.html',
	styleUrls: ['./widget-device.component.scss']
})
export class WidgetDeviceComponent implements OnInit {

	constructor(
		public deviceService: DeviceService
	) { }

	ngOnInit() {
	}

}
