import { Component, OnInit, Input } from '@angular/core';
import { DeviceService } from '../../../services/device/device.service';
import { MockService } from "../../../services/mock/mock.service"

@Component({
	selector: 'vtr-page-device',
	templateUrl: './page-device.component.html',
	styleUrls: ['./page-device.component.scss']
})
export class PageDeviceComponent implements OnInit {

	title = 'My Device';
	back = 'BACK';
	backarrow="< ";

	constructor(
		public deviceService: DeviceService,
		public mockService: MockService
	) { }

	ngOnInit() {
	}

}
