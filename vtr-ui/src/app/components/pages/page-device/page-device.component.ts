import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../../../services/device/device.service';

@Component({
	selector: 'vtr-page-device',
	templateUrl: './page-device.component.html',
	styleUrls: ['./page-device.component.scss']
})
export class PageDeviceComponent implements OnInit {

	constructor(
		public deviceService: DeviceService
	) { }

	ngOnInit() {
	}

}
