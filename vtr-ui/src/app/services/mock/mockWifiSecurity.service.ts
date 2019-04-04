/// <reference path='../../../../node_modules/@lenovo/tan-client-bridge/src/index.js' />
import { Injectable } from '@angular/core';
import mitt from 'mitt';
import { SecurityAdvisor, WifiSecurity, HomeProtection } from '@lenovo/tan-client-bridge';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { Emitable } from '@lenovo/tan-client-bridge/type/base';

@Injectable()

export class MockWifiSecurity {
	mitt = new mitt();
	securityStatus = [
		{
			'status': 0,
			'id': 'anti-virus',
			'title': 'Anti-Virus',
			'detail': 'Enabled',
			'path': 'security/anti-virus',
			'type': 'security'

		},
		{
			'status': 0,
			'id': 'wifi-security',
			'title': 'WiFi Security',
			'detail': 'Enabled',
			'path': 'security/wifi-security',
			'type': 'security'

		},
		{
			'status': 2,
			'id': 'pwdmgr',
			'title': 'Password Manager',
			'detail': 'Installed',
			'path': 'security/password-protection',
			'type': 'security'
		},
		{
			'status': 2,
			'id': 'vpn',
			'title': 'VPN',
			'detail': 'Installed',
			'path': 'security/internet-protection',
			'type': 'security'
		},
		{
			'status': 1,
			'id': 'windows-hello',
			'title': 'Windows Hello',
			'detail': 'disabled',
			'path': 'security/windows-hello',
			'type': 'security'

		}
	];
	securityAdvisor: SecurityAdvisor = {
		wifiSecurity: {
			mitt: this.mitt,
			// state: 'enabled',
			state: 'disabled',
			wifiHistory: [{
				ssid: 'lenovo',
				info: '2019/2/13 9:04:49',
				good: 1
			}, {
				ssid: 'cdl',
				info: '2019/3/5 11:04:49',
				good: 0
			}, {
				ssid: 'lalal',
				info: '2019/1/4 15:22:49',
				good: 2
			}, {
				ssid: 'lenovo',
				info: '2019/2/13 9:04:49',
				good: 1
			}, {
				ssid: 'cdl',
				info: '2019/3/5 11:04:49',
				good: 0
			}, {
				ssid: 'lalal',
				info: '2019/1/4 15:22:49',
				good: 2
			}, {
				ssid: 'lenovo',
				info: '2019/2/13 9:04:49',
				good: 1
			}, {
				ssid: 'cdl',
				info: '2019/3/5 11:04:49',
				good: 0
			}, {
				ssid: 'lalal',
				info: '2019/1/4 15:22:49',
				good: 2
			}],
			isLocationServiceOn: true,
			isLWSPluginInstalled: true,
			hasEverUsed: false,
			enableWifiSecurity(): Promise<any> {
				this.state = 'enabled';
				this.mitt.emit(EventTypes.wsStateEvent, this.state);
				return Promise.resolve();
			},
			disableWifiSecurity(): Promise<any> {
				this.state = 'disabled';
				this.mitt.emit(EventTypes.wsStateEvent, this.state);
				return Promise.resolve();
			},
			updateWifiSecurityState(): void {

			},
			getWifiSecurityState(): void {

			},
			launchLocationPrivacy(): any {

			},
			refresh(): Promise<Array<any>> {
				let p1 = new Promise((resolve) => { })
				let p2 = new Promise(() => { })
				return Promise.all([p1, p2]);
			},
			on(type, handler): Emitable {
				this.mitt.on(type, handler);
				return this;
			},
			off(type, handler): Emitable {
				this.mitt.off(type, handler);
				return this;
			},
		},
		homeProtection: {
			mitt: this.mitt,
			status: 'joined',
			familyId: '123456',
			nickName: 'nick',
			imageUrl: 'https://www.baidu.com',
			devicePosture: [{ config: 'HardDriveEncryption', vulnerable: 'true' },
			{ config: 'AppsFromUnknownSources', vulnerable: 'false' }],
			chsConsoleUrl: 'https://www.baidu.com',
			launchConsole(): Promise<any> {
				return Promise.resolve();
			},
			joinGroupBy(): Promise<any> {
				return Promise.resolve();
			},
			quitFromGroup(): Promise<any> {
				return Promise.resolve();
			},
			updateActivateDeviceState(): void {

			},
			getActivateDeviceState(): void {

			},
			getDevicePosture(): void {

			},
			refresh(): Promise<Array<any>> {
				let p1 = new Promise((resolve) => { });
				let p2 = new Promise(() => { });
				return Promise.all([p1, p2]);
			},
			on(type, handler): Emitable {
				this.mitt.on(type, handler);
				return this;
			},
			off(type, handler): Emitable {
				this.mitt.off(type, handler);
				return this;
			},
		},
		antivirus: null,
		windowsHello: null,
		passwordManager: null,
		vpn: null,
		on(): Emitable {
			return this;
		},
		off(): Emitable {
			return this;
		},
		refresh(): Promise<any> {
			let p1 = new Promise((resolve) => { })
			return p1;
		}
	};

	public getSecurityAdvisor(): SecurityAdvisor {
		return this.securityAdvisor;
	}

}
