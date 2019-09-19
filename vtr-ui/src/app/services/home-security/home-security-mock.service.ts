import { Injectable } from '@angular/core';
import { ConnectedHomeSecurity, CHSAccountState, WinRT, EventTypes, CHSNotificationType } from '@lenovo/tan-client-bridge';

@Injectable({
	providedIn: 'root',
})
export class HomeSecurityMockService {
	private connectedHomeSecurity: any = {
		account: {
			state: CHSAccountState.trial,
			role: 'admin',
			lenovoId: 'lenovo@lenovo.com',
			serverTimeUTC: new Date(),
			expiration: new Date('sep 15, 2019'),
			consoleUrl: '',
			getCHSConsoleUrl() {
				return Promise.resolve('https://chs.lenovo.com/');
			}
		},
		deviceOverview: {
			allDevicesCount: 0,
			allDevicesProtected: true,
			familyMembersCount: 2,
			placesCount: 2,
			personalDevicesCount: 1,
			wifiNetworkCount: 3,
			homeDevicesCount: 0
		},
		on(type, handler) {
			this.mitt.on(type, handler);
			return this;
		},
		off() { return this; },
		refresh() {
			return Promise.resolve([true]);
		},
		joinAccount(code: string) {
			this.mitt.emit(EventTypes.chsEvent, this.chs);
			return Promise.resolve('success');
		},
 		quitAccount() {
			this.mitt.emit(EventTypes.chsEvent, this.chs);
			return Promise.resolve('success');
		},
		purchase() {
			WinRT.launchUri('https://vantagestore.lenovo.com/en/shop/product/connectedhomesecurityoneyearlicense-windows');
			this.account.state = this.state === CHSAccountState.trial ? CHSAccountState.trialExpired : CHSAccountState.standard;
			this.mitt.emit(EventTypes.chsEvent, this.chs);
		},
		visitWebConsole(feature: string) {
			WinRT.launchUri(`https://homesecurity.coro.net/`);
			this.account.state = this.state === CHSAccountState.trial ? CHSAccountState.trialExpired : CHSAccountState.standard;
			this.mitt.emit(EventTypes.chsEvent, this.chs);
		}
	};

	public id = 0;

	public getConnectedHomeSecurity(): ConnectedHomeSecurity {
		return <ConnectedHomeSecurity>this.connectedHomeSecurity;
	}
}
