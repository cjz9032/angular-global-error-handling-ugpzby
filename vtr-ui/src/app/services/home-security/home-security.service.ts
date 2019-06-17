import { Injectable } from '@angular/core';
import { HomeSecurityAccount } from 'src/app/data-models/home-security/home-security-account.model';
import { ConnectedHomeSecurity, CHSAccountState, WinRT } from '@lenovo/tan-client-bridge';

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
				loggedIn: true
			},
			createAccount() {
				this.state = this.state === CHSAccountState.local ? CHSAccountState.trial : CHSAccountState.trialExpired;
				return Promise.resolve(true);
			},
			purchase() {
				WinRT.launchUri('https://vantagestore.lenovo.com/en/shop/product/connectedhomesecurityoneyearlicense-windows');
				this.state = CHSAccountState.standard;
			},
			visitWebConsole(feature: string) {
				WinRT.launchUri(`https://homesecurity.coro.net/${feature}`);
				if (feature === 'login') {
					this.state = CHSAccountState.local;
				} else if (feature === 'profile') {
					this.state = CHSAccountState.standard;
				}
			}
		},
		overview: {
			devicePostures: {
				value: []
			},
			myDevice: {
				name: '',
				protected: true,
			},
			allDevices: []
		},
		notifications: {
			value: []
		},
		on() { return this; },
		off() { return this; },
		refresh() {
			return Promise.resolve(true);
		}
	};

	public account: HomeSecurityAccount = {
		id: '0',
		name : 'all',
		subscription: 'localWithLid',
	};

	public id = 0;

	public getConnectedHomeSecurity(): ConnectedHomeSecurity {
		return this.connectedHomeSecurity;
	}
}
