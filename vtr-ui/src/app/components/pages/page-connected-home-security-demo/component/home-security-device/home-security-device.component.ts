import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HomeSecurityMockService } from 'src/app/services/home-security-demo/home-security-mock.service';
import { CHSAccountState, ConnectedHomeSecurityDemo, EventTypes, CHSNotificationType } from '@lenovo/tan-client-bridge';

@Component({
	selector: 'vtr-home-security-device-demo',
	templateUrl: './home-security-device.component.html',
	styleUrls: ['./home-security-device.component.scss']
})

export class HomeSecurityDeviceDemoComponent implements OnInit {
	@Input() device;
	@Input() allDevice;
	@Input() common;
	constructor(public homeSecurityMockService: HomeSecurityMockService) {
	}

	ngOnInit() {
	}

}
