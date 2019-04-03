/// <reference path='../../../../node_modules/@lenovo/tan-client-bridge/src/index.js' />
import { Injectable } from '@angular/core';
import mitt from 'mitt';
import { SecurityAdvisor } from '@lenovo/tan-client-bridge';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { Emitable } from '@lenovo/tan-client-bridge/type/base';
@Injectable()
export class MockSecurityAdvisorService {
	mitt = new mitt();
	securityStatus = [{
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
			}],
			isLocationServiceOn: true,
			isLWSPluginInstalled: true,
			enableWifiSecurity(): Promise<boolean> {
				this.state = 'enabled';
				this.mitt.emit(EventTypes.wsStateEvent, this.state);
				return Promise.resolve(true);
			},
			disableWifiSecurity(): Promise<boolean> {
				this.state = 'disabled';
				this.mitt.emit(EventTypes.wsStateEvent, this.state);
				return Promise.resolve(true);
			},
			launchLocationPrivacy(): Promise<boolean> {
				return Promise.resolve(true);
			},
			updateWifiSecurityState(): void { },
			getWifiSecurityState(): void { },
			refresh(): Promise<Array<any>> {
				const p1 = new Promise((resolve) => { });
				const p2 = new Promise(() => { });
				return Promise.all([p1, p2]);
			},
			on(type, handler): Emitable {
				this.mitt.on(type, handler);
				return;
			},
			off(type, handler): Emitable {
				this.mitt.off(type, handler);
				return;
			},
		},
		homeProtection: {
			mitt: this.mitt,
			status: 'joined',
			familyId: '123456',
			nickName: 'nick',
			imageUrl: 'https://www.baidu.com',
			devicePosture: [{
				config: 'HardDriveEncryption',
				vulnerable: 'true'
			},
			{
				config: 'AppsFromUnknownSources',
				vulnerable: 'false'
			}
			],
			chsConsoleUrl: 'https://www.baidu.com',
			launchConsole(): Promise<boolean> {
				return Promise.resolve(true);
			},
			joinGroupBy(): Promise<boolean> {
				return Promise.resolve(true);
			},
			quitFromGroup(): Promise<boolean> {
				return Promise.resolve(true);
			},
			updateActivateDeviceState(): void { },
			getActivateDeviceState(): void { },
			getDevicePosture(): void { },
			refresh(): Promise<Array<any>> {
				const p1 = new Promise((resolve) => { });
				const p2 = new Promise(() => { });
				return Promise.all([p1, p2]);
			},
			on(type, handler): Emitable {
				this.mitt.on(type, handler);
				return;
			},
			off(type, handler): Emitable {
				this.mitt.off(type, handler);
				return;
			},
		},
		antivirus: {
			mitt: this.mitt,
			mcafeeDownloadUrl: '',
			mcafee: {
				localName: '',
				subscription: '',
				expireAt: '',
				registered: true,
				trailUrl: '',
				features: [{
					key: 'mcAfeePersonalFirewall',
					value: true,
					id: ''
				}],
				firewallStatus: false,
				status: false,
				enabled: false,
				launch(): Promise<boolean> {
					return Promise.resolve(true);
				}
			},
			// mcafee: null,
			windowsDefender: {
				status: true,
				firewallStatus: false,
				enabled: false,
			},
			others: {
				antiVirus: [{
					status: true,
					name: 'other-antivirus'
				}],
				firewall: [{
					status: true,
					name: 'other-firewall'
				}],
				enabled: false,
			},
			refresh(): Promise<any> {
				const p1 = new Promise((resolve) => { });
				return p1;
			},
			on(type, handler): Emitable {
				this.mitt.on(type, handler);
				return;
			},
			off(type, handler): Emitable {
				this.mitt.off(type, handler);
				return;
			},

		},
		windowsHello: {
			mitt: this.mitt,
			fingerPrintStatus: 'inactive',
			facialIdStatus: 'active',
			systemPasswordStatus: 'inactive',
			supportUrl: 'https://support.microsoft.com/en-us/help/17215/windows-10-what-is-hello',
			windowsHelloProtocol: 'ms-settings:signinoptions',
			launch(): Promise<boolean> {
				return Promise.resolve(true);
			},
			refresh(): Promise<boolean> {
				return Promise.resolve(true);
			},
			on(type, handler): Emitable {
				this.mitt.on(type, handler);
				return;
			},
			off(type, handler): Emitable {
				this.mitt.off(type, handler);
				return;
			},
		},
		// windowsHello: null,
		passwordManager: {
			mitt: this.mitt,
			downloadUrl: 'https://www.dashlane.com/lenovo/',
			loginUrl: '',
			appUrl: 'https://app.dashlane.com',
			status: 'installed',
			isDashLaneEdgeVersion: false,
			download(): Promise<boolean> {
				return Promise.resolve(true);
			},
			launch(): Promise<boolean> {
				return Promise.resolve(true);
			},
			refresh(): Promise<any> {
				const p1 = new Promise((resolve) => { });
				return p1;
			},
			on(type, handler): Emitable {
				this.mitt.on(type, handler);
				return;
			},
			off(type, handler): Emitable {
				this.mitt.off(type, handler);
				return;
			},
		},
		vpn: {
			mitt: this.mitt,
			downloadUrl: 'https://www.surfeasy.com/lenovo/',
			status: 'installed',
			download(): Promise<boolean> {
				return Promise.resolve(true);
			},
			launch(): Promise<boolean> {
				return Promise.resolve(true);
			},
			refresh(): Promise<any> {
				return Promise.resolve();
			},
			on(type, handler): Emitable {
				this.mitt.on(type, handler);
				return;
			},
			off(type, handler): Emitable {
				this.mitt.off(type, handler);
				return;
			},
		},
		on(): Emitable {
			return;
		},
		off(): Emitable {
			return;
		},
		refresh(): Promise<any> {
			const p1 = new Promise((resolve) => { });
			return p1;
		}
	};

	public getSecurityAdvisor(): SecurityAdvisor {
		return this.securityAdvisor;
	}
}
