import { Component, OnInit, Input } from '@angular/core';
import { HomeSecurityMockService } from 'src/app/services/home-security/home-security.service';
import { CHSAccountState, ConnectedHomeSecurity, EventTypes } from '@lenovo/tan-client-bridge';

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

	switchMock() {
		const state = [CHSAccountState.standard, CHSAccountState.standardExpired, CHSAccountState.trial, CHSAccountState.trialExpired, CHSAccountState.local, 'character'];
		const i = this.homeSecurityMockService.id;
		if (this.homeSecurityMockService.id < 5) {
			this.homeSecurityMockService.id++;
		} else { this.homeSecurityMockService.id = 0; }
		const connectedHomeSecurity: any = this.homeSecurityMockService.getConnectedHomeSecurity();
		connectedHomeSecurity.account.state = <CHSAccountState>state[i];
		connectedHomeSecurity.mitt.emit(EventTypes.chsEvent, connectedHomeSecurity);
	}

	logout() {
		const connectedHomeSecurity: any = this.homeSecurityMockService.getConnectedHomeSecurity();
		connectedHomeSecurity.account.lenovoId.loggedIn = !connectedHomeSecurity.account.lenovoId.loggedIn;
		connectedHomeSecurity.mitt.emit(EventTypes.chsEvent, connectedHomeSecurity);
	}

}
