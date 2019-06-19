import { Injectable, EventEmitter } from '@angular/core';
import { ConnectedHomeSecurity, CHSAccountState, WinRT, EventTypes, CHSNotificationType } from '@lenovo/tan-client-bridge';
import mitt from 'mitt';
import { HomeSecurityAccount } from 'src/app/data-models/home-security/home-security-account.model';
import { NotificationItem } from '../../data-models/home-security/home-security-notification-item.model'

@Injectable({
	providedIn: 'root',
})
export class HomeSecurityMockService {

	private connectedHomeSecurity: any = {
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
				this.mitt.emit(EventTypes.chsEvent, this.chs);
				return Promise.resolve(true);
			},
			purchase() {
				WinRT.launchUri('https://vantagestore.lenovo.com/en/shop/product/connectedhomesecurityoneyearlicense-windows');
				this.state = this.state === CHSAccountState.trial ? CHSAccountState.trialExpired : CHSAccountState.standard;
				this.mitt.emit(EventTypes.chsEvent, this.chs);
			},
			visitWebConsole(feature: string) {
				if (feature) {
					WinRT.launchUri(`https://homesecurity.coro.net/${feature}`);
				} else {
					WinRT.launchUri(`https://homesecurity.coro.net/`);
				}
				if (feature === 'login') {
					this.state = CHSAccountState.local;
					this.mitt.emit(EventTypes.chsEvent, this.chs);
				} else if (feature === 'profile') {
					this.state = CHSAccountState.standard;
					this.mitt.emit(EventTypes.chsEvent, this.chs);
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
				{name: 'fff', protected: true},
				{name: 'fff', protected: true},
				{name: 'fff', protected: true},
				{name: 'ggg', protected: false}
			]
		},
		notifications:  {
			value: [
			{type: CHSNotificationType.connectedUnsafeNetwork, time: new Date(), content: new Map([['Unsafe network connection', 'ThinkPad T490s']])},
			{type: CHSNotificationType.unknownDeviceConnected, time: new Date('2019-6-18 6:33:00'), content: new Map([['Device disconnected', 'ThinkPad T490s']])},
			{type: CHSNotificationType.applianceDisconnected, time: new Date('2017-12-18 13:33:00'), content: new Map([['Unsafe device detected', 'ThinkPad T490s']])},
			{type: CHSNotificationType.vulnerableDeviceDetected, time: new Date('2018-6-18 13:33:00'), content: new Map([['New device detected', 'ThinkPad T490s']])},
			{type: CHSNotificationType.homeNetworkUnsafe, time: new Date('2019-6-17 13:33:00'), content: new Map([['Network unsafe', 'ThinkPad T490s']])},
			{type: CHSNotificationType.applianceDisconnected, time: new Date('2017-12-18 13:33:00'), content: new Map([['Unsafe network connection', 'ThinkPad T490s']])},
			{type: CHSNotificationType.vulnerableDeviceDetected, time: new Date('2018-6-18 13:33:00'), content: new Map([['Device disconnected', 'ThinkPad T490s']])},
			{type: CHSNotificationType.homeNetworkUnsafe, time: new Date('2019-6-17 13:33:00'), content: new Map([['Unsafe device detected', 'ThinkPad T490s']])},
		]
		},
		on(type, handler) {
			this.mitt.on(type, handler);
			return this;
		},
		off() { return this; },
		refresh() {
			return Promise.resolve(true);
		}
	};

	public id = 0;

	public getConnectedHomeSecurity(): ConnectedHomeSecurity {
		if (!this.connectedHomeSecurity.mitt) {
			const emitter = new mitt();
			this.connectedHomeSecurity.mitt = emitter;
			this.connectedHomeSecurity.account.mitt = emitter;
			this.connectedHomeSecurity.account.chs = this.connectedHomeSecurity;
			this.connectedHomeSecurity.overview.mitt = emitter;
			this.connectedHomeSecurity.overview.chs = this.connectedHomeSecurity;
			this.connectedHomeSecurity.notifications.mitt = emitter;
			this.connectedHomeSecurity.notifications.chs = this.connectedHomeSecurity;
		}
		return <ConnectedHomeSecurity>this.connectedHomeSecurity;
	}

}
