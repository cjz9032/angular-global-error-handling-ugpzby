import { Injectable } from '@angular/core';
import { DevicePosture } from '@lenovo/tan-client-bridge';

@Injectable({
	providedIn: 'root',
})
export class DevicePostureMockService {
	private devicePosture: DevicePosture = {
		value: [
			{ name: 'PasswordProtection', vulnerable: false },
			{ name: 'HardDriveEncryption', vulnerable: true },
			{ name: 'AntiVirusAvailability', vulnerable: false },
			{ name: 'FirewallAvailability', vulnerable: false },
			{ name: 'AppsFromUnknownSources', vulnerable: true },
			{ name: 'DeveloperMode', vulnerable: true },
			{ name: 'NotActivatedWindows', vulnerable: false },
			{ name: 'UacNotification', vulnerable: false },
		],
		getDevicePosture() {
			return Promise.resolve();
		},
		cancelGetDevicePosture() {},
		on(type, handler) {
			this.mitt.on(type, handler);
			return this;
		},
		off() {
			return this;
		},
		refresh() {
			return Promise.resolve([true]);
		},
	};

	public id = 0;

	public getDevicePosture(): DevicePosture {
		return this.devicePosture;
	}
}
