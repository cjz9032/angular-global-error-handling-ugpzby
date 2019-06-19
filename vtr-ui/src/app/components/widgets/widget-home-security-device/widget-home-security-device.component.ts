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
	@Output() upgradeAccount = new EventEmitter<boolean>();
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
		if (i === 0) {
			connectedHomeSecurity.notifications = {
				value: []
			};
		} else {
			connectedHomeSecurity.notifications = {
				value: [
					{ type: CHSNotificationType.applianceDisconnected, time: new Date('2017-12-18 13:33:00'), content: new Map([['Unsafe network connection', 'ThinkPad T490s']]) },
					{ type: CHSNotificationType.vulnerableDeviceDetected, time: new Date('2018-6-18 13:33:00'), content: new Map([['Device disconnected', 'ThinkPad T490s']]) },
					{ type: CHSNotificationType.homeNetworkUnsafe, time: new Date('2019-6-17 13:33:00'), content: new Map([['Unsafe device detected', 'ThinkPad T490s']]) },
				]
			};
		}
		connectedHomeSecurity.mitt.emit(EventTypes.chsEvent, connectedHomeSecurity);
	}

	logout() {
		const connectedHomeSecurity: any = this.homeSecurityMockService.getConnectedHomeSecurity();
		connectedHomeSecurity.account.lenovoId.loggedIn = !connectedHomeSecurity.account.lenovoId.loggedIn;
		this.upgradeAccount.emit();
		connectedHomeSecurity.mitt.emit(EventTypes.chsEvent, connectedHomeSecurity);
	}

}
