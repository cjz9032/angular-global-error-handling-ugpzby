import { WifiSecurity } from '@lenovo/tan-client-bridge';

export class HomeSecurityLocation {
	isLoading = true;
	isLocationServiceOn = false;
	isComputerServiceOn = true;
	isDeviceServiceOn = true;

	constructor(wifiSecurity?: WifiSecurity) {
		if (wifiSecurity) {
			if (wifiSecurity.isLocationServiceOn !== undefined) {
				this.isLoading = false;
				this.isLocationServiceOn = wifiSecurity.isLocationServiceOn;
			}
			if (wifiSecurity.isComputerPermissionOn !== undefined) {
				this.isComputerServiceOn = wifiSecurity.isComputerPermissionOn;
			}
			if (wifiSecurity.isDevicePermissionOn !== undefined) {
				this.isDeviceServiceOn = wifiSecurity.isDevicePermissionOn;
			}
		}
	}
}
