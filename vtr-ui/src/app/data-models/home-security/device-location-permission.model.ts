import { WifiSecurity } from '@lenovo/tan-client-bridge';

export class DeviceLocationPermission {
	isLoading = true;
	hasSystemPermissionShowed = false;
	isLocationServiceOn = false;
	isAllAppsServiceOn = true;
	isDeviceServiceOn = true;

	constructor(wifiSecurity?: WifiSecurity) {
		if (wifiSecurity) {
			this.hasSystemPermissionShowed = wifiSecurity.hasSystemPermissionShowed === true;
			this.isLoading = wifiSecurity.isLocationServiceOn === undefined;
			this.isLocationServiceOn = wifiSecurity.isLocationServiceOn === true;
			this.isAllAppsServiceOn = wifiSecurity.isAllAppsPermissionOn === true;
			this.isDeviceServiceOn = wifiSecurity.isDevicePermissionOn === true;
		}
	}
}
