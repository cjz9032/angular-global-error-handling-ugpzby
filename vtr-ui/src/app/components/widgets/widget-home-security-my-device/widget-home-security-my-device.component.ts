import { Component, OnInit, Input, EventEmitter, HostListener } from '@angular/core';
import { HomeSecurityOverviewMyDevice } from 'src/app/data-models/home-security/home-security-overview-my-device.model';


interface DevicePostureDetail {
	status: number; // 1:success,2:fail
	title: string; // name
}

@Component({
	selector: 'vtr-widget-home-security-my-device',
	templateUrl: './widget-home-security-my-device.component.html',
	styleUrls: ['./widget-home-security-my-device.component.scss']
})

export class WidgetHomeSecurityMyDeviceComponent implements OnInit {
	@Input() homeSecurityOverviewMyDevice: HomeSecurityOverviewMyDevice;

	isShowPosture = false;

	constructor() { }

	ngOnInit() {
	}

}
