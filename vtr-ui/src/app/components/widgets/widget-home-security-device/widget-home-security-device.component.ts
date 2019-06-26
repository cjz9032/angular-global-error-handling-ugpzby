import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HomeSecurityMockService } from 'src/app/services/home-security/home-security.service';
import { CHSAccountState, ConnectedHomeSecurity, EventTypes, CHSNotificationType } from '@lenovo/tan-client-bridge';

@Component({
	selector: 'vtr-widget-home-security-device',
	templateUrl: './widget-home-security-device.component.html',
	styleUrls: ['./widget-home-security-device.component.scss']
})

export class WidgetHomeSecurityDeviceComponent implements OnInit {
	@Input() device;
	@Input() allDevice;
	constructor(public homeSecurityMockService: HomeSecurityMockService) {
	}

	ngOnInit() {
	}

}
