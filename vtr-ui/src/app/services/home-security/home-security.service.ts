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
				this.state =  CHSAccountState.trial;
				return Promise.resolve(true);
			},
			purchase() {
				WinRT.launchUri('https://vantagestore.lenovo.com/en/shop/product/connectedhomesecurityoneyearlicense-windows');
				this.state = this.state === CHSAccountState.trial ? CHSAccountState.trialExpired : CHSAccountState.standard;
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
				value: [
					{name: 'PasswordProtection', vulnerable: false},
					{name: 'HardDriveEncryption', vulnerable: true},
					{name: 'AntiVirusAvailability', vulnerable: false},
					{name: 'FirewallAvailability', vulnerable: false},
					{name: 'AppsFromUnknownSources', vulnerable: true},
					{name: 'DeveloperMode', vulnerable: true},
					{name: 'NotActivatedWindows', vulnerable: false},
					{name: 'UacNotification', vulnerable: false}]
			},
			myDevice: {
				name: 'ThinkPad T470',
				protected: true,
			},
			allDevices: [
				{name: 'aaa', protected: true},
				{name: 'bbb', protected: true},
				{name: 'ccc', protected: true},
				{name: 'ddd', protected: true},
				{name: 'eee', protected: true},
				{name: 'fff', protected: true},
				{name: 'ggg', protected: false}
			]
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
	public id = 0;

	public getConnectedHomeSecurity(): ConnectedHomeSecurity {
		return this.connectedHomeSecurity;
	}
}
