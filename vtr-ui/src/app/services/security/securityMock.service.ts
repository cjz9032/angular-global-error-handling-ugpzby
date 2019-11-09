import {
	Injectable
} from '@angular/core';
import {
	SecurityAdvisor,
	EventTypes
} from '@lenovo/tan-client-bridge';
import mitt from 'mitt';

@Injectable({
	providedIn: 'root',
})
export class SecurityAdvisorMockService {

	private securityAdvisor: SecurityAdvisor = {
		antivirus: {
			mitt: new mitt(),
			mcafeeDownloadUrl: 'https://www.mcafee.com/consumer/en-us/promos/expiry/l714/mls_430/trial/ab/wb.html?cid=239128&culture=en-us&affid=714&pir=1',
			mcafee: null,
			others: null,
			windowsDefender: {
				firewallStatus: true,
				status: true,
				enabled: true
			},
			on(type, handler) {
				return this;
			},
			off() {
				return this;
			},
			refresh() {
				this.mitt.emit(EventTypes.avRefreshedEvent, this);
				return Promise.resolve();
			},
			launch() {
				return Promise.resolve(true);
			},
		},
		passwordManager: {
			status: 'not-installed',
			mitt: new mitt(),
			downloadUrl: 'https://www.dashlane.com/lenovo/',
			loginUrl: 'https://app.dashlane.com',
			appUrl: 'https://app.dashlane.com',
			isDashLaneEdgeVersion: false,
			download() {
				this.status = 'installed';
				this.mitt.emit(EventTypes.pmStatusEvent, this.status);
				return Promise.resolve(true);
			},
			launch() {
				return Promise.resolve(true);
			},
			on(type, handler) {
				return this;
			},
			off() {
				return this;
			},
			refresh() {
				return Promise.resolve();
			}
		},
		vpn: {
			status: 'not-installed',
			mitt: new mitt(),
			downloadUrl: 'https://www.surfeasy.com/lenovo/',
			download() {
				this.status = 'installed';
				this.mitt.emit(EventTypes.vpnStatusEvent, this.status);
				return Promise.resolve(true);
			},
			launch() {
				return Promise.resolve(true);
			},
			on(type, handler) {
				return this;
			},
			off() {
				return this;
			},
			refresh() {
				return Promise.resolve();
			}
		},
		windowsHello: {
			fingerPrintStatus: 'active',
			facialIdStatus: 'inactive',
			systemPasswordStatus: 'active',
			mitt: new mitt(),
			supportUrl: 'https://support.microsoft.com/en-us/help/17215/windows-10-what-is-hello',
			windowsHelloProtocol: 'ms-settings:signinoptions',
			launch() {
				return Promise.resolve(true);
			},
			on(type, handler) {
				return this;
			},
			off() {
				return this;
			},
			refresh() {
				this.mitt.emit(EventTypes.helloFingerPrintStatusEvent, this.fingerPrintStatus);
				this.mitt.emit(EventTypes.helloFacialIdStatusEvent, this.facialIdStatus);
				this.mitt.emit(EventTypes.helloSystemPasswordStatusEvent, this.systemPasswordStatus);
				return Promise.resolve();
			}
		},
		wifiSecurity: {
			mitt: new mitt(),
			state: 'enabled',
			wifiHistory: [{
				ssid: 'lenovo',
				info: '2019/7/1 13:15:32',
				good: '0'
			}],
			isLocationServiceOn: true,
			isComputerPermissionOn: true,
			isDevicePermissionOn: true,
			isLWSPluginInstalled: true,
			hasSystemPermissionShowed: true,
			launchLocationPrivacy() {
				return Promise.resolve(true);
			},
			enableWifiSecurity() {
				this.state = 'enabled';
				this.mitt.emit(EventTypes.wsStateEvent, this.state);
				return Promise.resolve(true);
			},
			disableWifiSecurity() {
				this.state = 'disabled';
				this.mitt.emit(EventTypes.wsStateEvent, this.state);
				return Promise.resolve(true);
			},
			getWifiSecurityStateOnce(): Promise<any> {
				return Promise.resolve();
			},
			updateWifiSecurityState(): void {},
			getWifiSecurityState(): Promise<any> {
				return Promise.resolve();
			},
			getWifiState() {
				this.mitt.emit(EventTypes.wsIsLocationServiceOnEvent, this.isLocationServiceOn);
				return Promise.resolve(true);
			},
			on(type, handler) {
				return this;
			},
			off() {
				return this;
			},
			refresh() {
				let p1 = new Promise((resolve) => {});
				let p2 = new Promise((resolve) => {});
				return Promise.all([p1, p2]);
			},
			cancelGetWifiSecurityState() {}
		},
		setScoreRegistry() {
			return Promise.resolve(true);
		},
		on(type, handler) {
			return this;
		},
		off() {
			return this;
		},
		refresh() {
			return Promise.resolve();
		}
	};

	public getSecurityAdvisor(): SecurityAdvisor {
		return <SecurityAdvisor > this.securityAdvisor;
	}
}
