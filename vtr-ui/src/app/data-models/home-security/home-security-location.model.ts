import { WifiSecurity } from '@lenovo/tan-client-bridge';

export class HomeSecurityLocation {
	isLocationServiceOn: boolean;
	isComputerServiceOn: boolean;
	isDeviceServiceOn: boolean;

	constructor(wifiSecurity?: WifiSecurity) {
		if (wifiSecurity) {
			this.isLocationServiceOn = wifiSecurity.isLocationServiceOn;
			this.isComputerServiceOn = wifiSecurity.isComputerPermissionOn;
			this.isDeviceServiceOn = wifiSecurity.isDevicePermissionOn;
		}
	}
}
