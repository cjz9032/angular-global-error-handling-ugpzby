import { Component, OnInit } from '@angular/core';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
	selector: 'vtr-page-privacy',
	templateUrl: './page-privacy.component.html',
	styleUrls: ['./page-privacy.component.scss']
})
export class PagePrivacyComponent implements OnInit {

	constructor(
		public deviceService: DeviceService
	) { }

	ngOnInit() {
	}

}
