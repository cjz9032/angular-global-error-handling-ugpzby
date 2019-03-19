import { SecurityAdvisor } from '@lenovo/tan-client-bridge';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})

export class MockSecurityService {

	public getSecurityAdvisor(): SecurityAdvisor {
		return {
			antivirus: null,
			passwordManager: {
				status: 'not-installed',
				mitt: null,
				downloadUrl: '',
				loginUrl: '',
				appUrl: '',
				isDashLaneEdgeVersion: false,
				download() {
					window.open('https://www.dashlane.com/lenovo/');
					this.status = 'active';
				},
				launch() {
					this.status = 'not-installed';
					return Promise.resolve(false);
				},
				refresh() { }
			},
			vpn: {
				status: 'not-installed',
				mitt: null,
				downloadUrl: '',
				download() {
					window.open('https://www.surfeasy.com/lenovo/');
					this.status = 'active';
				},
				launch() {
					this.status = 'not-installed';
					return Promise.resolve('success');
				},
				refresh() {}
			},
			windowsHello: {
				status: 'inactive',
				mitt: null,
				protocolUrl: '',
				supportUrl: '',
				fidoUrl: '',
				windowsHelloProtocol: 'ms-settings:signinoptions',
				launch() {
					this.status = 'active';
					window.open(this.windowsHelloProtocol);
				},
				refresh() { }
			},
			wifiSecurity: null,
			homeProtection: null
		};
	}
}
