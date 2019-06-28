import { Component, OnInit, Input, EventEmitter, HostListener } from '@angular/core';
import { HomeSecurityOverviewMyDevice } from 'src/app/data-models/home-security/home-security-overview-my-device.model';


interface DevicePostureDetail {
	status: number; // 1:success,2:fail
	title: string; // name
}

@Component({
	selector: 'vtr-home-security-my-device',
	templateUrl: './home-security-my-device.component.html',
	styleUrls: ['./home-security-my-device.component.scss']
})

export class HomeSecurityMyDeviceComponent implements OnInit {
	@Input() homeSecurityOverviewMyDevice: HomeSecurityOverviewMyDevice;

	isShowPosture = false;

	constructor() { }

	ngOnInit() {
	}

}
