import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-widget-home-security-device',
	templateUrl: './widget-home-security-device.component.html',
	styleUrls: ['./widget-home-security-device.component.scss']
})
export class WidgetHomeSecurityDeviceComponent implements OnInit {
	device = {
		title: 'homeSecurity.thisDevice',
		status: 'protected'
	};
	allDevice = {
		title: 'homeSecurity.allDevices',
		status: 'not-protected'
	};
	constructor() { }

	ngOnInit() {
	}

}
