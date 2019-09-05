import { WifiSecurity } from '@lenovo/tan-client-bridge';

export class HomeSecurityLocation {
	isLocationServiceOn = false;
	isComputerServiceOn = false;
	isDeviceServiceOn = false;

	constructor(wifiSecurity?: WifiSecurity) {
		if (wifiSecurity) {
			if (wifiSecurity.isLocationServiceOn) {
				this.isLocationServiceOn = true;
			}
			if (wifiSecurity.isComputerPermissionOn) {
				this.isComputerServiceOn = true;
			}
			if (wifiSecurity.isDevicePermissionOn) {
				this.isDeviceServiceOn = true;
			}
		}
	}
}
