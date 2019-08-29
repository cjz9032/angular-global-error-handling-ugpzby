import { Injectable } from '@angular/core';
import { ConnectedHomeSecurity, CHSAccountState, WinRT, EventTypes, CHSNotificationType } from '@lenovo/tan-client-bridge';

@Injectable({
	providedIn: 'root',
})
export class HomeSecurityMockService {

	private connectedHomeSecurity: ConnectedHomeSecurity = {
		account: {
			state: CHSAccountState.local,
			serverTimeUTC: new Date(),
			expiration: new Date('apr 15, 2020'),
			lenovoId: {
				email: 'email',
				loggedIn: false
			},
			consoleUrl: ''
		},
		overview: {
			myDevice: {
				name: 'ThinkPad T470',
				protected: true,
			},
			allDevices: [
				{ name: 'aaa', protected: true },
				{ name: 'bbb', protected: true },
				{ name: 'ccc', protected: true },
				{ name: 'ddd', protected: true },
				{ name: 'eee', protected: true },
				{ name: 'fff', protected: true },
				{ name: 'fff', protected: true },
				{ name: 'fff', protected: true },
				{ name: 'fff', protected: true },
				{ name: 'ggg', protected: false }
			]
		},
		notifications: {
			value: [
				{ type: CHSNotificationType.connectedUnsafeNetwork, time: new Date(), content: { title: 'New device detected', content: 'ThinkPad T490s' } },
				{ type: CHSNotificationType.unknownDeviceConnected, time: new Date('2019-6-18 6:33:00'), content: { title: 'New device detected', content: 'ThinkPad T490s' } },
				{ type: CHSNotificationType.applianceDisconnected, time: new Date('2017-12-18 13:33:00'), content: { title: 'Device disconnected', content: 'ThinkPad T490s' } },
				{ type: CHSNotificationType.vulnerableDeviceDetected, time: new Date('2018-6-18 13:33:00'), content: { title: 'Unsafe device detected', content: 'ThinkPad T490s' } },
				{ type: CHSNotificationType.homeNetworkUnsafe, time: new Date('2019-6-17 13:33:00'), content: { title: 'Network unsafe', content: 'ThinkPad T490s' } },
				{ type: CHSNotificationType.applianceDisconnected, time: new Date('2017-12-18 13:33:00'), content: { title: 'Device disconnected', content: 'ThinkPad T490s' } },
				{ type: CHSNotificationType.vulnerableDeviceDetected, time: new Date('2018-6-18 13:33:00'), content: { title: 'Unsafe device detected', content: 'ThinkPad T490s' } },
				{ type: CHSNotificationType.homeNetworkUnsafe, time: new Date('2019-6-17 13:33:00'), content: { title: 'Network unsafe', content: 'ThinkPad T490s' } },
			]
		},
		on(type, handler) {
			this.mitt.on(type, handler);
			return this;
		},
		off() { return this; },
		refresh() {
			return Promise.resolve([true]);
		},
		createAndGetAccount() {
			this.account.state = CHSAccountState.trial;
			this.mitt.emit(EventTypes.chsEvent, this.chs);
			return Promise.resolve(true);
		},
		purchase() {
			WinRT.launchUri('https://vantagestore.lenovo.com/en/shop/product/connectedhomesecurityoneyearlicense-windows');
			this.account.state = this.state === CHSAccountState.trial ? CHSAccountState.trialExpired : CHSAccountState.standard;
			this.mitt.emit(EventTypes.chsEvent, this.chs);
		},
		visitWebConsole(feature: string) {
			if (feature) {
				WinRT.launchUri(`https://homesecurity.coro.net/${feature}`);
			} else {
				WinRT.launchUri(`https://homesecurity.coro.net/`);
			}
			if (feature === 'login') {
				this.account.state = CHSAccountState.local;
				this.mitt.emit(EventTypes.chsEvent, this.chs);
			} else if (feature === 'profile') {
				this.account.state = CHSAccountState.standard;
				this.mitt.emit(EventTypes.chsEvent, this.chs);
			}
		}
	};

	public id = 0;

	public getConnectedHomeSecurity(): ConnectedHomeSecurity {
		return <ConnectedHomeSecurity>this.connectedHomeSecurity;
	}
}
