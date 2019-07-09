import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HomeSecurityMockService } from 'src/app/services/home-security/home-security-mock.service';
import { CHSAccountState, ConnectedHomeSecurity, EventTypes, CHSNotificationType } from '@lenovo/tan-client-bridge';

@Component({
	selector: 'vtr-home-security-device',
	templateUrl: './home-security-device.component.html',
	styleUrls: ['./home-security-device.component.scss']
})

export class HomeSecurityDeviceComponent implements OnInit {
	@Input() device;
	@Input() allDevice;
	constructor(public homeSecurityMockService: HomeSecurityMockService) {
	}

	ngOnInit() {
	}

}
